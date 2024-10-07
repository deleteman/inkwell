import { OpenAI } from "openai"
import  { normalizeString, escapeRegExp } from "../lib/editor-helpers"
import { getSystemPrompt, getSystemPromptForCodeChecks, getSystemPromptForTitle } from "./prompting"


const openai = new OpenAI()

const LLM_SEED = Math.round(Math.random() * 100000)// LLM_SEED
const LLM_MODEL = "gpt-4o-mini"
const LLM_TEMPERATURE = 0.3



/**
 * Enhances the original text to create a regex pattern that ignores whitespace differences.
 *
 * @param {string} text - The original text to be escaped and modified.
 * @return {string} - The regex pattern string.
 */
function createFlexibleRegexPattern(text) {
    // Escape regex special characters
    let escapedText = escapeRegExp(text);
    // Replace all whitespace characters with \s+ to allow for flexible matching
    escapedText = escapedText.replace(/\s+/g, '\\s+');
    return escapedText;
}

export async function getCodeCheckFeedback(content, title, genre, type, additionalContext, session) {
    console.log("Getting code bugs feedback");
    
    const payload = [
        { 
            role: "system", 
            content: getSystemPromptForCodeChecks(genre, type, additionalContext, title, session?.user?.role)  
        },
        { role: "user", content }   
    ];

    console.log("Payload:", payload);

    try {
        const completion = await openai.chat.completions.create({
            model: LLM_MODEL,   
            messages: payload,
            seed: LLM_SEED,
            temperature: LLM_TEMPERATURE 
        });

        const feedback = completion.choices[0].message?.content;
        console.log("Completion Choices:", completion.choices);
        
        // Attempt to parse the feedback as JSON to ensure it adheres to the requested format
        let parsedFeedback = JSON.parse(feedback);
        if (!Array.isArray(parsedFeedback)) {
            parsedFeedback = [parsedFeedback];
        }

        // Normalize the content for consistent matching
        const normalizedContent = normalizeString(content);

        parsedFeedback = parsedFeedback.map((feedbackItem) => {
            if (feedbackItem.error) return feedbackItem;
            if (feedbackItem.category == "wrong-theme") return;

            // Normalize the original text
            const normalizedOriginalText = normalizeString(feedbackItem.originalText);
            feedbackItem.originalText = normalizedOriginalText;

            console.log("Prior start:", feedbackItem.originalTextPosition.start);

            // Create a flexible regex pattern that ignores whitespace differences
            const regexPattern = createFlexibleRegexPattern(normalizedOriginalText);
            const regex = new RegExp(regexPattern, 'i'); // Case-insensitive

            const match = regex.exec(normalizedContent);

            if (match) {
                feedbackItem.originalTextPosition.start = match.index;
                feedbackItem.originalTextPosition.end = match.index + match[0].length;
                console.log("New start:", feedbackItem.originalTextPosition.start);
                console.log("New end:", feedbackItem.originalTextPosition.end);
            } else {
                feedbackItem.originalTextPosition.start = -1;
                feedbackItem.originalTextPosition.end = -1;
                console.warn(`Original text "${feedbackItem.originalText}" not found in content.`);
            }

            return feedbackItem;
        });

        //Errors here mean there is no code to check, which is not necesarily a bad thing
        if(parsedFeedback[0].error) {
          parsedFeedback[0].notice = parsedFeedback[0].error;
          delete parsedFeedback[0].error;
        }

        return parsedFeedback;

    } catch (error) {
        console.error('Failed to parse feedback or process completion:', error);
        throw { error: 'Invalid response format from OpenAI or processing error.' };
    }
}


export async function getTitleFeedback(content, title, genre, type, additionalContext, session) {
    console.log("Getting title feedback")
  const payload = [
      { 
        role: "system", 
        content: getSystemPromptForTitle(genre, type, additionalContext, title, session?.user?.role)  
      },
      { role: "user", content: JSON.stringify({
                        title: title, 
                        body: content
                    })
      }   
    ]

  try {
    //console.log("Payload: ", payload)
  const completion = await openai.chat.completions.create({
    model: LLM_MODEL,   
    messages: payload,
    seed: LLM_SEED,
    temperature:LLM_TEMPERATURE 
  })

  const feedback = completion.choices[0].message?.content
  //console.log(completion.choices)
  
  // Attempt to parse the feedback as JSON to ensure it adheres to the requested format
  let parsedFeedback = JSON.parse(feedback)
    if(!Array.isArray(parsedFeedback)) {
        parsedFeedback = [parsedFeedback]
    }
    
    return parsedFeedback

  } catch (error) {
    console.error('Failed to parse feedback:', error)
    throw new { error: 'Invalid response format from OpenAI' }
  }
}

export async function getTextFeedback(content, title, genre, type, additionalContext, session) {
    console.log("GEtting text feedback")
  const payload = [
      { 
        role: "system", 
        content: getSystemPrompt(genre, type, additionalContext, title, session?.user?.role)  
      },
      { role: "user", content: normalizeString(content) }
    ]

    console.log(payload)
  const completion = await openai.chat.completions.create({
    model: LLM_MODEL,
    messages: payload,
    seed: LLM_SEED,
    temperature:LLM_TEMPERATURE 
  })

  const feedback = completion.choices[0].message?.content
  //console.log(completion.choices)
  
  // Attempt to parse the feedback as JSON to ensure it adheres to the requested format
  let parsedFeedback = null;
  try {
    parsedFeedback = JSON.parse(feedback)
    if(!Array.isArray(parsedFeedback)) {
        parsedFeedback = [parsedFeedback]
    }
    content = normalizeString(content)

    parsedFeedback = parsedFeedback.map((feedback) => {
      if(feedback.error) return feedback
      feedback.originalText = normalizeString(feedback.originalText)
      console.log("Prior start: ", feedback.originalTextPosition.start)
      let escapedText = escapeRegExp(feedback.originalText)
      let r = new RegExp(escapedText, 'igm')
      let results = r.exec(content)

      feedback.originalTextPosition.start = (results?.index >= 0 ) ? results.index : -1
      feedback.originalTextPosition.end = feedback.originalTextPosition.start + feedback.originalText.length  
      console.log("New start: ", feedback.originalTextPosition.start)
      return feedback
    })
    return parsedFeedback

  } catch (error) {
    console.error('Failed to parse feedback:', error)
    throw new { error: 'Invalid response format from OpenAI' }
  }
}