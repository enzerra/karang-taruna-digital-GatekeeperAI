import { STRUCTURE } from '../../mocks/portalData'
import { USE_BACKEND_API } from '../../config/api'
import { requestJson } from '../../lib/apiClient'

export async function getStructure() {
  if (USE_BACKEND_API) return requestJson('/api/structure')
  return STRUCTURE
}
