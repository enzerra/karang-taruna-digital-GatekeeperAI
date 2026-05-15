import { FALLBACK_IMAGE, getPrograms, savePrograms } from './programStore'

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
  return getPrograms()
}

export async function findProgramById(id) {
  const programs = getPrograms()
  return programs.find((item) => item.id === Number(id)) ?? null
}

export async function createProgram(payload) {
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
  const targetId = Number(id)
  const programs = getPrograms()
  const nextPrograms = programs.filter((item) => item.id !== targetId)
  savePrograms(nextPrograms)
  return true
}
