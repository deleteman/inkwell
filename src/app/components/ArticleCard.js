import { FiTrash2, FiEdit } from 'react-icons/fi'
import Link from "next/link"

export function ArticleCard({article, onDelete}) {

    return (
    <div key={article._id} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
          {/* Display Genre and Type as Pills */}
            <div className="flex flex-wrap mb-4">
                {article.prefs?.type && (
                <span className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full mr-2 mb-2">
                    {article.prefs.type}
                </span>
                )}
                {article.prefs?.genre && (
                <span className="text-sm text-white bg-green-600 px-3 py-1 rounded-full mr-2 mb-2">
                    {article.prefs.genre}
                </span>
                )}
            </div>
            <div className="flex justify-between items-center">
                <Link href={`/edit-article/${article._id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <FiEdit className="mr-1" /> Edit
                </Link>
                <button onClick={() => onDelete(article._id)} className="text-red-600 hover:text-red-800 flex items-center">
                <FiTrash2 className="mr-1" /> Delete
                </button>
            </div>
        </div>
    )
}