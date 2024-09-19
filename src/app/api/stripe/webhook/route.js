import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '../../../lib/mongodb'
import { DEFAULT_ROLE, PRO_ROLE } from '@/app/lib/constants'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const sig = request.headers.get('stripe-signature')

  const buf = await request.arrayBuffer()
  const rawBody = Buffer.from(buf).toString('utf8')

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    console.log("Event detected: ", event)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event.data.object)
      break
    // ... handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  console.log("EVent handled")
  return NextResponse.json({ received: true })
}

async function handleCheckoutSessionCompleted(session) {
  const client = await clientPromise
  const db = client.db()
  const customerId = session.customer

  // Retrieve the user by email
  const userEmail = session.customer_details.email
  const user = await db.collection('users').findOne({ email: userEmail })

  if (user) {
    // Update the user's role to 'pro' and store the Stripe customer ID
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { role: PRO_ROLE, stripeCustomerId: customerId } }
    )
  } else {
    // Handle case where user is not found
    console.error(`User with email ${userEmail} not found.`)
  }
}

async function handleSubscriptionCancellation(subscription) {
  const client = await clientPromise
  const db = client.db()
  const customerId = subscription.customer

  // Retrieve the user associated with the Stripe customer ID
  const user = await db.collection('users').findOne({ stripeCustomerId: customerId })

  if (user) {
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { role: DEFAULT_ROLE } }
    )
  } else {
    // Handle case where user is not found
    console.error(`User with customer ID ${customerId} not found.`)
  }
}
