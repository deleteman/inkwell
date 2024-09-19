'use client'

import { signOut } from "next-auth/react"
import { useState } from 'react'
import { DEFAULT_ROLE } from "../lib/constants"

export default function Navbar({ session }) {
  // Dropdown state
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-white text-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-blue-600">Inkwell<span className="text-green-500">AI</span></h1>
        {session && (
            <a href="/dashboard" className="hover:underline">Dashboard</a>
        )}
      </div>
      {session && (
        <div className="relative">      
          <button 
            className="flex items-center space-x-2" 
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <img 
              src={session.user.image} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full"
            />
            <span>{session.user.name}</span>
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
