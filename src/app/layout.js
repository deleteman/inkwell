import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from "./components/SessionProvider"
import "./globals.css"
import Navbar from './components/NavBar' // Import the Navbar component

const inter = Inter({ subsets: ['latin'] })

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
      </body>
    </html>
  )
}
