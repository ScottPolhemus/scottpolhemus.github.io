import { clientMetadata } from '@/services/oauth'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(clientMetadata)
}
