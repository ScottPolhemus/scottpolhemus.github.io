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
import { NextUIProvider } from '@nextui-org/react'

import { clientMetadata } from '@/app/oauth/client-metadata.json/route'
import { BlogClient } from '@/services/blog'
import AdminLoading from './Loading'

export type AdminContextValue = {
  oAuth?: BrowserOAuthClient
  session?: OAuthSession
  blog?: BlogClient
}

const AdminContext = createContext<AdminContextValue | null>(null)

export default function AdminProvider({ children }: { children: ReactNode }) {
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
    <AdminContext.Provider
      value={{
        oAuth,
        session,
        blog,
      }}
    >
      <NextUIProvider>{!oAuth ? <AdminLoading /> : children}</NextUIProvider>
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const admin = useContext(AdminContext)

  if (!admin) {
    throw new Error('Missing admin context provider')
  }

  return admin
}
