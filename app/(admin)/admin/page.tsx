'use client'

import { useAdmin } from '@/components/AdminProvider'
import { FormEventHandler, useEffect, useState } from 'react'

export default function AdminPage() {
  const { oAuth, session } = useAdmin()

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    if (oAuth) {
      oAuth.signIn(formData.get('handle') as string)
    }
  }

  if (!session?.sub) {
    return (
      <form onSubmit={onFormSubmit}>
        <label>
          <input type="text" name="handle" required></input>
        </label>
        <button disabled={!oAuth}>Sign in with Bluesky</button>
      </form>
    )
  }

  return <h1>Welcome!</h1>
}
