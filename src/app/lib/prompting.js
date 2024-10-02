import { PRO_ROLE } from "./constants"
import { bookChapterPrompt } from "./assistants/book-editor"
import { articleTitlePrompt, articlePrompt } from "./assistants/article-writer"
import { newsletterPrompt } from "./assistants/newsletter-author"
import { shortStoryPrompt } from "./assistants/short-story-writer"
import { getCodeCheckPrompts } from "./assistants/tech-article-writer"

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


const TypePromptMapping = {    
    "book-chapter": bookChapterPrompt,
    "article": articlePrompt,
    "newsletter": newsletterPrompt,
    "short-story": shortStoryPrompt,
}


const TypePromptMappingTitle = {    
    "article": articleTitlePrompt,
}



   


function genericPrompt() {
    return  `
    if there are no problems, then:
    - For each suggestion, include the original text (without changing it in any way, including its capitalization, punctuation, or adding or removing any characters, like newlines), 
     the category, 
     the explanation of what is wrong or why a rule is applied here,
    , and the actual suggested text for replacement.
    Use this JSON format:
            
            [
            {
                "originalText": "<text to improve without modifications>",
                "category": "<category>",
                "explanation: "<explanation of the suggestion>",
                "suggestion": "<only suggested text for replacement>",
                "originalTextPosition": {"start": <start position>, "end": <end position>}
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


function genericPromptTitle() {
    return  `
    if there are no problems, then:
    - For each suggestion, include the part of the title that needs improvement,
     the category of the suggestion, 
     the explanation of what is wrong or why a rule is applied here,
    , and the actual suggested text for replacement.
    Use this JSON format:
            
            [
            {
                "originalText": "<text to improve>",
                "category": "<category>",
                "explanation: "<explanation of the suggestion>",
                "suggestion": "<only suggested text for replacement>",
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

function freeTitlePrompt() {
    return `You are a helpful writing assistant. Analyze the provided title of the article and give suggestions in the following format:
            - Idenify potential improvements for the title
            `
}

export function getSystemPromptForCodeChecks(genre, type, additionalContext, title = null, role) {
     let prompt = ''

        prompt = `${getCodeCheckPrompts(genre,title, additionalContext)}
                ${themeGuard(genre)}
                ${genericPrompt()}`

    return prompt
}
          
export function getSystemPromptForTitle(genre, type, additionalContext, title = null, role) {
     let prompt = ''

    if(TypePromptMappingTitle[type] != undefined) {
        prompt = `${TypePromptMappingTitle[type](genre,title, additionalContext)}
                ${themeGuard(genre)}
                ${genericPromptTitle()}`
    } else { 
        console.log("ERROR: the type is invalid!: ", type)
        prompt = `
                ${freeTitlePrompt()} 
                    ${genericTitlePrompt()}  
                `
    }


    return prompt
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