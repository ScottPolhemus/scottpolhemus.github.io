'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Record as EntryRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/entry'
import { useClient } from '@/components/admin/ClientProvider'
import ImageFieldGroup from './ImageFieldGroup'

export default function AdminEntryForm() {
  const { blog } = useClient()
  const [record, setRecord] = useState<{
    uri: string
    value: EntryRecord
  }>()
  const [featuredImageFile, setFeaturedImageFile] = useState<File>()
  const [imagesFiles, setImagesFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [rkey, setRkey] = useState('')
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const newRkey = searchParams.get('rkey')

    if (newRkey) {
      setRkey(newRkey)

      blog?.findEntry({ rkey: newRkey }).then((entryRecord) => {
        if (entryRecord) {
          setRecord(entryRecord)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
  }, [blog])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const featuredImage = {
      ...(record?.value.featuredImage || {}),
      alt: formData.get(`featuredImage[alt]`),
      aspectRatio: {
        width: formData.get(`featuredImage[aspectRatio][width]`),
        height: formData.get(`featuredImage[aspectRatio][height]`),
      },
    }

    const images =
      record?.value.images?.map((image) => {
        const filename = formData.get(
          `images[${image.filename}][filename]`
        ) as string
        const alt = formData.get(`images[${image.filename}][alt]`) as string
        const width = formData.get(
          `images[${image.filename}][aspectRatio][width]`
        ) as string
        const height = formData.get(
          `images[${image.filename}][aspectRatio][height]`
        ) as string

        return {
          ...image,
          filename,
          alt,
          aspectRatio: {
            width: parseFloat(width),
            height: parseFloat(height),
          },
        }
      }) || []

    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      createdAt: formData.get('createdAt') as string,
      visibility: formData.get('visibility') as string,
      featuredImage,
      featuredImageFile,
      images,
      imagesFiles,
      tags: [],
    }

    if (rkey) {
      await blog?.updateEntry(rkey, data)
    } else {
      await blog?.createEntry(data)
    }

    router.push('/admin')
  }

  if (loading) {
    return 'Loading...'
  }

  console.log(record)

  return (
    <form onSubmit={onFormSubmit}>
      <label className="block">
        <span className="block">Title</span>
        <input
          className="w-full border"
          name="title"
          required
          defaultValue={record?.value.title}
        />
      </label>
      <label className="block">
        <span className="block">Slug</span>
        <input
          className="w-full border"
          name="slug"
          required
          defaultValue={record?.value.slug}
        />
      </label>
      <label className="block">
        <span className="block">Content</span>
        <textarea
          className="h-[500px] w-full border"
          name="content"
          required
          defaultValue={record?.value.content}
        />
      </label>
      <label className="block">
        <span>Created At</span>
        <input
          className="border"
          name="createdAt"
          type="datetime-local"
          defaultValue={
            record?.value.createdAt || moment().format('YYYY-MM-DDTHH:mm')
          }
        />
      </label>
      <label className="block">
        <span>Visibility</span>
        <select
          className="border"
          name="visibility"
          required
          defaultValue={record?.value.visibility}
        >
          <option value="">--</option>
          <option value="author">Author</option>
          <option value="url">URL</option>
          <option value="public">Public</option>
        </select>
      </label>
      <label className="block">
        <span className="block">Featured Image</span>
        {record?.value.featuredImage || featuredImageFile ? (
          <>
            <p>Existing image</p>
            <ImageFieldGroup
              name="featuredImage"
              image={record?.value.featuredImage}
              imageFile={featuredImageFile}
              onClickRemove={() => {
                const { featuredImage, ...value } = record?.value

                setRecord({
                  ...record,
                  value,
                })
              }}
            />
          </>
        ) : (
          <input
            className="w-full border"
            name="featuredImage[file]"
            type="file"
            onChange={(event) => {
              if (event.target.files?.length) {
                setFeaturedImageFile(event.target.files[0])
              }
            }}
          />
        )}
      </label>
      <label className="block">
        <span className="block">Content Images</span>
        {!!record?.value.images?.length && (
          <>
            <p>Existing images</p>
            {record?.value.images.map((image) => (
              <ImageFieldGroup
                name={`images[${image.filename}]`}
                image={image}
                key={image.filename}
                onClickRemove={() => {
                  const { images, ...value } = record.value
                  setRecord({
                    ...record,
                    value: {
                      ...value,
                      images: images?.filter(
                        (i) => i.filename !== image.filename
                      ),
                    },
                  })
                }}
              />
            ))}
            {imagesFiles.map((imageFile) => (
              <ImageFieldGroup
                name={`images[${imageFile.name}]`}
                imageFile={imageFile}
                key={imageFile.name}
                onClickRemove={() => {
                  setImagesFiles(
                    imagesFiles.filter((file) => file.name !== imageFile.name)
                  )
                }}
              />
            ))}
          </>
        )}
        <p>
          <input
            className="w-full border"
            name="images"
            type="file"
            multiple
            onChange={(event) => {
              setImagesFiles([...imagesFiles, ...(event.target.files || [])])
              event.target.value = ''
            }}
          />
        </p>
      </label>
      {!!rkey ? (
        <button className="border">Update Post</button>
      ) : (
        <button className="border">Create Post</button>
      )}
    </form>
  )
}
