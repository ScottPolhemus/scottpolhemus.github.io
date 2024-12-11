'use client'

import { MouseEventHandler } from 'react'
import { useAdmin } from '@/components/AdminProvider'

export default function AdminLogin() {
  const { oAuth } = useAdmin()

  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()

    oAuth?.signIn('polhem.us')
  }

  return (
    <button onClick={onClick} className="underline" disabled={!oAuth}>
      Sign in with Bluesky
    </button>
  )
}
