import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { PRO_ROLE } from "../lib/constants"
import Link from "next/link"


export function ProAd() {
    const { data: session, update } = useSession( { required: true } )

    useEffect(() => { //updtes the session every 60 seconds
        const interval = setInterval(async () => {
            if(session && session.user && session.user.role != PRO_ROLE) {
                console.log(("Updating session"))
                await update()
            }
        }, 60 * 1000)
        return () => clearInterval(interval)    
    }, [session, update])


    return ( 
        <>
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
        </>
    )
    }
