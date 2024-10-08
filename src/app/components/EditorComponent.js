import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'

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
import { generalFeedbackCategories } from '../lib/editor-helpers'

import { Mark } from '@tiptap/core';

import  { normalizeString } from "../lib/editor-helpers"

import TurndownService from 'turndown';
const turndownService = new TurndownService();


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


  // Define the custom 'highlight' mark
const MyHighlight = Mark.create({
  name: 'myhighlight',

  // Define how to parse the mark from HTML
  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ];
  },

  // Define how to render the mark to HTML
  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },

  // Define attributes for the mark (e.g., 'id')
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return { id: attributes.id, class: attributes.class };
        },
      },
    };
  },
});
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

    const [textFeedback, setTextFeedback] = useState([])
    const [titleFeedback, setTitleFeedback] = useState([])

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
      //CustomHighlight.configure({ multicolor: true }),
      MyHighlight,
      Markdown,
      Underline, 
    ],
    editorProps: {
      disableInputRules: true, 
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
     transformPastedHTML: (input) => {
        // Simple check to see if the input contains HTML tags
        const hasHTML = /<\/?[a-z][\s\S]*>/i.test(input);

        if (hasHTML) {
          // Convert HTML to Markdown
          const markdown = turndownService.turndown(input);
          return normalizeString(markdown);
        } else {
          // Assume it's plain text and normalize it
          return normalizeString(input);
        }
    },
     onPaste: (event) => {
        console.log("On paste")
        console.log(event)
      },
    },
    content: '<p>Click here to get started...</p>',
  })

  if(!onSetArticleID) {
    onSetArticleID = (id) => {
      setLocalArticleID(id)
    }
  }
  
  const editorContextValue = {
    editor,
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

  useEffect(() => { 
    console.log("Feedback received, splitting it: ", feedback)
    setTextFeedback(feedback.filter( f => !generalFeedbackCategories.includes(f.category)))
    setTitleFeedback(feedback.filter( f => generalFeedbackCategories.includes(f.category)))
  }, [feedback]) 

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
      <header className="bg-gray-200 shadow-md flex">
        <div className="container overflow-y-auto sticky mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl  font-bold text-blue-600">{settings.title}</h1>
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
          <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-6" role="alert">
            <div class="flex">
              <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p class="font-bold">Paste your article here.  </p>
                <p class="text-sm">
                  Click on "Review" to get feedback from your editor.
                  Note that the content will be automatically formatted to markdown if it's not already.
                  </p>
              </div>
            </div>
          </div>

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
                  {!gettingFeedback && titleFeedback.map((item, index) => (
                    <FeedbackCard key={index} item={item} index={index} />
                  ))}

                  {!gettingFeedback && textFeedback.map((item, index) => (
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