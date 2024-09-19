'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import ListItem from '@tiptap/extension-list-item'

import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import styles from './newArticle.module.css'

import { FiSave, FiEye, FiDownload } from 'react-icons/fi'
import { Toaster, toast } from 'react-hot-toast'
import { Editor } from "../components/Editor"
import { FeedbackCard } from "../components/FeedbackCard"
import { PRO_ROLE } from "../lib/constants"

const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      "id": {
        default: null,
      },
      "class": {
          default: "highlighted-text"
      },
      "style": {
        default: null
      }
    }
  }
})


function getCategoryColor(category) {
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

export default function EditArticle({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [articleID, setArticleID] = useState(null)

  const [genre, setGenre] = useState('')
  const [type, setType] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')



  

  const editor = useEditor({
    extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false, 
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false, 
          },
        }),
      CustomHighlight.configure({ multicolor: true }),
      Markdown,
    ],
    editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
        },
      },
    content: '<p>Start typing...</p>',
    onUpdate: ({ editor }) => {
      // You can add auto-save functionality here
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
   
    if (editor) {
      setLoading(false )
    }
  }, [ editor])

  const getFeedback = async () => {
    const content = editor.getText()
    toast.loading('Fetching feedback...')
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, genre, type, additionalContext }),
    })
    const data = await res.json()
    toast.dismiss()
    if(data.feedback.error !== undefined) {
        console.log("Nothing to do for now...")
        toast('No feedback at the moment.')
        return
    }
    setFeedback(data.feedback)
    highlightText(data.feedback)
    toast.success('Feedback updated!')
  }

  // Highlight the text in the editor based on feedback
  const highlightText = (feedback) => {
    let fullContent = editor.getHTML()
    feedback.forEach(({ originalText, category }, idx) => {
      if (category === "wrong-theme") return
  
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

  const saveArticle = async () => {
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

  const exportToMarkdown = () => {
    const markdownContent = editor.getText()
    // For simplicity, you can copy the markdown content to clipboard or download as a file
    navigator.clipboard.writeText(markdownContent)
    toast('Content copied to clipboard as Markdown')
  }

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toaster for Notifications */}
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">New writing</h1>
          <div className="flex items-center space-x-4">
            <button onClick={saveArticle} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
              <FiSave className="mr-2" /> Save
            </button>
            <button onClick={exportToMarkdown} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 flex items-center">
              <FiDownload className="mr-2" /> Export
            </button>
            <button onClick={getFeedback} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center">
              <FiEye className="mr-2" /> Review
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 mb-6 border border-gray-300 rounded text-2xl font-semibold"
        />

      
        <div className="flex flex-col lg:flex-row gap-6">
        {session?.user && session.user.role === PRO_ROLE && (
        <div className="mb-4">
          <label className="block mb-2">Genre/Main topic:</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="">Select Genre</option>
            <option value="scifi">SciFi</option>
            <option value="romantic">Romantic</option>
            <option value="technical">Technical</option>
            <option value="dystopia">Dystopia</option>
            <option value="comedy">Comedy</option>
            <option value="marketing">Marketing</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            {/* Add more genres as needed */}
          </select>

          <label className="block mb-2">Type:</label>
  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="w-full p-2 mb-4 border border-gray-300 rounded"
  >
    <option value="">Select Type</option>
    <option value="book-chapter">Book Chapter</option>
    <option value="article">Article</option>
    <option value="newsletter">Newsletter</option>
    {/* Add more types as needed */}
  </select>

  {/* Conditional rendering based on the selected type */}
  {type === 'book-chapter' && (
    <div className="mb-4">
      <label className="block mb-2">Brief about the story or intent of the chapter:</label>
      <textarea
        value={additionalContext}
        onChange={(e) => setAdditionalContext(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        rows={4}
        placeholder="Provide a brief summary..."
      ></textarea>
    </div>
  )}

  {type === 'article' && (
    <div className="mb-4">
      <label className="block mb-2">Key points or objectives of the article:</label>
      <textarea
        value={additionalContext}
        onChange={(e) => setAdditionalContext(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        rows={4}
        placeholder="Describe the main points..."
      ></textarea>
    </div>
  )}

  {/* Add more conditional fields for other types if needed */}
        </div>
      )}
            <Editor editor={editor} />
          {/* Feedback Section */}
          <div className="w-full lg:w-1/3 feedback-container sticky top-4 max-h-[80vh] overflow-y-auto p-4 bg-white border border-gray-300 rounded shadow-md" id="feedback-box">
            <h2 className="text-xl font-bold mb-4">AI Feedback</h2>
            {feedback.length === 0 ? (
              <p className="text-gray-600">No feedback yet. Click on "Review" to get AI suggestions.</p>
            ) : (
              <div className="space-y-4">
                {feedback.map((item, index) => (
                 <FeedbackCard key={index} item={item} index={index} /> 
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
