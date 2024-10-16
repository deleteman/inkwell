import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getCodeCheckFeedback, getTextFeedback, getTitleFeedback } from "@/app/lib/openai"
import { getPendingGenerations, substractGenerations } from "@/app/lib/users"
import { LIMITED_PRO_ROLE } from "@/app/lib/constants"


export const maxDuration = 60


export async function POST(req) {
  const { content, genre, title, type, additionalContext } = await req.json();
  const session = await getServerSession(authOptions);

  const pendingGenerations = await getPendingGenerations(session.user);
  if (pendingGenerations <= 0 && session.user.role === LIMITED_PRO_ROLE) {
    return new Response(
      JSON.stringify({
        error: 'You have reached the maximum number of pending feedback requests. Please get more generations or upgrade your plan.',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    console.log("Getting feedback");

    // Initiate all feedback requests concurrently
    const [titleFeedback, textFeedback, codeCheckFeedback] = await Promise.all([
      getTitleFeedback(content, title, genre, type, additionalContext, session),
      getTextFeedback(content, title, genre, type, additionalContext, session),
      getCodeCheckFeedback(content, title, genre, type, additionalContext, session),
    ]);

    // Combine all feedback into a single array
    const feedback = [
      ...titleFeedback,
      ...textFeedback,
      ...codeCheckFeedback
    ];

    console.log("Feedback: ", feedback);

    await substractGenerations(session.user);

    return new Response(JSON.stringify({ feedback }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error); // Enhanced error logging
    return new Response(JSON.stringify({ error: 'An error occurred while fetching feedback.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // It's good practice to set appropriate HTTP status codes
    });
  }
}
