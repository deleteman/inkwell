import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from "./components/SessionProvider"
import "./globals.css"
import Navbar from './components/NavBar' // Import the Navbar component

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InkwellAI- Enhance your writing with our AI suggestions',
  description: 'Use fine-tuned models to evaluate your writing and get customized recommendations',
}

export default async function RootLayout({
  children,
}) {
  const session = await getServerSession()

  if(!session) {
    return (
      <html>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionProvider session={session}>
             {children}
         </SessionProvider>
         </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionProvider session={session}>
          {/* Navbar */}
          <Navbar session={session} />
          
          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; {new Date().getFullYear()} InkwellAI. All rights reserved.</p>
          </footer>
        </SessionProvider>
        <script defer event-uuid="fd3983df-20de-4679-969f-1f55330de7d4" src="https://tracker.metricswave.com/js/visits.js"></script>
      </body>
    </html>
  )
}
