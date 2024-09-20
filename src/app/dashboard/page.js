'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Toaster, toast } from 'react-hot-toast'
import { DEFAULT_ROLE, PRO_ROLE } from "../lib/constants"
import { ArticleCard } from "../components/ArticleCard"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    // Fetch articles from API
    // This is a placeholder, you'll need to implement the actual API
    const fetchArticles = async () => {
        setLoading(true)
      const res = await fetch("/api/articles")
      const data = await res.json()
      setArticles(data)
        setLoading(false)
    }
    fetchArticles()
  }, [])

  const deleteArticle = async (id) => {
    // Delete article from API
    // This is a placeholder, you'll need to implement the actual API
    const response = await fetch(`/api/articles/${id}`, { method: "DELETE" })
    if(response.status == 200) {
        setArticles(articles.filter(article => article._id !== id))
    } else {
        let data = await response.json()    
        toast.error(data.error || "Something went wrong please try again later")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/*   Header */}
      <header className="bg-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
          <Link href="/new-article" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
              + New Writing
          </Link>
        </div>
      </header>

      {session && session.user.role != PRO_ROLE && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p className="font-bold">Unlock More Features!</p>
                <p>
                Upgrade to Pro to customize your AI editor and receive tailored feedback.
                <Link href="/subscribe" className="text-blue-600 underline ml-2">
                    Upgrade Now
                </Link>
                </p>
            </div>
            )}
      {/* Main Content */}
      {loading && (
        <main className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-700 mb-4">Loading your writing...</p>
            </div>
        </main>
        )}
      {!loading && (
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Your Writing</h2>
        {articles.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-700 mb-4">You haven't written any articles yet.</p>
            <Link href="/new-article" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                Start Writing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
                <ArticleCard article={article} key={article._id} onDelete={deleteArticle} />
              
            ))}
          </div>
        )}
      </main>
        )}
    </div>
  )
}
