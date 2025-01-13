'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Form,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from '@nextui-org/react'

import { Record as PostRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/post'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'
import { useAdmin } from '@/components/admin/AdminProvider'
import { PostRecordInput, ImageInput } from '@/services/blog'
import ImageFieldGroup from './ImageFieldGroup'
import AdminLoading from './Loading'

export default function AdminPostForm() {
  const { blog } = useAdmin()
  const [record, setRecord] = useState<{
    uri: string
    value: PostRecord
  }>()
  const [tagRecords, setTagRecords] = useState<
    {
      uri: string
      value: TagRecord
    }[]
  >()
  const [featuredImage, setFeaturedImage] = useState<ImageInput>()
  const [images, setImages] = useState<ImageInput[]>()
  const [loading, setLoading] = useState(true)
  const [rkey, setRkey] = useState('')
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const newRkey = searchParams.get('rkey')

    if (newRkey) {
      setRkey(newRkey)

      blog?.findPost({ rkey: newRkey }).then((postRecord) => {
        if (postRecord) {
          setRecord(postRecord)
          setFeaturedImage(postRecord.value.featuredImage)
          setImages(postRecord.value.images)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }

    blog?.listTags().then(setTagRecords)
  }, [blog])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const data: PostRecordInput = {
      title: formData.get('title')?.toString(),
      slug: formData.get('slug')?.toString(),
      content: formData.get('content')?.toString(),
      createdAt: formData.get('createdAt')?.toString(),
      visibility: formData
        .get('visibility')
        ?.toString() as PostRecordInput['visibility'],
      featuredImage,
      images,
      tags: formData.getAll('tags').map((t) => t.toString()),
    }

    if (rkey) {
      await blog?.updatePost(rkey, data)
    } else {
      await blog?.createPost(data)
    }

    router.push('/admin')
  }

  if (loading) {
    return <AdminLoading />
  }

  return (
    <>
      {!!record && (
        <p className="mb-4 px-6 font-sans">
          <Link href={`/posts/${record.value.slug}`}>View Post</Link>
        </p>
      )}
      <Form
        className="grid gap-4 px-6 font-sans md:grid-cols-6"
        onSubmit={onFormSubmit}
      >
        <div className="col-span-4 flex flex-col gap-4">
          <Input
            label="Title"
            name="title"
            required
            defaultValue={record?.value.title}
          />
          <Textarea
            label="Content"
            name="content"
            required
            defaultValue={record?.value.content}
          />
          {!!images?.length && (
            <>
              {images?.map((image, index) => (
                <ImageFieldGroup
                  name={`images[${index}]`}
                  image={image}
                  key={index}
                  onChangeImage={(newImage) => {
                    const newImages = [...images]
                    newImages[index] = newImage
                    setImages(newImages)
                  }}
                  onClickRemove={() => {
                    setImages(
                      (images || []).filter(
                        ({ filename }) => filename !== image.filename
                      )
                    )
                  }}
                />
              ))}
            </>
          )}
          <Input
            label="Add Images"
            name="images"
            type="file"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                const newImages = [...(images || [])]
                const files = [...event.target.files]

                Promise.all(
                  files.map((file) => {
                    return createImageBitmap(file).then((bitmap) => {
                      const { width, height } = bitmap
                      bitmap.close()

                      return {
                        imageFile: file,
                        filename: file.name,
                        alt: '',
                        aspectRatio: {
                          width,
                          height,
                        },
                      }
                    })
                  })
                ).then((imageInputs) => {
                  for (const input of imageInputs) {
                    newImages.push(input)
                  }

                  setImages(newImages)
                })
              }

              event.target.value = ''
            }}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <Input
            label="Slug"
            name="slug"
            required
            defaultValue={record?.value.slug}
          />
          <Input
            label="Created At"
            name="createdAt"
            type="datetime-local"
            required
            defaultValue={
              record?.value.createdAt || moment().format('YYYY-MM-DDTHH:mm')
            }
          />
          <Select
            label="Visibility"
            name="visibility"
            required
            defaultSelectedKeys={
              [record?.value.visibility].filter(Boolean) as string[]
            }
          >
            <SelectItem key="">--</SelectItem>
            <SelectItem key="author">Author</SelectItem>
            <SelectItem key="url">URL</SelectItem>
            <SelectItem key="public">Public</SelectItem>
          </Select>
          {!!tagRecords && (
            <Select
              label="Tags"
              name="tags"
              selectionMode="multiple"
              defaultSelectedKeys={record?.value.tags}
            >
              {tagRecords.map((tagRecord) => (
                <SelectItem key={tagRecord.uri}>
                  {tagRecord.value.name}
                </SelectItem>
              ))}
            </Select>
          )}
          {!!featuredImage && (
            <ImageFieldGroup
              name={`featuredImage`}
              image={featuredImage}
              onChangeImage={setFeaturedImage}
              onClickRemove={() => {
                setFeaturedImage(undefined)
              }}
            />
          )}
          <Input
            label="Featured Image"
            name="featuredImage"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                const newFeatImg = event.target.files[0]

                createImageBitmap(newFeatImg).then((bitmap) => {
                  const { width, height } = bitmap
                  bitmap.close()

                  setFeaturedImage({
                    imageFile: newFeatImg,
                    filename: newFeatImg.name,
                    alt: '',
                    aspectRatio: {
                      width,
                      height,
                    },
                  })
                })
              }

              event.target.value = ''
            }}
          />
          <div className="flex gap-4">
            {!!rkey ? (
              <Button
                color="primary"
                size="lg"
                className="flex-1"
                type="submit"
              >
                Update Post
              </Button>
            ) : (
              <Button
                color="primary"
                size="lg"
                className="flex-1"
                type="submit"
              >
                Create Post
              </Button>
            )}
            <Button
              color="danger"
              size="lg"
              type="button"
              disabled
              className="flex-1"
            >
              Delete Post
            </Button>
          </div>
        </div>
      </Form>
    </>
  )
}
