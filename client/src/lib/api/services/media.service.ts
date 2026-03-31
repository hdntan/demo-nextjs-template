// Media upload uses multipart/form-data — cannot use the JSON-based ApiClient.
// Sends directly through the BFF proxy which forwards the raw stream to the backend.
export interface UploadMediaResult {
  imageUrl: string
}

interface BackendMediaRes {
  message: string
  data: string // image URL
}

export async function uploadMedia(file: File): Promise<UploadMediaResult> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch('/api/proxy/media/upload', {
    method: 'POST',
    body: form,
    // No Content-Type header — browser sets it automatically with the correct boundary
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Upload failed' })) as { message?: string }
    throw new Error(error.message ?? 'Upload failed')
  }

  const data = (await res.json()) as BackendMediaRes
  return { imageUrl: data.data }
}
