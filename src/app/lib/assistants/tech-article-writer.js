
export function getTechnicalArticleChecks() {
    return `
    "title-too-bland": when the title of the article is just boring
    "title-too-short": when the title of the article is too short
    "poor-title": when the title of the article doesn't really describe the article. This rule only applies to the title of the article.
    "technically-incorrect": when a sentence is not true from the technical point of view
    "explanation-too-technical": when the explanation is too technical and could be simplified to help others understand the concept
    "potential-code-bug": if there is a bug inside a code snippet
    "promise-unfulfilled": when the promise of the article, including the title and the introduction are not met inside the body of the article
    `
}