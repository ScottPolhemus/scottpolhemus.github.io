import { Agent, BlobRef } from '@atproto/api'
import { OAuthSession } from '@atproto/oauth-client-browser'

import { UsPolhemBlogImage, UsPolhemBlogNS } from '@/app/__generated__/lexicons'
import { Record as EntryRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/entry'
import { Record as ContentRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/content'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type CreateEntryInput = Exclude<EntryRecord, 'featuredImage' | 'images'> & {
  featuredImage: Optional<UsPolhemBlogImage.Main, 'image'>
  featuredImageFile?: File
  images: Array<Optional<UsPolhemBlogImage.Main, 'image'>>
  imageFiles?: File[]
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

  async createEntry(data: CreateEntryInput) {
    const { featuredImageFile, imageFiles, ...record } = data

    const allImageFiles = [featuredImageFile, ...(imageFiles || [])].filter(
      (i) => !!i
    )
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

    // const tagRecords = await Promise.all(
    //   tags.map((slug) => this.findTag({ slug }))
    // )

    const featuredImage = featuredImageFile
      ? {
          ...record.featuredImage,
          image: new BlobRef(
            imageFileBlobs[featuredImageFile.name].blob.ref,
            imageFileBlobs[featuredImageFile.name].blob.mimeType,
            imageFileBlobs[featuredImageFile.name].blob.size
          ),
        }
      : record.featuredImage

    // const images = record.images.map((image) => )

    // Create blog entry
    return this._blog.entry.create(
      {
        repo: this._did,
      },
      {
        ...(record as EntryRecord),
        featuredImage,
        // images: [
        //   ...(record.images || []),
        //   ...imageFiles.map((imageFile) => ({
        //     filename: imageFile.name,
        //     image: new BlobRef(
        //       imageFileBlobs[imageFile.name].blob.ref,
        //       imageFileBlobs[imageFile.name].blob.mimeType,
        //       imageFileBlobs[imageFile.name].blob.size
        //     ),
        //     alt: '',
        //   })),
        // ],
        // images: images.map((imageFile) => ({
        //   filename: imageFile.name,
        //   image: new BlobRef(
        //     imageFileBlobs[imageFile.name].blob.ref,
        //     imageFileBlobs[imageFile.name].blob.mimeType,
        //     imageFileBlobs[imageFile.name].blob.size
        //   ),
        //   alt: '',
        // })),
        // tags: tagRecords.filter((t) => !!t).map(({ uri }) => uri),
      }
    )
  }

  createContent(data: ContentRecord) {
    return this._blog.content.create({ repo: this._did }, data)
  }

  createTag(data: TagRecord) {
    return this._blog.tag.create({ repo: this._did }, data)
  }

  async updateEntry(rkey: string, data: CreateEntryInput) {
    // const { images, featuredImage, tags, ...record } = data

    // const imageFiles = [featuredImage, ...images].filter((i) => !!i)
    // const imageFileBlobs: Record<
    //   string,
    //   Awaited<
    //     ReturnType<typeof this._agent.com.atproto.repo.uploadBlob>
    //   >['data']
    // > = {}

    // // Upload image file blobs and store references
    // await Promise.all(
    //   imageFiles.map(async (imageFile) => {
    //     const response =
    //       await this._agent.com.atproto.repo.uploadBlob(imageFile)
    //     imageFileBlobs[imageFile.name] = response.data
    //   })
    // )

    // const tagRecords = await Promise.all(
    //   tags.map((slug) => this.findTag({ slug }))
    // )

    return this._agent.com.atproto.repo.putRecord({
      repo: this._did,
      collection: 'us.polhem.blog.entry',
      rkey,
      record: data,
      // record: {
      //   ...(record as EntryRecord),
      //   featuredImage: featuredImage
      //     ? {
      //         filename: featuredImage.name,
      //         image: new BlobRef(
      //           imageFileBlobs[featuredImage.name].blob.ref,
      //           imageFileBlobs[featuredImage.name].blob.mimeType,
      //           imageFileBlobs[featuredImage.name].blob.size
      //         ),
      //         alt: '',
      //       }
      //     : undefined,
      //   images: images.map((imageFile) => ({
      //     filename: imageFile.name,
      //     image: new BlobRef(
      //       imageFileBlobs[imageFile.name].blob.ref,
      //       imageFileBlobs[imageFile.name].blob.mimeType,
      //       imageFileBlobs[imageFile.name].blob.size
      //     ),
      //     alt: '',
      //   })),
      //   tags: tagRecords.filter((t) => !!t).map(({ uri }) => uri),
      // },
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
