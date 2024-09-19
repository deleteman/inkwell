import Stripe from 'stripe'
import clientPromise from './mongodb'


export async function getOrCreateCustomer(email, name) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
  
    // Check if user already has a Stripe Customer ID stored
    const user = await usersCollection.findOne({ email })
  
    let stripeCustomerId = user?.stripeCustomerId
  
    if (!stripeCustomerId) {
      // Create a new Stripe Customer
      const customer = await stripe.customers.create({
        email,
        name,
      })
  
      stripeCustomerId = customer.id
  
      // Store the Stripe Customer ID in your database
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { stripeCustomerId } }
      )
    }
  
    return stripeCustomerId
  }
  