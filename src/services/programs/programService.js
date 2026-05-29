import { FALLBACK_IMAGE, getPrograms, savePrograms } from './programStore'
import { USE_BACKEND_API } from '../../config/api'
import { requestJson } from '../../lib/apiClient'

function sanitizeProgramPayload(payload = {}) {
  return {
    title: String(payload.title || '').trim(),
    category: String(payload.category || 'Sosial').trim(),
    badge: String(payload.badge || 'AKTIF').trim(),
    period: String(payload.period || '').trim(),
    desc: String(payload.desc || '').trim(),
    img: String(payload.img || '').trim() || FALLBACK_IMAGE,
  }
}

export async function listPrograms() {
  if (USE_BACKEND_API) return requestJson('/api/programs')
  return getPrograms()
}

export async function findProgramById(id) {
  if (USE_BACKEND_API) return requestJson(`/api/programs/${Number(id)}`)
  const programs = getPrograms()
  return programs.find((item) => item.id === Number(id)) ?? null
}

export async function createProgram(payload) {
  if (USE_BACKEND_API) {
    return requestJson('/api/programs', { method: 'POST', body: JSON.stringify(payload) })
  }
  const programs = getPrograms()
  const nextProgram = {
    id: Date.now(),
    ...sanitizeProgramPayload(payload),
  }
  const nextPrograms = [nextProgram, ...programs]
  savePrograms(nextPrograms)
  return nextProgram
}

export async function updateProgram(id, payload) {
  if (USE_BACKEND_API) {
    return requestJson(`/api/programs/${Number(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  }
  const programs = getPrograms()
  const targetId = Number(id)
  const nextPrograms = programs.map((item) => {
    if (item.id !== targetId) return item
    return { ...item, ...sanitizeProgramPayload(payload) }
  })
  savePrograms(nextPrograms)
  return nextPrograms.find((item) => item.id === targetId) ?? null
}

export async function removeProgram(id) {
  if (USE_BACKEND_API) {
    await requestJson(`/api/programs/${Number(id)}`, { method: 'DELETE' })
    return true
  }
  const targetId = Number(id)
  const programs = getPrograms()
  const nextPrograms = programs.filter((item) => item.id !== targetId)
  savePrograms(nextPrograms)
  return true
}
