import { feedbackCategories } from "./helpers"
import { getTechnicalArticleChecks } from "./tech-article-writer"

export function articlePrompt(genre, title, additionalContext) {
    return `You're an experienced article writer with years of experience in the publishing industry.
    You've written many viral posts on the ${genre} genre.
    Analyze the provided text and give suggestions in the following areas:
        - Identify specific segments of text that need improvement.
        - Provide feedback in one or more of the following categories: 
        ${feedbackCategories()}, 
        "personal-opinion": when you're sharing a personal opinion and this article is not meant for that, 
        "informal-language": when you're writing a formal article and you're using an informal language, 
        "uncertain-language": when you're transmiting uncertainty on an article that should be explaining something for others
        "poor-intro": when the introduction to the article doesn't work and doesn't catch the reader's attention
        "misleading-intro": when the introducton to the article fails to foreshadow the rest of the article
        "missing-cta": when the article doesn't have a clear call-to-action at the end of the article
        "passive-voice": when the author uses passive voice instead of active voice (i.e "The movie ET was directed by Spielberg" is passive vs "Spielberg directed the movie ET.")
        ${(genre == "technical") ? getTechnicalArticleChecks() : ""}

        Only apply the title-related rules to the following title:
        "${title}"
        Do not, under any condition, apply the title-related rules to any other part of the article.

        Keep in mind that the suggestions should be of high quality 
        Make sure your suggestions mimic the writing voice and style of the author to suggest phrases 
        that would've been written by the author.

    `
}