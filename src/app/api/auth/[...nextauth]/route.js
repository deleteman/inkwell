// File: pages/api/auth/[...nextauth].js or app/api/auth/[...nextauth]/route.js (depending on your Next.js version)

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { DEFAULT_ROLE } from "../../../lib/constants"

export const authOptions = {
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  events: {
    async createUser({ user }) {
      // Update the user in the database to set the default role
      const client = await clientPromise
      const db = client.db()
      await db.collection('users').updateOne(
        { _id: user.id },
        { $set: { role: DEFAULT_ROLE } }
      )
    },
  },
  
  callbacks: {
    async jwt({ token, user, trigger }) {
        if(trigger == "update") { //re-load the user from the db based on the email and updates the user in the token
            console.log("Updating token from the database")
          const client = await clientPromise
          const db = client.db()
          const dbUser = await db.collection('users').findOne({ email: token.email })
          if (dbUser) {
            token.id = dbUser._id
            token.role = dbUser.role
          } else {
              console.log("Error while loading data from DB for user: ", token.email)
              token.role = DEFAULT_ROLE
          }
        } else {
            if (user) {
                token.id = user.id
                token.role = user.role || DEFAULT_ROLE
            }
        }

      return token  
    },
    async session({ session, token}) {
        if(session.user && token && token.id) {
          session.user.id = token.id
          session.user.role = token.role
        }
      return session
    }     
  }
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
