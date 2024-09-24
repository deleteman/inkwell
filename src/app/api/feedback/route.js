import { OpenAI } from "openai"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getSystemPrompt } from '../../lib/prompting'

const openai = new OpenAI()

export const maxDuration = 60

export async function POST(req) {
  const { content, genre, title, type, additionalContext } = await req.json()
  const session = await getServerSession(authOptions)


  const payload = [
      { 
        role: "system", 
        content: getSystemPrompt(genre, type, additionalContext, title, session?.user?.role)  
      },
      { role: "user", content }
    ]

    console.log(payload)
    /* */
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: payload,
  })

  const feedback = completion.choices[0].message?.content
  console.log(completion.choices)
  // */

  
  
  // Attempt to parse the feedback as JSON to ensure it adheres to the requested format
  let parsedFeedback
  try {
    parsedFeedback = JSON.parse(feedback)
    console.log(parsedFeedback)
    if(!Array.isArray(parsedFeedback)) {
        parsedFeedback = [parsedFeedback]
    }
  } catch (error) {
    console.error('Failed to parse feedback:', error)
    return new Response(JSON.stringify({ error: 'Invalid response format from OpenAI' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  return new Response(JSON.stringify({ feedback: parsedFeedback }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
