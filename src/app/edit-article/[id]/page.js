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
import './newArticle.module.css'

import { FiBold, FiItalic, FiUnderline, FiSave, FiEye, FiDownload } from 'react-icons/fi'
import { Toaster, toast } from 'react-hot-toast'

const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      "id": {
        default: null,
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


  function highlightFeedback(idx, action="highlight") {

    if(action == "highlight") {
        document.getElementById("suggestion_" + idx)?.classList.add("suggested-highlight");
        document.getElementById(`highlight_${idx}`)?.classList.add("suggested-highlight");
    } else {
        document.getElementById("suggestion_" + idx)?.classList.remove("suggested-highlight");
        document.getElementById(`highlight_${idx}`)?.classList.remove("suggested-highlight");

    }
  }   

  function scrollToText(idx) {  
    document.getElementById("highlight_" + idx)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

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
    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${params.id}`)
      if (res.ok) {
        const article = await res.json()
        setTitle(article.title)
        editor?.commands.setContent(article.content)
      } else {
        console.error('Failed to fetch article')
        toast.error('Failed to fetch article')
      }
      setLoading(false)
    }
    if (editor) {
      fetchArticle()
    }
  }, [params.id, editor])

  const getFeedback = async () => {
    const content = editor.getText()
    toast.loading('Fetching feedback...')
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
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
      const color = category === 're-write with the new proposed text' ? 'yellow' :
                    category === 'can be improved with suggestion' ? 'blue' :
                    'red'

      const regex = new RegExp(originalText, 'gi')
      fullContent = fullContent.replace(regex,`<mark style="background-color: ${color}" id="highlight_${idx}" data-id="highlight_${idx}">${originalText}</mark>`)
    })
    editor.commands.setContent(fullContent)
  }

  const saveArticle = async () => {
    const res = await fetch(`/api/articles/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": 'application/json' },
      body: JSON.stringify({ title, content: editor?.getHTML() })
    })
    if (res.ok) {
      // Display success notification
      toast.success('Article saved successfully!')
    } else {
      console.error('Failed to save article')
      toast.error('Failed to save article')
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
          <h1 className="text-2xl font-bold text-blue-600">Editing</h1>
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
          placeholder="Article Title"
          className="w-full p-3 mb-6 border border-gray-300 rounded text-2xl font-semibold"
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor Section */}
          <div className="w-full lg:w-2/3 editor-container">
            {/* Toolbar */}
            <div className="toolbar mb-4 flex gap-2">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-2 rounded border ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
              >
                <FiBold />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-2 rounded border ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
              >
                <FiItalic />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-3 py-2 rounded border ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
              >
                <FiUnderline />
              </button>
              {/* Add more formatting buttons as needed */}
            </div>
            {/* Editor Content */}
            <EditorContent editor={editor} className="min-h-[400px] bg-white border border-gray-300 p-4 rounded shadow-md" />
          </div>

          {/* Feedback Section */}
          <div className="w-full lg:w-1/3 feedback-container sticky top-4 max-h-[80vh] overflow-y-auto p-4 bg-white border border-gray-300 rounded shadow-md" id="feedback-box">
            <h2 className="text-xl font-bold mb-4">AI Feedback</h2>
            {feedback.length === 0 ? (
              <p className="text-gray-600">No feedback yet. Click on "Review" to get AI suggestions.</p>
            ) : (
              <div className="space-y-4">
                {feedback.map((item, index) => (
                  <div key={index} className="p-2 border-b" id={"suggestion_" + index} 
                    onMouseOver={() => highlightFeedback(index)}
                    onMouseOut={() => highlightFeedback(index, 'hide')}
                    onClick={() => scrollToText(index)}
                  >
                    <strong className="text-blue-600">{item.category}:</strong>
                    <p className="text-gray-800">{item.suggestion}</p>
                    <em className="text-gray-500">"{item.originalText}"</em>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
