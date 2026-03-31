'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { uploadMedia } from '@/lib/api/services/media.service'
import { Button } from '@/components/ui/button'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
}

export function ImageUpload({ value, onChange, onUploadingChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setUploading(uploading: boolean) {
    setIsUploading(uploading)
    onUploadingChange?.(uploading)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, or GIF images are allowed')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be under 5 MB')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    setError(null)
    try {
      const { imageUrl } = await uploadMedia(file)
      onChange(imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        className="relative aspect-square w-full max-w-xs bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-muted-foreground/60 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <Image src={value} alt="Product image" fill className="object-cover" sizes="320px" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground text-sm gap-1">
            <span className="text-2xl">+</span>
            <span>Click to upload</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange('')}
          className="text-destructive"
        >
          Remove image
        </Button>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
