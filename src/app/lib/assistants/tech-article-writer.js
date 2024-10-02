
export function getTechnicalArticleChecks() {
    return `
    "technically-incorrect": when a sentence is not true from the technical point of view
    "explanation-too-technical": when the explanation is too technical and could be simplified to help others understand the concept
    "promise-unfulfilled": when the promise of the article, including the title and the introduction are not met inside the body of the article
    `
}

export function getCodeCheckPrompts(genre,title, additionalContext) {

    return `
    You're an experienced software developer with years of experience.
    Analyze the provided text and for each code snipppet in the article, give suggestions in the following areas:
        "potential-code-bug": if there is a bug inside a code snippet
        "hard-to-understand": if there is a more readable way to write the code example
    `   
}


export function getTechnicalTitleChecks() {
    return `
    "title-too-bland": when the title of the article is boring and would not generate interest from new readers (only applies to the content marked as the title)
    "title-too-short": when the title of the article is too short to transmit any valid idea about the article (only applies to the content marked as the title)
    "poor-title": when the title of the article doesn't really describe the article. This rule only applies to the title of the article.
    `
}