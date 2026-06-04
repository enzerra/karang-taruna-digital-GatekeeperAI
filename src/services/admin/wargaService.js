import { requestJson } from '../../lib/apiClient'

const WARGA_API = '/api/warga'

export async function listWarga() {
  return requestJson(WARGA_API)
}

export async function bulkImportWarga(data) {
  return requestJson(`${WARGA_API}/bulk`, {
    method: 'POST',
    body: JSON.stringify({ data })
  })
}
