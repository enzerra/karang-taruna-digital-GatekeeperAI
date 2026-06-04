import { API_BASE_URL } from '../../config/api'
import { getAuthToken } from '../../lib/apiClient'

export async function scanKwitansi(file) {
  const formData = new FormData()
  formData.append('file', file)

  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}/api/ocr/kwitansi`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  })

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.message) errorMsg = errorData.message
    } catch (e) {
      // Ignore
    }
    throw new Error(errorMsg)
  }

  return response.json()
}
