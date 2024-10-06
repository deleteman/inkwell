import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export default async function Subscribe() {
  // Get the session on the server side
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Inkwell<span className="text-green-500">AI</span>
          </h1>
          {session ? (
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          ) : (
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg">
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
            Upgrade to <span className="text-green-500">InkwellAI Pro</span>
          </h2>
          
          {/* Description */}
          <p className="text-center text-gray-700 mb-8">
            Unlock full access to all technical reviews, including format, code, and style, and elevate your writing with advanced AI capabilities.
          </p>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">
              What You Get
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center">
                <FiCheckCircle className="text-green-500 w-6 h-6 mr-3" />
                <span className="text-gray-700">
                  Comprehensive technical reviews covering format, code, and style
                </span>
              </li>
              <li className="flex items-center justify-center">
                <FiCheckCircle className="text-green-500 w-6 h-6 mr-3" />
                <span className="text-gray-700">
                  Unlimited access to all AI-powered tools and features
                </span>
              </li>
              <li className="flex items-center justify-center">
                <FiCheckCircle className="text-green-500 w-6 h-6 mr-3" />
                <span className="text-gray-700">
                  Priority customer support for swift assistance
                </span>
              </li>
            </ul>
          </div>

          {/* Pricing Information */}
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <stripe-pricing-table
              pricing-table-id="prctbl_1Q68CULFm9hjuSSjEL5CzZwx"
              publishable-key="pk_test_51Q0KMyLFm9hjuSSjvLrYAtcS9mgaLtCkVGDcZCsR05GxRvp9HLzjxnu1CuLMZgfnfnOrD3j2D6wKWFxgUYxBnX5H00ShSzIk6t"
              customer-email={session?.user?.email}
            ></stripe-pricing-table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner">
        <div className="container mx-auto px-6 py-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} InkwellAI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
