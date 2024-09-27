import { OpenAI } from "openai"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getSystemPrompt } from '../../lib/prompting'
import { normalizeString } from '../../lib/editor-helpers'

const openai = new OpenAI()

export const maxDuration = 60

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



export async function POST(req) {
  let { content, genre, title, type, additionalContext } = await req.json()
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
    seed: 11112,
    temperature: 0.2
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
    content = normalizeString(content)

    parsedFeedback = parsedFeedback.map((feedback) => {
      if(feedback.error) return feedback
      feedback.originalText = normalizeString(feedback.originalText)
      console.log("Prior start: ", feedback.originalTextPosition.start)
      /* */
      let escapedText = escapeRegExp(feedback.originalText)
      //console.log("Escaped text: ", escapedText)
      let r = new RegExp(escapedText, 'igm')
      let results = r.exec(content)
      //console.log(feedback.originalText)
      //console.log(results)
      //*/
      feedback.originalTextPosition.start = (results?.index >= 0 ) ? results.index : -1
      feedback.originalTextPosition.end = feedback.originalTextPosition.start + feedback.originalText.length  
      console.log("New start: ", feedback.originalTextPosition.start)
      return feedback
    })
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
