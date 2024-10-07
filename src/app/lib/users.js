import  clientPromise from './mongodb'

export async function getPendingGenerations(user) {
    const client = await clientPromise
    const db = client.db()
    let userData = await db.collection('users').findOne({ email: user.email })
    return userData.pending_reviews
}

export async function substractGenerations(user) {
    const client = await clientPromise
    const db = client.db()
    try {
        await db.collection('users').updateOne({ email: user.email }, 
            { $inc: { pending_reviews: -1 } });
    } catch(error) {
        console.log("Error reducing pending reviews")
        console.log(error)
    }
   }