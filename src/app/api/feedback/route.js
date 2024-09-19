import { OpenAI } from "openai"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getSystemPrompt } from '../../lib/prompting'

const openai = new OpenAI()

export const maxDuration = 60

export async function POST(req) {
  const { content, genre, type, additionalContext } = await req.json()
  const session = await getServerSession(authOptions)


  const payload = [
      { 
        role: "system", 
        content: getSystemPrompt(genre, type, additionalContext, session?.user?.role)  
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

  /*
  const completion = [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: '[\n' +
          '  {\n' +
          '    "originalText": "Remember when the MERN stack was the Beyoncé of web development stacks?",\n' +
          '    "category": "too cliché",\n' +
          '    "suggestion": "Consider revising this metaphor to avoid clichés and create a more original comparison."\n' +
          '  },\n' +
          '  {\n' +
          '    "originalText": "or has it become the MySpace of web development?",\n' +
          '    "category": "too cliché",\n' +
          `    "suggestion": "Instead of using MySpace as a comparison, consider using a more current or unique reference that resonates with today's web landscape."\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "The beauty of the MERN stack lies in its unified language across the stack.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Consider rephrasing to make it clearer why this 'beauty' matters, such as: 'One of the key advantages of the MERN stack is its use of a single language, JavaScript, across the entire stack, which simplifies development and reduces the learning curve for developers.'"\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "This homogeneity reduces the need for context switching between languages, leading to a more streamlined and efficient development process.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Rephrase this for clarity and impact, e.g., 'By eliminating the need to switch between different programming languages, this uniformity enables a more efficient and cohesive development workflow.'"\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "The stack allows for rapid development due to its simplicity and the fact that developers can use JavaScript across the entire stack.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Revise for conciseness and clarity: 'Its simplicity and use of JavaScript at every level facilitate rapid development, making it ideal for swift project iterations.'"\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "If you’re building a Minimum Viable Product (MVP) or a prototype to test an idea quickly, MERN is a solid choice.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Instead of 'a solid choice,' consider a more assertive characterization like 'an optimal solution' to convey confidence in the recommendation."\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "It can handle a fair amount of traffic and data if set up correctly.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Rephrase to enhance clarity, for example: 'When configured properly, it can efficiently manage moderate traffic and data demands.'"\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "the MERN stack isn’t a one-size-fits-all solution.",\n' +
          '    "category": "too cliché",\n' +
          `    "suggestion": "Rephrase this common phrase to something more unique, like 'the MERN stack may not suit every scenario.'"\n` +
          '  },\n' +
          '  {\n' +
          '    "originalText": "But like any tool, it’s essential to evaluate it against your project’s unique needs and constraints before diving in.",\n' +
          '    "category": "can be improved with suggestion",\n' +
          `    "suggestion": "Consider rephrasing for a stronger impact: 'However, as with any development tool, careful evaluation against your project's specific requirements is crucial before proceeding.'"\n` +
          '  }\n' +
          ']',
        refusal: null
      },
      logprobs: null,
      finish_reason: 'stop'
    }
  ]
  const feedback = completion[0].message.content
  */
  
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
