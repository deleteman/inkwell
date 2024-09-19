export const exportToMarkdown = (editor, toast) => {
    const markdownContent = editor.getText()
    // For simplicity, you can copy the markdown content to clipboard or download as a file
    navigator.clipboard.writeText(markdownContent)
    toast('Content copied to clipboard as Markdown')
  }


export const getFeedback = async (editor, title, genre, type, additionalContext, setFeedback, toast, styles) => {
    const content = editor.getText()
    toast.loading('Fetching feedback...')
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, genre, type, additionalContext }),
    })
    const data = await res.json()
    toast.dismiss()
    if(data.feedback.error !== undefined) {
        console.log("Nothing to do for now...")
        toast('No feedback at the moment.')
        return
    }
    setFeedback(data.feedback)
    highlightText(data.feedback, editor, styles)
    toast.success('Feedback updated!')
  }


export const highlightText = (feedback, editor, styles) => {
    let fullContent = editor.getText()
    feedback.forEach(({ originalText, category }, idx) => {
      if (category === "wrong-theme") return
      if(!originalText) return
  
      const color = getCategoryColor(category)
      
      // Escape special regex characters in originalText
      let escapedText = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      
      // Replace all quotes in escapedText with a regex pattern that matches either single or double quotes
      escapedText = escapedText.replace(/['"]/g, '["\']')
      
      // Create a regex with the 'g' flag for global matching
      const regex = new RegExp(escapedText, 'g')
  
      // Use a replacement function to maintain the original matched text's quotes
      fullContent = fullContent.replace(regex, (matchedText) => {
        return `<mark class="${styles.highlightedText} ${color}" id="highlight_${idx}" data-id="highlight_${idx}">${matchedText}</mark>`
      })
    })
    editor.commands.setContent(fullContent)
  }


export const saveArticle = async (editor, title, genre, type, additionalContext, toast, articleID = null, setArticleID) => {
    if(!articleID) { // the article is new
        const res = await fetch(`/api/articles`, {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ title, content: editor?.getHTML(), prefs: { genre, type, additionalContext } }),
        })
        if (res.ok) {
            let data = await res.json()
            setArticleID(data._id)   
        // Display success notification
            toast.success('Article saved successfully!')
        } else {
            console.error('Failed to save article')
            toast.error('Failed to save article')
        }
    } else { // the article is existing
        const res = await fetch(`/api/articles/${articleID}`, {
            method: "PUT",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ title, content: editor?.getHTML(), prefs: { genre, type, additionalContext } }), 
        })
        if (res.ok) {
        // Display success notification
            toast.success('Article updated successfully!')
        } else {
            console.error('Failed to updatearticle')
            toast.error('Failed to update article')
        }
    }
  }

export function getCategoryColor(category) {
  switch (category) {
    case 're-write with the new proposed text': {
      return 'bg-yellow-100'
    }
    case 'can be improved with suggestion':  {
      return 'bg-green-100'
    }
    case 'wrong-theme': {
      return 'bg-red-100'
    }
    case 'too-cliche': {
      return 'bg-orange-100'
    }
    case 'personal-opinion': {
      return 'bg-blue-100'
    }
    case 'informal-language': {
      return 'bg-purple-100'
    }
    case 'uncertain-language': {
      return 'bg-gray-100'
    }
    case 'too-formal': {    
      return 'bg-pink-100'
    }
    case 'too-marketing-oriented': {
      return 'bg-indigo-100'
    }
    case 'incorrect-structure': {
      return 'bg-red-100'
    }
  }
}