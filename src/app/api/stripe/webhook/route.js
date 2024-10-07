import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '../../../lib/mongodb'
import { MAX_LIMITED_PRO_REVIEWS, DEFAULT_ROLE, LIMITED_PRO_ROLE, PRICE_ID_TO_ROLE} from '@/app/lib/constants'

export const maxDuration = 60

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const sig = request.headers.get('stripe-signature')

  const buf = await request.arrayBuffer()
  const rawBody = Buffer.from(buf).toString('utf8')

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    console.log("Event detected: ", event.type)
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

  return NextResponse.json({ received: true })
}


async function handleCheckoutSessionCompleted(session) {
  const client = await clientPromise
  const db = client.db()
  const customerId = session.customer

  let fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'customer']
  })
  console.log("Handling checkout session completed...")
  // Retrieve the subscription ID from the session
  try {
   
    const items = fullSession.line_items.data;
    console.log("Fullsession: ", fullSession)

    //const items = session.line_items?.data;

    if (items.length === 0) {
      console.error(`No subscription items found for subscription ID ${subscriptionId}.`)
      return
    }

    // Assuming single item subscription; adjust if multiple items are possible
    const priceId = items[0].price.id

    console.log("price id used: ", priceId)

    // Determine the role based on the Price ID
    const role = PRICE_ID_TO_ROLE[priceId] || DEFAULT_ROLE

    // Retrieve the user by email
    const userEmail = session.customer_details.email
    const user = await db.collection('users').findOne({ email: userEmail })

    if (user) {
      let payload = { role: role, stripeCustomerId: customerId }
      if(role == LIMITED_PRO_ROLE) {
        payload.pending_reviews = MAX_LIMITED_PRO_REVIEWS
      }
      // Update the user's role and store the Stripe customer ID
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set:  payload}
      )
      console.log(`Updated user ${userEmail} to role ${role}`)
    } else {
      // Handle case where user is not found; create the user
      console.log(`User with email ${userEmail} not found, creating a new user with role ${role}.`)
      let newUser = {
        email: userEmail,
        role: role,
        stripeCustomerId: customerId,
        // Add other user fields as necessary
      }
      if(role == LIMITED_PRO_ROLE) {
        newUser.pending_reviews = MAX_LIMITED_PRO_REVIEWS
      }
      await db.collection("users").insertOne(newUser)
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error)
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
