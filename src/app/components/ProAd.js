import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { PRO_ROLE } from "../lib/constants"
import Link from "next/link"

export function ProAd() {
  const { data: session, update } = useSession() 
  const [isSessionUpdated, setIsSessionUpdated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /*
  useEffect(() => {
    const updateSession = async () => {
      if (session && session.user && session.user.role !== PRO_ROLE) {
        console.log("Updating session")
        setIsSessionUpdated(true)
        await update()
      }
      setIsLoading(false)
    }

    */
  /*  if (!isSessionUpdated) {
      updateSession()
    } else {
        setTimeout(() => setIsSessionUpdated(false), 1000)
        return;
    }

    // Updates the session every 60 seconds
    /*const interval = setInterval(async () => {
      if (session && session.user && session.user.role !== PRO_ROLE) {
        console.log("Updating session inside hte interval")
        await update()
      }
    }, 60 * 1000)

    return () => clearInterval(interval)
    */
   /*
   console.log("the component is updated")
   if(!isSessionUpdated) {
       updateSession()
   } else {
       console.log("Session already updated")
   }
  }, [isSessionUpdated])
  */


  /*if (isLoading) {
    return <div>Loading...</div>
  }
  */

  return (
    <>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Want to try Pro?</p>
          <p>
            Upgrade to Pro to get access to your personalized AI editor and review as many articles as you want.
            <Link href="/subscribe" className="text-blue-600 underline ml-2">
              Upgrade Now
            </Link>
          </p>
        </div>
      
    </>
  )
}
