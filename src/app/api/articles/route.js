// File: app/api/articles/route.js

import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const articles = await db.collection('articles').find({}).toArray()
    return NextResponse.json(articles)
  } catch (error) {
    console.error('GET All Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { title, content, prefs } = await request.json()
    const result = await db.collection('articles').insertOne({
      title,
      content,
      prefs,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { _id: result.insertedId, title, content, createdAt: new Date() },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
