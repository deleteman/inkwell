import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'
import { Extension,markPasteRule } from '@tiptap/core'

import { FiSave, FiEye, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaSpinner } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast'
import { useState } from 'react'
import { Editor } from "../components/Editor"
import { FeedbackCard } from "../components/FeedbackCard"
import { getFeedback } from '../lib/editor-helpers'
import { useEffect } from 'react'

import { EditorContext } from "@/app/components/EditorContext"
import styles from './editorComponent.module.css'

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

const defaultSettings = {
    title: "New article",
    showButtonBar: true,
    getFeedbackEnabled: true
}


export function EditorComponent({ 
    settings = {},
    onSaveArticle = null, 
    onGetFeedback = null, 
    articleID, 
    onSetArticleID
 }) {   

    settings = {...defaultSettings, ...settings} //overwrite default values

    const [genre, setGenre] = useState("technical")
    const [type, setType] = useState("article")
    const [title, setTitle] = useState("")
    const [additionalContext, setAdditionalContext] = useState("") //empty because we don' need more context for tech articles
    const [feedback, setFeedback] = useState([])
   const [loading, setLoading] = useState(true)
   const [localArticleID, setLocalArticleID] = useState(articleID)
   const [gettingFeedback, setGettingFeedback] = useState(false)

const editor = useEditor({
    immediatelyRender: false,
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
      Underline, 
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
     transformPastedHTML: (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent;
    },
     onPaste: (event) => {
        console.log("On paste")
        console.log(event)
      },
    },
    content: '<p>Start typing...</p>',
  })

  if(!onSetArticleID) {
    onSetArticleID = (id) => {
      setLocalArticleID(id)
    }
  }
  
  const editorContextValue = {
    genre,
    setGenre,
    type,
    setType,
    title,
    setTitle,
    additionalContext,
    setAdditionalContext,
  };


     useEffect(() => {
    const fetchArticle = async () => {
        if(!articleID) {
            console.log("There is no article ID")
            setLoading(false)
            return
        }
      const res = await fetch(`/api/articles/${articleID}`)
      console.log("Loading article...")
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
      fetchArticle()
    } else {
      console.log("Editor is not ready yet")
    }
  }, [editor])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Toaster for Notifications */}
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">{settings.title}</h1>
          <div className="flex items-center space-x-4">
            {onSaveArticle && 
            <button
              onClick={() => {
                if(onSaveArticle) 
                 onSaveArticle(editor, title, genre, type, additionalContext, toast, localArticleID, onSetArticleID)
                }}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <FiSave className="mr-2" /> Save
            </button>
            }
            <button
              onClick={() =>{
                if(onGetFeedback) {
                    setGettingFeedback(true)
                    getFeedback(editor, title, genre, type, additionalContext, setFeedback, toast, styles, () => setGettingFeedback(false)) 
                    onGetFeedback()
                }
                }}
                disabled={!settings.getFeedbackEnabled || gettingFeedback}
              className={`bg-${settings.getFeedbackEnabled && !gettingFeedback ? 'green-500' : 'gray-800'} 
                          text-white px-4 py-2 rounded-full 
                          hover:bg-${settings.getFeedbackEnabled && !gettingFeedback ? 'green-600' : 'gray-900'} transition duration-300 flex items-center`}
            >
              <FiEye className="mr-2" /> Review
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <EditorContext.Provider value={editorContextValue}>
        

        {/* Editor and Feedback Section */}
        <div className="flex-1 p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 mb-6 border border-gray-300 rounded text-2xl font-semibold text-gray-600"
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {editor && <Editor editor={editor} showButtons={settings.showButtonBar} />}
            {/* Feedback Section */}
            <div
              className="w-full lg:w-1/3 feedback-container sticky top-4 max-h-[80vh] overflow-y-auto p-4 bg-white border border-gray-300 rounded shadow-md"
              id="feedback-box"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-600">Your editor's thoughts</h2>
              {gettingFeedback && 
                <p className="text-gray-600 text-center">
                    Reading your article, one moment please...
                    <FaSpinner className="animate-spin inline-block ml-2" />
                </p>}
              {!gettingFeedback && feedback.length === 0 ? (
                <p className="text-gray-600">No feedback yet. Click on "Review" to let your editor look at your writing.</p>
              ) : (
                <div className="space-y-4">
                  {!gettingFeedback && feedback.map((item, index) => (
                    <FeedbackCard key={index} item={item} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </EditorContext.Provider>
      </main>
    </div>

  )

}