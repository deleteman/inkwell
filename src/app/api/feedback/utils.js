// pages/api/feedback/utils.js

import { getServerSession } from 'next-auth/next'
import { getPendingGenerations, substractGenerations } from "@/app/lib/users"
import { authOptions } from '../auth/[...nextauth]/route'
import { LIMITED_PRO_ROLE } from '@/app/lib/constants'; 

export async function handleFeedbackRequest(req, res, feedbackFunction) {
  const { content, genre, title, type, additionalContext } = await req.json();

  if (!content || !title || !genre || !type) {
    return new Response({ error: 'Missing required fields' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let pendingGenerations = await getPendingGenerations(session.user);
  if (pendingGenerations <= 0 && session.user.role === LIMITED_PRO_ROLE) {
    return new Response({ error: `You have reached the maximum number of pending feedback requests. Please get more 
                                generations or upgrade your plan.`,
                        }, { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const feedback = await feedbackFunction(content, title, genre, type, additionalContext, session);

    await substractGenerations(session.user);

    return new Response(JSON.stringify({ feedback }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
     return new Response(JSON.stringify({ error: 'An error occurred while fetching feedback.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // It's good practice to set appropriate HTTP status codes
    });
  }
}
