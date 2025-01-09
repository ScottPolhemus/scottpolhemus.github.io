import type { OAuthClientMetadataInput } from '@atproto/oauth-client-browser'

export const clientMetadata: OAuthClientMetadataInput = {
  client_id: `${process.env.NEXT_PUBLIC_APP_HOST}/oauth/client-metadata.json`,
  client_name: 'Polhem.us Admin',
  client_uri: process.env.NEXT_PUBLIC_APP_HOST,
  redirect_uris: [`${process.env.NEXT_PUBLIC_APP_HOST}/admin`],
  scope: 'atproto transition:generic',
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
}
