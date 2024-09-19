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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || DEFAULT_ROLE
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
