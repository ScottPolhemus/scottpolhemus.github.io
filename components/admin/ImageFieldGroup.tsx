'use client'

import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'

import { UsPolhemBlogImage } from '@/app/__generated__/lexicons'

export default function ImageFieldGroup({
  name,
  image,
  imageFile,
  onClickRemove,
}: {
  name: string
  image?: Partial<UsPolhemBlogImage.Main>
  imageFile?: File
  onClickRemove: MouseEventHandler
}) {
  const [filename, setFilename] = useState(image?.filename || imageFile?.name)
  const [previewSrc, setPreviewSrc] = useState('')

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
          setPreviewSrc(reader.result as string)
        },
        false
      )

      reader.readAsDataURL(imageFile)
    }
  }, [imageFile])

  return (
    <div key={filename}>
      {image?.image?.ref && (
        <Image
          width="50"
          height="100"
          src={`https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${image.image.ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}`}
          alt=""
        />
      )}
      {!!imageFile && (
        <img
          width="50"
          height="100"
          src={URL.createObjectURL(imageFile)}
          alt=""
        />
      )}
      <label className="block">
        <span>File name</span>
        <input
          className="border"
          name={`${name}[filename]`}
          value={filename}
          onChange={(event) => {
            setFilename(event.target.value)
          }}
        />
      </label>
      <label className="block">
        <span>Alt text</span>
        <input
          className="border"
          name={`${name}[alt]`}
          defaultValue={image?.alt}
        />
      </label>
      <label className="block">
        <span>Aspect ratio w</span>
        <input
          className="border"
          type="number"
          name={`${name}[aspectRatio][width]`}
          defaultValue={image?.aspectRatio?.width}
        />
      </label>
      <label className="block">
        <span>Aspect ratio h</span>
        <input
          className="border"
          type="number"
          name={`${name}[aspectRatio][height]`}
          defaultValue={image?.aspectRatio?.height}
        />
      </label>
      <p>
        <button onClick={onClickRemove}>Remove Image</button>
      </p>
    </div>
  )
}
