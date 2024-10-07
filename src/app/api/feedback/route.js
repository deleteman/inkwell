import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getCodeCheckFeedback, getTextFeedback, getTitleFeedback } from "@/app/lib/openai"
import { getPendingGenerations, substractGenerations } from "@/app/lib/users"
import { LIMITED_PRO_ROLE } from "@/app/lib/constants"


export const maxDuration = 60


export async function POST(req) {
  let { content, genre, title, type, additionalContext } = await req.json()
  const session = await getServerSession(authOptions)

  let pendingGenerations = await getPendingGenerations(session.user)
  if(pendingGenerations <= 0 && session.user.role === LIMITED_PRO_ROLE) {
    return new Response(JSON.stringify({ error: 'You have reached the maximum number of pending feedback requests. Please get more generations or upgrade your plan.' }), {
      headers: { 'Content-Type': 'application/json' },
    }) 
  }
  try {
    console.log("Getting feedback")
    const feedback = [...(await getTitleFeedback(content, title, genre, type ,additionalContext, session)), 
                      ...(await getTextFeedback(content, title,  genre, type, additionalContext, session)),
                      ...(await getCodeCheckFeedback(content, title,  genre, type, additionalContext, session))]
    console.log("Feedbpack: ", feedback)
    await substractGenerations(session.user)
    return new Response(JSON.stringify({ feedback }), {
      headers: { 'Content-Type': 'application/json' },
    }) 
  } catch (error) { 
    return new Response(JSON.stringify({ error }), {
      headers: { 'Content-Type': 'application/json' },
    }) 
  }
}
