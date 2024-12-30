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

import { Record as EntryRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/entry'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'
import { useAdmin } from '@/components/admin/AdminProvider'
import { CreateEntryInput } from '@/services/blog'
import ImageFieldGroup from './ImageFieldGroup'
import AdminLoading from './Loading'

export default function AdminEntryForm() {
  const { blog } = useAdmin()
  const [record, setRecord] = useState<{
    uri: string
    value: EntryRecord
  }>()
  const [tagRecords, setTagRecords] = useState<
    {
      uri: string
      value: TagRecord
    }[]
  >()
  const [featuredImage, setFeaturedImage] =
    useState<CreateEntryInput['featuredImage']>()
  const [images, setImages] = useState<CreateEntryInput['images']>()
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
          setFeaturedImage(entryRecord.value.featuredImage)
          setImages(entryRecord.value.images)
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

    const data: CreateEntryInput = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      createdAt: formData.get('createdAt') as string,
      visibility: formData.get('visibility') as CreateEntryInput['visibility'],
      featuredImage,
      images,
      tags: formData.getAll('tags') as string[],
    }

    console.log({ data })

    if (rkey) {
      await blog?.updateEntry(rkey, data)
    } else {
      await blog?.createEntry(data)
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
          {!!record?.value.images?.length && (
            <>
              {images?.map((image, index) => (
                <ImageFieldGroup
                  name={`images[${index}]`}
                  image={image}
                  key={index}
                  onChangeImage={(newImage) => {
                    setImages(
                      [
                        ...images,
                        {
                          filename: newImage.name,
                        },
                      ]
                      // images.map((img, imgIndex) => {
                      //   if (imgIndex === index) {
                      //     return newImage
                      //   }
                      //   return img
                      // })
                    )
                  }}
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
                  // name={`images[${image.filename}]`}
                  // image={image}
                  // key={image.filename}
                  // onClickRemove={() => {
                  //   const { images, ...value } = record.value
                  //   setRecord({
                  //     ...record,
                  //     value: {
                  //       ...value,
                  //       images: images?.filter(
                  //         (i) => i.filename !== image.filename
                  //       ),
                  //     },
                  //   })
                  // }}
                />
              ))}
              {/* {record?.value.images.map((image) => (
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
              ))} */}
              {/* {imagesFiles.map((imageFile, index) => (
                <ImageFieldGroup
                  name={`images[${index}]`}
                  imageFile={imageFile}
                  key={imageFile.name}
                  onClickRemove={() => {
                    setImagesFiles(
                      imagesFiles.filter((file) => file.name !== imageFile.name)
                    )
                  }}
                />
              ))} */}
            </>
          )}
          <Input
            label="Add Images"
            name="images"
            type="file"
            multiple
            onChange={(event) => {
              // setImagesFiles([...imagesFiles, ...(event.target.files || [])])
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
          {/* <label className="block"> */}
          {/* <span className="block">Featured Image</span> */}
          {/* {record?.value.featuredImage || featuredImageFile ? (
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
            ) : (
              <input
                className="w-full border"
                name="featuredImage[file]"
                type="file"
                onChange={(event) => {
                  if (event.target.files?.length) {
                    // setFeaturedImageFile(event.target.files[0])
                  }
                }}
              />
            )}
          </label> */}
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
