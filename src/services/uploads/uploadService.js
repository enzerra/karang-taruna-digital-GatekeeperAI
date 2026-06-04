import { getAuthToken } from '../../lib/apiClient'

function authHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function startUpload(filename, totalSize) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const res = await fetch(`${baseUrl}/api/uploads/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ filename, totalSize }),
  })
  if (!res.ok) throw new Error((await res.json()).message || `Start upload failed ${res.status}`)
  return res.json()
}

export async function uploadChunk(uploadId, index, chunk) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const form = new FormData()
  form.append('uploadId', uploadId)
  form.append('index', String(index))
  form.append('chunk', new Blob([chunk]), 'chunk')

  const res = await fetch(`${baseUrl}/api/uploads/chunk`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  })
  if (!res.ok) throw new Error((await res.json()).message || `Chunk upload failed ${res.status}`)
  return res.json()
}

export async function finishUpload(uploadId, originalName, totalSize) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const res = await fetch(`${baseUrl}/api/uploads/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ uploadId, originalName, totalSize }),
  })
  if (!res.ok) throw new Error((await res.json()).message || `Finish upload failed ${res.status}`)
  return res.json()
}

export async function uploadFileInChunks(file, onProgress = () => {}) {
  const totalSize = file.size
  const start = await startUpload(file.name, totalSize)
  const uploadId = start.uploadId
  const chunkSize = start.chunkSize || Number(import.meta.env.VITE_CHUNK_SIZE_BYTES) || 5 * 1024 * 1024

  const totalChunks = Math.ceil(totalSize / chunkSize)
  let uploaded = 0

  for (let i = 0; i < totalChunks; i++) {
    const startByte = i * chunkSize
    const endByte = Math.min(startByte + chunkSize, totalSize)
    const chunk = file.slice(startByte, endByte)

    // retry logic
    let attempts = 0
    while (attempts < 3) {
      try {
        await uploadChunk(uploadId, i, await chunk.arrayBuffer())
        uploaded += (endByte - startByte)
        onProgress({ uploaded, total: totalSize, index: i, totalChunks })
        break
      } catch (err) {
        attempts += 1
        if (attempts >= 3) throw err
        await new Promise((r) => setTimeout(r, 500 * attempts))
      }
    }
  }

  return finishUpload(uploadId, file.name, totalSize)
}
