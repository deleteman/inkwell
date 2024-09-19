import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export default async function Subscribe() {
    // Get the session on the server side
    const session = await getServerSession(authOptions)
  
  
    // Now render the component with the fetched customerId
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">
              Inkwell<span className="text-green-500">AI</span>
            </h1>
            {session && (
            <Link href="/dashboard">
              <span className="text-blue-600 hover:underline cursor-pointer">
                Back to Dashboard
              </span>
            </Link>

            )}
            {!session && (
            <Link href="/">
              <span className="text-blue-600 hover:underline cursor-pointer">
                Back to home
              </span>
            </Link>
            )}

          </div>
        </header>
  
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Upgrade to InkwellAI Pro</h2>
            <p className="text-gray-700 mb-6 text-center">
              Unlock advanced features and take your writing to the next level.
            </p>
  
            {/* Benefits List */}
            <ul className="mb-6 space-y-4">
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" />
                Customize AI feedback based on genre and writing type.
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" />
                Access to specialized AI editors for books, articles, and technical content.
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" />
                Priority customer support.
              </li>
              {/* Add more benefits as needed */}
            </ul>
  
            {/* Pricing Information */}
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <stripe-pricing-table
              pricing-table-id="prctbl_1Q0KexLFm9hjuSSj7YgtZBNE"
              publishable-key="pk_test_51Q0KMyLFm9hjuSSjvLrYAtcS9mgaLtCkVGDcZCsR05GxRvp9HLzjxnu1CuLMZgfnfnOrD3j2D6wKWFxgUYxBnX5H00ShSzIk6t"
              customer-email={session?.user?.email}
            ></stripe-pricing-table>
  
            {/* Subscribe Button */}
            {/* If you're using the embedded pricing table, you might not need a separate subscribe button */}
            {/* You can remove the subscribe button if it's not needed */}
          </div>
        </main>
      </div>
    )
  }
  