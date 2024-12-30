import { Agent, BlobRef } from '@atproto/api'
import { OAuthSession } from '@atproto/oauth-client-browser'

import { UsPolhemBlogImage, UsPolhemBlogNS } from '@/app/__generated__/lexicons'
import { Record as EntryRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/entry'
import { Record as ContentRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/content'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'

export type ImageInput = Omit<UsPolhemBlogImage.Main, 'image'> &
  (
    | {
        image: UsPolhemBlogImage.Main['image']
      }
    | {
        imageFile: File
      }
  )

export type CreateEntryInput = EntryRecord & {
  featuredImage?: ImageInput
  images?: ImageInput[]
}

export class BlogClient {
  _did: string
  _agent: Agent
  _blog: UsPolhemBlogNS
  _entryRecords?: {
    uri: string
    value: EntryRecord
  }[]
  _tagRecords?: {
    uri: string
    value: TagRecord
  }[]
  _contentRecords?: {
    uri: string
    value: ContentRecord
  }[]

  constructor(sessionOrDid?: OAuthSession | string) {
    if (
      typeof sessionOrDid === 'string' ||
      typeof sessionOrDid === 'undefined'
    ) {
      this._did =
        sessionOrDid || (process.env.NEXT_PUBLIC_ATPROTO_DID as string)
      this._agent = new Agent('https://bsky.social')
    } else {
      this._did = sessionOrDid.sub
      this._agent = new Agent(sessionOrDid)
    }

    this._blog = new UsPolhemBlogNS(this._agent)
  }

  async listEntries(refresh = false) {
    if (!this._entryRecords || refresh) {
      const response = await this._blog.entry.list({ repo: this._did })

      this._entryRecords = response.records
    }

    return this._entryRecords
  }

  async listContents(refresh = false) {
    if (!this._contentRecords || refresh) {
      const response = await this._blog.content.list({ repo: this._did })

      this._contentRecords = response.records
    }

    return this._contentRecords
  }

  async listTags(refresh = false) {
    if (!this._tagRecords || refresh) {
      const response = await this._blog.tag.list({ repo: this._did })

      this._tagRecords = response.records
    }

    return this._tagRecords
  }

  async findEntry({ slug, rkey }: { slug?: string; rkey?: string }) {
    if (!slug && !rkey) {
      throw new Error('At least 1 query param is required.')
    }

    return (await this.listEntries()).find((record) => {
      if (rkey) {
        return record.uri.endsWith(`/${rkey}`)
      }

      if (slug) {
        return record.value.slug === slug
      }
    })
  }

  async findContent({ slug, rkey }: { slug?: string; rkey?: string }) {
    if (!slug && !rkey) {
      throw new Error('At least 1 query param is required.')
    }

    return (await this.listContents()).find((record) => {
      if (rkey) {
        return record.uri.endsWith(`/${rkey}`)
      }

      if (slug) {
        return record.value.slug === slug
      }
    })
  }

  async findTag({ slug, rkey }: { slug?: string; rkey?: string }) {
    if (!slug && !rkey) {
      throw new Error('At least 1 query param is required.')
    }

    return (await this.listTags()).find((record) => {
      if (rkey) {
        return record.uri.endsWith(`/${rkey}`)
      }

      if (slug) {
        return record.value.slug === slug
      }
    })
  }

  async _prepareEntryRecord({
    featuredImage,
    images,
    ...record
  }: CreateEntryInput): Promise<EntryRecord> {
    const allImageFiles = [
      featuredImage?.imageFile as File,
      ...(images?.map(({ imageFile }) => imageFile as File) || []),
    ].filter((f) => !!f)

    const imageFileBlobs: Record<
      string,
      Awaited<
        ReturnType<typeof this._agent.com.atproto.repo.uploadBlob>
      >['data']
    > = {}

    // Upload image file blobs and store references
    await Promise.all(
      allImageFiles.map(async (imageFile) => {
        const response =
          await this._agent.com.atproto.repo.uploadBlob(imageFile)
        imageFileBlobs[imageFile.name] = response.data
      })
    )

    const data = record as EntryRecord

    if (featuredImage) {
      data.featuredImage = {
        ...featuredImage,
        image: featuredImage.image || imageFileBlobs[featuredImage.filename],
      }
    }

    if (images?.length) {
      data.images = images.map((image) => ({
        ...image,
        image: image.image || imageFileBlobs[image.filename],
      }))
    }

    return data
  }

  async createEntry(data: CreateEntryInput) {
    const record = await this._prepareEntryRecord(data)

    // Create blog entry
    return this._blog.entry.create(
      {
        repo: this._did,
      },
      record
    )
  }

  createContent(data: ContentRecord) {
    return this._blog.content.create({ repo: this._did }, data)
  }

  createTag(data: TagRecord) {
    return this._blog.tag.create({ repo: this._did }, data)
  }

  async updateEntry(rkey: string, data: CreateEntryInput) {
    const record = await this._prepareEntryRecord(data)

    return this._agent.com.atproto.repo.putRecord({
      repo: this._did,
      collection: 'us.polhem.blog.entry',
      rkey,
      record,
    })
  }

  updateContent(rkey: string, data: Partial<ContentRecord>) {
    return this._agent.com.atproto.repo.putRecord({
      repo: this._did,
      collection: 'us.polhem.blog.content',
      rkey,
      record: data,
    })
  }

  updateTag(rkey: string, data: Partial<TagRecord>) {
    return this._agent.com.atproto.repo.putRecord({
      repo: this._did,
      collection: 'us.polhem.blog.tag',
      rkey,
      record: data,
    })
  }

  deleteEntry(rkey: string) {
    return this._blog.entry.delete({
      repo: this._did,
      rkey,
    })
  }

  deleteContent(rkey: string) {
    return this._blog.content.delete({
      repo: this._did,
      rkey,
    })
  }

  deleteTag(rkey: string) {
    return this._blog.tag.delete({
      repo: this._did,
      rkey,
    })
  }
}
