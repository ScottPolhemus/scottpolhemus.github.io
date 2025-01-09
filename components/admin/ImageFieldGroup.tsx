'use client'

import Image from 'next/image'
import { Input, Button } from '@nextui-org/react'

import {
  UsPolhemBlogImage,
  UsPolhemBlogDefs,
} from '@/app/__generated__/lexicons'
import { ImageInput } from '@/services/blog'
import { BlobRef } from '@atproto/api'

export default function ImageFieldGroup({
  name,
  image,
  onClickRemove,
  onChangeImage,
}: {
  name: string
  image: UsPolhemBlogImage.Main | ImageInput
  onClickRemove: () => void
  onChangeImage: (newImage: UsPolhemBlogImage.Main | ImageInput) => void
}) {
  let imageBlobRef: BlobRef | undefined
  let imageFile: File | undefined

  if ('image' in image) {
    imageBlobRef = image.image
  } else if ('imageFile' in image) {
    imageFile = image.imageFile
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {typeof imageBlobRef !== 'undefined' && (
          <Image
            width="50"
            height="100"
            src={`https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${imageBlobRef.ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}`}
            alt=""
          />
        )}
        {typeof imageFile !== 'undefined' && (
          <Image
            width="50"
            height="100"
            src={URL.createObjectURL(imageFile)}
            alt=""
          />
        )}
        <Button type="button" onPress={onClickRemove} color="danger" size="sm">
          Remove Image
        </Button>
      </div>
      <Input
        name={`${name}[filename]`}
        label="File name"
        value={image.filename}
        onChange={(event) => {
          event.preventDefault()

          onChangeImage({
            ...image,
            filename: event.target.value,
          } as ImageInput)
        }}
      />
      <Input name={`${name}[alt]`} label="Alt text" defaultValue={image?.alt} />
      <Input
        name={`${name}[aspectRatio][width]`}
        label="Width"
        type="number"
        defaultValue={image.aspectRatio?.width.toString()}
        onChange={(event) => {
          event.preventDefault()

          onChangeImage({
            ...image,
            aspectRatio: {
              ...image.aspectRatio,
              width: parseInt(event.target.value),
            } as UsPolhemBlogDefs.AspectRatio,
          })
        }}
      />
      <Input
        name={`${name}[aspectRatio][height]`}
        label="Height"
        type="number"
        defaultValue={(
          image?.aspectRatio as UsPolhemBlogDefs.AspectRatio
        )?.height?.toString()}
        onChange={(event) => {
          event.preventDefault()

          onChangeImage({
            ...image,
            aspectRatio: {
              ...(image?.aspectRatio || {}),
              height: parseInt(event.target.value),
            } as UsPolhemBlogDefs.AspectRatio,
          })
        }}
      />
    </div>
  )
}
