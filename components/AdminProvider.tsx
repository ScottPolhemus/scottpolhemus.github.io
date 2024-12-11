'use client'

import type {
  BrowserOAuthClient,
  OAuthSession,
} from '@atproto/oauth-client-browser'
import { Agent } from '@atproto/api'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { clientMetadata } from '@/app/(admin)/admin/oauth/client-metadata.json/route'

// import { AppBskyActorDefs } from '@atproto/api'

export type AdminContextValue = {
  oAuth?: BrowserOAuthClient
  session?: OAuthSession
  agent?: Agent
}

const AdminContext = createContext<AdminContextValue>({})

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [oAuth, setOAuth] = useState<BrowserOAuthClient>()
  const [session, setSession] = useState<OAuthSession>()
  const [agent, setAgent] = useState<Agent>()

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
            setAgent(new Agent(result.session))
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
        agent,
      }}
    >
      {!oAuth ? 'Loading...' : children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const admin = useContext(AdminContext)

  return admin
}
