export const generalFeedbackCategories = ["wrong-theme",
                                  "title-too-bland",
                                  "title-too-short",
                                  "poor-title",
                                  "promise-unfulfilled"
                                  ]
 export const titleAffectingCategories = ["title-too-bland",
                                          "title-too-short",
                                          "poor-title"
                                          ]


export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const exportToMarkdown = (editor, toast) => {
    const markdownContent = editor.getText()
    // For simplicity, you can copy the markdown content to clipboard or download as a file
    navigator.clipboard.writeText(markdownContent)
    toast('Content copied to clipboard as Markdown')
  }


export const getFeedback = async (editor, title, genre, type, additionalContext, setFeedback, toast, styles, doneCB = null) => {
    const content = editor.getText()
    toast.loading('Fetching feedback...')
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, genre, type, additionalContext }),
    })
    const data = await res.json()
    if(typeof doneCB === "function") {
      doneCB()
    }
    toast.dismiss()
    if(data.error) {
      data.feedback = [data]
    }
    if(data.feedback?.error !== undefined) {
        toast('No feedback at the moment.')
        return
    }
  console.log("total feedback elements:", data.feedback.length)
    const sortedFeedback = data.feedback
    .map(a => {
      if(generalFeedbackCategories.includes(a.category)){
          a.originalTextPosition = { start: -1 }
        }
        return a
      }).sort((a, b) => a.originalTextPosition?.start - b.originalTextPosition.start);

    setFeedback(sortedFeedback)
    //highlightText(sortedFeedback, editor, styles)
    toast.success('Feedback updated!')
  }


  /**
   * Cleans and normalizes the text by:
   * - Removing leading/trailing whitespace and newlines.
   * - Replacing multiple consecutive newlines with a single newline.
   * - Collapsing multiple spaces into a single space.
   * @param {string} text - The text to clean.
   * @returns {string} - The cleaned and normalized text.
   */
  const cleanAndNormalizeText = (text) => {
    if (!text) return '';
  
    // Remove leading and trailing whitespace and newlines
    let cleaned = text.replace(/^[\s\n]+|[\s\n]+$/g, '');
  
    // Replace multiple consecutive newlines with a single newline
    cleaned = cleaned.replace(/[\n]{2,}/g, '\n');
  
    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
    return cleaned;
  };
  
   export function replaceRange(s, start, end, substitute) {
    let p1 = s.substring(0, start) 
    let p2 = s.substring(end)
    //console.log(p1)
    //console.log(substitute)
    //console.log(p2) 
    return  p1 + substitute + p2
}

export const highlightText = (feedback, editor, styles) => {
  let fullContent = editor.getText()
  let offset  = 0

  const filteredFeedback = feedback.filter(fb => !generalFeedbackCategories.includes(fb.category))
  // Sort feedback by starting position
  console.log("new total feedback elements:", feedback.length)

  // Merge overlapping feedbacks
  const mergedFeedback = [];
  for (const fb of filteredFeedback) {
    if (mergedFeedback.length === 0 || fb.originalTextPosition.start >= mergedFeedback[mergedFeedback.length - 1].originalTextPosition.end) {
      mergedFeedback.push(fb);
    } else {
      console.log("Merging: ")
      const lastMergedFb = mergedFeedback[mergedFeedback.length - 1];

      console.log(lastMergedFb)
      console.log(fb)
      lastMergedFb.originalTextPosition.end = Math.max(lastMergedFb.originalTextPosition.end, fb.originalTextPosition.end);
      lastMergedFb.category = 'multiple'; // or some other way to indicate merged feedback
      lastMergedFb.subFeedback = [fb]
      lastMergedFb.suggestion = `${lastMergedFb.suggestion} <br/> ${fb.suggestion}`;
    }
  }
  console.log("merged total feedback elements:", mergedFeedback.length) 

  mergedFeedback.forEach(({ originalText, category, originalTextPosition }, idx) => {
    console.log(category, "-", idx)
    if (category === "wrong-theme" || !originalText) return;
    if( generalFeedbackCategories.includes(category)) return;

    const color = getCategoryColor(category);

    //console.log("orignalText:", originalText);
    
    const replacedValue = `<mark class="${styles.highlightedText} ${color}" 
                              id="highlight_${idx}" 
                              data-id="highlight_${idx}">${originalText}</mark>`
    //console.log("New replacement, starting at: ", originalTextPosition.start, "with an offset of ", offset)
    let start = originalTextPosition.start + offset
    let end = originalTextPosition.end + offset
    offset += replacedValue.length - originalText.length
    fullContent = replaceRange(fullContent, start, end, replacedValue)
  });

  //console.log('\nFinal Highlighted Content:', fullContent);
  
  // Step 3: Update the editor content with highlighted text
  editor.commands.setContent(fullContent);
};
  
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



/**
 * Normalizes a string by replacing non-standard characters with their standard equivalents.
 *
 * @param {string} str - The input string to be normalized.
 * @returns {string} - The normalized string with standard characters.
 */
export function normalizeString(str) {
  // Mapping of non-standard characters to their standard equivalents
  const charMap = {
    // Curly Single Quotes
    '’': "'", // Right single quotation mark
    '‘': "'", // Left single quotation mark

    // Curly Double Quotes
    '“': '"', // Left double quotation mark
    '”': '"', // Right double quotation mark

    // Dashes
    '–': '-', // En dash
    '—': '-', // Em dash

    // Ellipsis
    '…': '...', // Ellipsis

    // Symbols
    '™': 'TM',   // Trademark
    '®': 'R',    // Registered trademark
    '©': '(c)',  // Copyright
    '±': '+/-',  // Plus-minus sign
    '÷': '/',    // Division sign
    '×': 'x',    // Multiplication sign

    // Accented Characters (Optional: Add as needed)
    'é': 'e',
    'è': 'e',
    'ê': 'e',
    'ë': 'e',
    'á': 'a',
    'à': 'a',
    'â': 'a',
    'ä': 'a',
    'ó': 'o',
    'ò': 'o',
    'ô': 'o',
    'ö': 'o',
    'ú': 'u',
    'ù': 'u',
    'û': 'u',
    'ü': 'u',

 // Non-standard space characters
 '\u00A0': ' ', // Non-breaking space (NBSP)
 '\u2002': ' ', // En space
 '\u2003': ' ', // Em space
 '\u2009': ' ', // Thin space
 '\u200A': ' ', // Hair space
 '\u2007': ' ', // Figure space
 '\u2008': ' ', // Punctuation space
 '\u200B': ' ', // Zero-width space
 '\u3000': ' ', // Ideographic space

    // non-standard coding characters
    '\u202F': ' ', // Narrow no-break space
    '\u2000': ' ', // En quad
    '\u2001': ' ', // Em quad
    '\u2002': ' ', // En space
    '\u2003': ' ', // Em space
    '\u2004': ' ', // Three-per-em space
    '\u2005': ' ', // Four-per-em space
    '\u2006': ' ', // Six-per-em space
    '\u2008': ' ', // Punctuation space
    '\u2009': ' ', // Thin space
    '\u200A': ' ', // Hair space
    '\u2028': ' ', // Line separator
    '\u2029': ' ', // Paragraph separator
    '\u202F': ' ', // Narrow no-break space
    '\u205F': ' ', // Medium mathematical space
    '\u3000': ' ', // Ideographic space
    // Add more mappings here
  };

  // Create a regular expression that matches any of the keys in charMap
  const regex = new RegExp(Object.keys(charMap).join('|'), 'g');

  // Replace each match with its corresponding value from charMap
  return str.replace(regex, (matched) => charMap[matched] || matched);
}