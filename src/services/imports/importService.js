import { getAuthToken } from '../../lib/apiClient'
import { uploadFileInChunks } from '../uploads/uploadService'

function authHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function previewImportFile(file) {
  if (!file) {
    throw new Error('File wajib dipilih.')
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL belum diatur.')
  }

  // Client-side size guard and fallback to chunked upload
  const maxMb = Number(import.meta.env.VITE_MAX_UPLOAD_MB || 25)
  const maxBytes = maxMb * 1024 * 1024
  if (file.size && file.size > maxBytes) {
    // use chunked upload flow
    return uploadFileInChunks(file, (progress) => {
      // TODO: optionally surface progress to UI via event or callback passed in
      // For now we ignore it here.
    })
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${baseUrl}/api/imports/preview`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  })

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}`
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // abaikan body non-JSON
    }
    throw new Error(message)
  }

  return response.json()
}

export async function scanBukuKasFile(file) {
  if (!file) {
    throw new Error('File gambar wajib dipilih.')
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL belum diatur.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${baseUrl}/api/imports/scan-buku-kas`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  })

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}`
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // abaikan
    }
    throw new Error(message)
  }

  return response.json()
}

export async function commitImportBatch(payload) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) throw new Error('VITE_API_BASE_URL belum diatur.')

  const response = await fetch(`${baseUrl}/api/imports/commit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}`
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return response.json()
}