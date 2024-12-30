export function parseAtProtoUri(uri: string) {
  const [authorDid, collection, rkey] = uri.replace('at://', '').split('/')

  return { authorDid, collection, rkey }
}

export function formatAtProtoUri({
  authorDid,
  collection,
  rkey,
}: {
  authorDid: string
  collection: string
  rkey: string
}) {
  return `at://${authorDid}/${collection}/${rkey}`
}
