// File: lib/mongodb.js

import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_CONNECTION_STRING

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

let client
let clientPromise

try {
    if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
    } else {
    // In production mode, don't use a global variable
        client = new MongoClient(uri)
        clientPromise = client.connect()
    }

} catch(e) {
    console.error(e)
}

export default clientPromise
