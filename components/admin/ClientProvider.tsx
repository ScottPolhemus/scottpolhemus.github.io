'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type {
  BrowserOAuthClient,
  OAuthSession,
} from '@atproto/oauth-client-browser'

import { clientMetadata } from '@/app/oauth/client-metadata.json/route'
import { BlogClient } from '@/services/blog'

export type AdminClientContextValue = {
  oAuth?: BrowserOAuthClient
  session?: OAuthSession
  blog?: BlogClient
}

const AdminClientContext = createContext<AdminClientContextValue | null>(null)

export default function AdminClientProvider({
  children,
}: {
  children: ReactNode
}) {
  const [oAuth, setOAuth] = useState<BrowserOAuthClient>()
  const [session, setSession] = useState<OAuthSession>()
  const [blog, setBlog] = useState<BlogClient>()

  useEffect(() => {
    import('@atproto/oauth-client-browser').then(
      ({ BrowserOAuthClient: OAuthClient }) => {
        const oAuthClient = new OAuthClient({
          clientMetadata,
          handleResolver: 'https://bsky.social',
        })

        oAuthClient.init().then((result) => {
          setOAuth(oAuthClient)

          if (!!result && 'session' in result) {
            setSession(result.session)
            setBlog(new BlogClient(result.session))
          }
        })
      }
    )
  }, [])

  return (
    <AdminClientContext.Provider
      value={{
        oAuth,
        session,
        blog,
      }}
    >
      {!oAuth ? 'Loading...' : children}
    </AdminClientContext.Provider>
  )
}

export function useClient() {
  const admin = useContext(AdminClientContext)

  if (!admin) {
    throw new Error('Missing admin context provider')
  }

  return admin
}
