import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import clientPromise from '../../../lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.user.email

  try {
    // Check if user already has a Stripe Customer ID stored
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email })

    let stripeCustomerId = user?.stripeCustomerId

    if (!stripeCustomerId) {
      // Create a new Stripe Customer
      const customer = await stripe.customers.create({
        email,
        name: session.user.name,
      })

      stripeCustomerId = customer.id

      // Store the Stripe Customer ID in your database
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { stripeCustomerId } }
      )
    }

    console.log("Stripe Customer ID:", stripeCustomerId)
    return NextResponse.json({ stripeCustomerId })
  } catch (error) {
    console.error('Error getting or creating customer:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
