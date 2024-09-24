import { PRO_ROLE } from "./constants"
import { bookChapterPrompt } from "./assistants/book-editor"
import { articlePrompt } from "./assistants/article-writer"
import { newsletterPrompt } from "./assistants/newsletter-author"
import { shortStoryPrompt } from "./assistants/short-story-writer"

function themeGuard(genre) {
    return `If the theme of the text doesn't align with the ${genre} genre, then return the following response:
    [
        {
            "category": "wrong-theme",
            "suggestion": "<your explanation why the text doesn't follow the correct theme>"
        }
    ]
            `
}

function scifiPrompt(genre, additionalContext) {

    return `You're a successful science fiction writer with years of experience in the publishing industry.
            You specialized in the ${genre} genre.
            Analyze the provided text and give suggestions in the following format:
            - Identify specific segments of text that need improvement.
            - Provide feedback in one of the following categories: "re-write with the new proposed text," "can be improved with suggestion," or "too-cliche"

            Keep in mind that the suggestions should be of high quality and the following is a brief about the
            story of the book:

            ${additionalContext}
            Make sure your suggestions take that into account.

`
}

function dystopiaPrompt(genre, additionalContext) {

    return `You're a successful dystopian writer with years of experience in the publishing industry.

            You specialized in the ${genre} genre.
            Analyze the provided text and give suggestions in the following format:
            - Identify specific segments of text that need improvement.
            - Provide feedback in one of the following categories: "re-write with the new proposed text," "can be improved with suggestion," or "too-cliche"   

            Keep in mind that the suggestions should be of high quality and the following is a brief about the
            story of the book:  

            ${additionalContext}    
            Make sure your suggestions take that into account.

`
}   

function fantasyPrompt(genre, additionalContext) {

    return `You're a successful fantasy writer with years of experience in the publishing industry.     
            You specialized in the ${genre} genre.
            Analyze the provided text and give suggestions in the following format: 
            - Identify specific segments of text that need improvement.
            - Provide feedback in one of the following categories: "re-write with the new proposed text," "can be improved with suggestion," or "too-cliche"

            Keep in mind that the suggestions should be of high quality and the following is a brief about the  
            story of the book:

            ${additionalContext}

            Make sure your suggestions take that into account.

`   

}

function technicalPrompt(genre, additionalContext) {
}   

function romanticPrompt(genre, additionalContext) {
}   

function comedyPrompt(genre, additionalContext) {
}




const GenrePromptMapping = {
    "scifi": scifiPrompt,
    "dystopia": dystopiaPrompt,
    "fantasy": fantasyPrompt,
    "technical": technicalPrompt,
    "romantic": romanticPrompt,
    "comedy": comedyPrompt,
}

const TypePromptMapping = {    
    "book-chapter": bookChapterPrompt,
    "article": articlePrompt,
    "newsletter": newsletterPrompt,
    "short-story": shortStoryPrompt,
}






   


function genericPrompt() {
    return  `
    if there are no problems, then:
    - For each suggestion, include the original text (without affecting its capitalization), the category, and the suggestion. Use this JSON format:
            
            [
            {
                "originalText": "<text to improve>",
                "category": "<category>",
                "suggestion": "<suggestion>"
            },
            ...
            ]
            
            Ensure the response is valid JSON, don't add quotes that don't comply with the json format, 
            and only includes segments that need feedback.
            Don't include the response inside a makrkdown code block.
            If you can't process the data accordingly, respond with 
            {
                "error": "<the reason for you not being able to process the data>"
            }
            `

}

function freePrompt() {
    return `You are a helpful writing assistant. Analyze the provided text and give suggestions in the following format:
            - Identify specific segments of text that need improvement.
            - Provide feedback in one of the following categories: "re-write with the new proposed text," "can be improved with suggestion," or "too-cliche"
            `

}   
          

export function getSystemPrompt(genre, type, additionalContext, title = null, role) {
    let prompt = ''

    /*if(role != PRO_ROLE) {
        prompt = ` ${freePrompt()} 
            ${genericPrompt()}
            `
    } else {
        
        */
        if(TypePromptMapping[type] != undefined) {
            prompt = `${TypePromptMapping[type](genre,title, additionalContext)}
                    ${themeGuard(genre)}
                    ${genericPrompt()}`
        } else { 
            console.log("ERROR: the type is invalid!: ", type)
            prompt = `
                    ${freePrompt()} 
                      ${genericPrompt()}  
                    `

       // }
    }

    return prompt
}   