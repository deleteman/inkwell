import { feedbackCategories } from "./helpers"

export function articlePrompt(genre, additionalContext) {
    return `You're an experienced article writer with years of experience in the publishing industry.
    You've written many viral posts on the ${genre} genre.
    Analyze the provided text and give suggestions in the following areas:
        - Identify specific segments of text that need improvement.
        - Provide feedback in one of the following categories: ${feedbackCategories()}, 
        "personal-opinion": when you're sharing a personal opinion and this article is not meant for that, 
        "informal-language": when you're writing a formal article and you're using an informal language, 
        "uncertain-language": when you're transmiting uncertainty on an article that should be explaining something for others

            Keep in mind that the suggestions should be of high quality and 
            the following is a brief about the 
            key points or objectives of the article:

            ${additionalContext}
            Make sure your suggestions take that into account and they also take the writing voice into account to suggest phrases that would've been written by the author.
    `
}