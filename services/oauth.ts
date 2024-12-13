import { clientMetadata } from '@/app/oauth/client-metadata.json/route'

export function getOAuthClient() {
  return import('@atproto/oauth-client-browser').then(
    ({ BrowserOAuthClient }) =>
      new BrowserOAuthClient({
        clientMetadata,
        handleResolver: 'https://bsky.social',
      })
  )
}
