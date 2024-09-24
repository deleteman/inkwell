import { FiBold, FiItalic, FiUnderline } from 'react-icons/fi'
import {  EditorContent } from '@tiptap/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export function Editor({editor, showButtons = true }) {

      return (  
        <>
       
    <div className="w-full lg:w-2/3 editor-container">
      {/* Toolbar */}
      {showButtons && (
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
      </div>
        )}
        {/* Add more formatting buttons as needed */}
      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px] bg-white border border-gray-300 p-4 rounded shadow-md" />
    </div>
        </>
    )
}