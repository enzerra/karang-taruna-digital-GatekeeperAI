export async function uploadForCleansing(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/cleansing/upload', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP Error ${response.status}`)
  }

  return response.json()
}
