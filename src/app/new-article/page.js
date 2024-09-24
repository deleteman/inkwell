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
import Underline from '@tiptap/extension-underline'
import styles from './newArticle.module.css'

import { exportToMarkdown, getFeedback, saveArticle } from "../lib/editor-helpers"

import { FiSave, FiEye, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Toaster, toast } from 'react-hot-toast'
import { Editor } from "../components/Editor"
import { FeedbackCard } from "../components/FeedbackCard"
import { EditorContext } from "@/app/components/EditorContext"
import { EditorCustomizer } from "../components/EditorCustomizer"
import { EditorComponent } from "../components/EditorComponent"

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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
   
    if (editor) {
      setLoading(false )
    }
  }, [ editor])

  
// Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed)
    }

   if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Toaster for Notifications */}
      <Toaster position="top-right" />

      {/* Header */}
     

        <EditorComponent onSaveArticle={saveArticle}  />    
    </div>
  )
}