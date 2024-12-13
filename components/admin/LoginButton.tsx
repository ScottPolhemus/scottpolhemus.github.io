'use client'

import { MouseEventHandler } from 'react'
import { useClient } from '@/components/admin/ClientProvider'

export default function AdminLoginButton() {
  const { oAuth } = useClient()

  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()

    oAuth?.signIn('polhem.us')
  }

  return (
    <div className="text-center">
      <button
        onClick={onClick}
        className="my-16 rounded-full bg-[rgb(16,131,254)] px-6 py-4 font-sans text-xl
      text-white hover:bg-[rgb(1,104,213)]"
        disabled={!oAuth}
      >
        Sign in with Bluesky
      </button>
    </div>
  )
}
