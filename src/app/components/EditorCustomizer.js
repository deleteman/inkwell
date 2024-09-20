'use client'

import React, { useContext, useState } from 'react'
import { useSession } from 'next-auth/react'
import { EditorContext } from './EditorContext' // Adjust the import path
import { ProAd } from './ProAd'
import { PRO_ROLE } from '../lib/constants'
import { ProAd } from './ProAd'

export function EditorCustomizer() {
    const [isExpanded, setIsExpanded] = useState(true)
  const { data: session } = useSession()

  const {
        genre,
        setGenre,
        type,
        setType,
        additionalContext,
        setAdditionalContext,
      } = useContext(EditorContext);
    

    return (
        <> 
        <h2 className='font-bold'>Customize Your AI Editor</h2>
        <ProAd />
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
        <option value="short-story">Short story</option>
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
        {type === 'short-story' && (
        <div className="mb-4">
        <label className="block mb-2">Key points or objectives of the story:</label>
        <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            rows={4}
            placeholder="Describe the main points..."
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
        
    </>
    )
}