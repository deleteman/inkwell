// File: app/api/articles/route.js

import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { ObjectId } from 'mongodb'

export async function GET() {
  const session = await getServerSession(authOptions)
  try {
    const client = await clientPromise
    const db = client.db()
    const articles = await db.collection('articles').find({userId: session?.user?.id}).toArray()
    return NextResponse.json(articles)
  } catch (error) {
    console.error('GET All Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
    const session = await getServerSession(authOptions)
  
    try {
      const client = await clientPromise
      const db = client.db()
      const { title, content, prefs } = await request.json()
  
      // Remove all <mark> tags from the content
      const sanitizedContent = content.replace(/<\/?mark[^>]*>/g, '')
  
      const result = await db.collection('articles').insertOne({
        title,
        content: sanitizedContent,
        prefs,
        userId: session?.user?.id,
        createdAt: new Date(),
      })
  
      return NextResponse.json(
        { _id: result.insertedId, title, content: sanitizedContent, createdAt: new Date() },
        { status: 201 }
      )
    } catch (error) {
      console.error('POST Error:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
  