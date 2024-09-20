'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, createContext } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import ListItem from '@tiptap/extension-list-item'

import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'

import styles from './newArticle.module.css'

import { exportToMarkdown, getFeedback, saveArticle } from "../../lib/editor-helpers"

import { FiSave, FiEye, FiDownload } from 'react-icons/fi'
import { Toaster, toast } from 'react-hot-toast'
import { Editor } from "../../components/Editor"
import { EditorCustomizer } from "../../components/EditorCustomizer"
import { FeedbackCard } from "../../components/FeedbackCard"
import { EditorContext } from "@/app/components/EditorContext"

import { PRO_ROLE } from "../../lib/constants"



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


  const editorContextValue = {
    genre,
    setGenre,
    type,
    setType,
    additionalContext,
    setAdditionalContext,
  };

  

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
      Underline
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
    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${params.id}`)
      if (res.ok) {
        const article = await res.json()
        setTitle(article.title)
        editor?.commands.setContent(article.content)
        setAdditionalContext(article.prefs.additionalContext)
        setGenre(article.prefs.genre)
        setType(article.prefs.type)
      } else {
        console.error('Failed to fetch article')
        toast.error('Failed to fetch article')
      }
      setLoading(false)
    }

    if (editor) {
      setLoading(false )
      fetchArticle()
    }
  }, [ editor])

  


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
          <h1 className="text-2xl font-bold text-blue-600">Edit your writing</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => saveArticle(editor, title, genre, type, additionalContext, toast, params.id, setArticleID)} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
              <FiSave className="mr-2" /> Save
            </button>
            <button onClick={() => exportToMarkdown(editor, toast)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 flex items-center">
              <FiDownload className="mr-2" /> Export
            </button>
            <button onClick={() => getFeedback(editor, title, genre, type, additionalContext,  setFeedback, toast, styles)} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center">
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
        
          <EditorContext.Provider value={editorContextValue}>
            <EditorCustomizer exSetGenre={setGenre} exSetType={setType} exSetAdditionalContext={setAdditionalContext} />  
            <Editor editor={editor} />
          </EditorContext.Provider>
          {/* Feedback Section */}
          <div className="w-full lg:w-1/3 feedback-container sticky top-4 max-h-[80vh] overflow-y-auto p-4 bg-white border border-gray-300 rounded shadow-md" id="feedback-box">
            <h2 className="text-xl font-bold mb-4">Youre editor's thoughts</h2>
            {feedback.length === 0 ? (
              <p className="text-gray-600">No feedback yet. Click on "Review" to let your editor look at your writing.</p>
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

