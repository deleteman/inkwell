'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LandingPage from './components/LandingPage'

export default function LoginButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    router.push('/dashboard') 
  }

  return (
    <LandingPage
      signIn={signIn}
      />
      )
}