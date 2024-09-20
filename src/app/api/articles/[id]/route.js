// File: app/api/articles/[id]/route.js

import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db()
    const article = await db.collection('articles').findOne({ _id: new ObjectId(params.id) })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { title, content, prefs } = await request.json()

    // Remove all <mark> tags from the content
    const sanitizedContent = content.replace(/<\/?mark[^>]*>/g, '')
  

    const result = await db.collection('articles').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { title, content: sanitizedContent, prefs } },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(result.value)
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db()
    const result = await db.collection('articles').deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
