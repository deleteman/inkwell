'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function Success() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const hasUpdatedSession = useRef(false)

  useEffect(() => {
    if (!hasUpdatedSession.current && status === 'authenticated') {
      hasUpdatedSession.current = true

      const updateSession = async () => {
        try {
          await update() // Force session update
          toast.success("Session updated with new subscription details.")
        } catch (error) {
          console.error("Session update failed:", error)
          toast.error("Failed to update session. Please try re-logging.")
        }
      }

      updateSession()
    }
  }, [status, update])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Subscription Successful!</h2>
        <p className="text-gray-700 mb-6">
          Thank you for subscribing to InkwellAI Pro. You can now enjoy all the premium features.
        </p>
        <Link href="/dashboard">
          <span className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 inline-flex items-center cursor-pointer">
            Go to Dashboard
          </span>
        </Link>
      </div>
    </div>
  )
}
