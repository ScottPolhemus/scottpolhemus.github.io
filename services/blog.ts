import { Agent, BlobRef } from '@atproto/api'
import type { OAuthSession } from '@atproto/oauth-client-browser'

import { UsPolhemBlogDefs, UsPolhemBlogNS } from '@/app/__generated__/lexicons'
import { Record as PostRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/post'
import { Record as ContentRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/content'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'

export type ImageInput = {
  filename: string
  alt: string
  aspectRatio?: UsPolhemBlogDefs.AspectRatio
} & (
  | {
      image: BlobRef
    }
  | {
      imageFile: File
    }
)

export type PostRecordInput = Omit<PostRecord, 'images' | 'featuredImage'> & {
  featuredImage?: ImageInput
  images?: ImageInput[]
}

export class BlogClient {
  _did: string
  _agent: Agent
  _blog: UsPolhemBlogNS
  _postRecords?: {
    uri: string
    value: PostRecord
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
    if (typeof sessionOrDid === 'string') {
      this._did = sessionOrDid
      this._agent = new Agent('https://bsky.social')
    } else if (typeof sessionOrDid === 'undefined') {
      if (!process.env.NEXT_PUBLIC_ATPROTO_DID) {
        throw new Error('Missing NEXT_PUBLIC_ATPROTO_DID env variable')
      }

      this._did = process.env.NEXT_PUBLIC_ATPROTO_DID
      this._agent = new Agent('https://bsky.social')
    } else if ('sub' in sessionOrDid) {
      this._did = sessionOrDid.sub
      this._agent = new Agent(sessionOrDid)
    } else {
      throw new Error('Invalid argument for BlogClient constructor')
    }

    this._blog = new UsPolhemBlogNS(this._agent)
  }

  async listPosts({ visibility }: { visibility?: string } = {}) {
    if (!this._postRecords) {
      const response = await this._blog.post.list({ repo: this._did })

      this._postRecords = response.records
    }

    if (visibility) {
      return this._postRecords.filter(
        ({ value }) => value.visibility === visibility
      )
    }

    return this._postRecords
  }

  async listContents() {
    if (!this._contentRecords) {
      const response = await this._blog.content.list({ repo: this._did })

      this._contentRecords = response.records
    }

    return this._contentRecords
  }

  async listTags() {
    if (!this._tagRecords) {
      const response = await this._blog.tag.list({ repo: this._did })

      this._tagRecords = response.records
    }

    return this._tagRecords
  }

  async findPost({ slug, rkey }: { slug?: string; rkey?: string }) {
    if (!slug && !rkey) {
      throw new Error('At least 1 query param is required.')
    }

    return (await this.listPosts()).find((record) => {
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

  async _preparePostRecord({
    featuredImage,
    images,
    ...data
  }: PostRecordInput): Promise<PostRecord> {
    // Prepare array of image files not yet uploaded
    const allImageFiles = []

    if (featuredImage) {
      if ('imageFile' in featuredImage) {
        allImageFiles.push(featuredImage.imageFile)
      }
    }

    if (images && images.length) {
      for (const image of images) {
        if ('imageFile' in image) {
          allImageFiles.push(image.imageFile)
        }
      }
    }

    const imageFileBlobs: Record<
      string,
      Awaited<
        ReturnType<typeof this._agent.com.atproto.repo.uploadBlob>
      >['data']
    > = {}

    // Upload image files and store references to blob record
    await Promise.all(
      allImageFiles.map(async (imageFile) => {
        const response =
          await this._agent.com.atproto.repo.uploadBlob(imageFile)
        imageFileBlobs[imageFile.name] = response.data
      })
    )

    const record = { ...data } as PostRecord

    if (featuredImage) {
      if ('imageFile' in featuredImage) {
        const { imageFile, ...featImg } = featuredImage
        record.featuredImage = {
          ...featImg,
          image: imageFileBlobs[imageFile.name].blob,
        }
      } else {
        record.featuredImage = featuredImage
      }
    }

    if (images && images.length) {
      record.images = images.map((image) => {
        if ('imageFile' in image) {
          const { imageFile, ...img } = image

          return {
            ...img,
            image: imageFileBlobs[imageFile.name].blob,
          }
        }

        return image
      })
    }

    return record
  }

  async createPost(data: PostRecordInput) {
    const record = await this._preparePostRecord(data)

    // Create blog post
    return this._blog.post.create(
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

  async updatePost(rkey: string, data: PostRecordInput) {
    const record = await this._preparePostRecord(data)

    return this._agent.com.atproto.repo.putRecord({
      repo: this._did,
      collection: 'us.polhem.blog.post',
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

  deletePost(rkey: string) {
    return this._blog.post.delete({
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
