'use client'

import Image from 'next/image'
import { Input, Button } from '@nextui-org/react'

import {
  UsPolhemBlogImage,
  UsPolhemBlogDefs,
} from '@/app/__generated__/lexicons'
import { ImageInput } from '@/services/blog'

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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {!!(image.image as UsPolhemBlogImage.Main)?.ref && (
          <Image
            width="50"
            height="100"
            src={`https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${(image.image as UsPolhemBlogImage.Main).ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}`}
            alt=""
          />
        )}
        {!!image.imageFile && (
          <Image
            width="50"
            height="100"
            src={URL.createObjectURL(image.imageFile as Blob)}
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
        value={image.filename as string}
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
