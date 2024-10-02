import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getCodeCheckFeedback, getTextFeedback, getTitleFeedback } from "@/app/lib/openai"


export const maxDuration = 60


export async function POST(req) {
  let { content, genre, title, type, additionalContext } = await req.json()
  const session = await getServerSession(authOptions)

  try {
    console.log("Getting feedback")
    const feedback = [...(await getTitleFeedback(content, title, genre, type ,additionalContext, session)), 
                      ...(await getTextFeedback(content, title,  genre, type, additionalContext, session)),
                      ...(await getCodeCheckFeedback(content, title,  genre, type, additionalContext, session))]
    console.log("Feedbpack: ", feedback)
    return new Response(JSON.stringify({ feedback }), {
      headers: { 'Content-Type': 'application/json' },
    }) 
  } catch (error) { 
    return new Response(JSON.stringify({ error }), {
      headers: { 'Content-Type': 'application/json' },
    }) 
  }
}
