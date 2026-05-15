import { PROGRAMS } from './portalData'

const STORAGE_KEY = 'karang-taruna-programs-v1'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'

const STATUS_COLORS = {
  AKTIF: { bg: '#dcfce7', text: '#166534' },
  MENDATANG: { bg: '#fef3c7', text: '#92400e' },
  SELESAI: { bg: '#e5e7eb', text: '#374151' },
}

const CATEGORY_COLORS = {
  Sosial: '#166534',
  Ekonomi: '#0f766e',
  Olahraga: '#1d4ed8',
  Lingkungan: '#15803d',
  Kesehatan: '#0f766e',
  Pendidikan: '#065f46',
  Budaya: '#7c2d12',
  Religi: '#14532d',
  Kepemudaan: '#4338ca',
}

function normalizeProgram(item, idx = 0) {
  const badge = item.badge || 'AKTIF'
  return {
    id: Number(item.id) || Date.now() + idx,
    title: item.title || 'Program Baru',
    category: item.category || 'Sosial',
    badge,
    desc: item.desc || '',
    period: item.period || '-',
    img: item.img || FALLBACK_IMAGE,
  }
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map((item, idx) => normalizeProgram(item, idx))
  } catch {
    return null
  }
}

export function getPrograms() {
  if (typeof window === 'undefined') {
    return PROGRAMS.map((item, idx) => normalizeProgram(item, idx))
  }
  const saved = safeParse(window.localStorage.getItem(STORAGE_KEY))
  if (saved && saved.length) return saved
  const seeded = PROGRAMS.map((item, idx) => normalizeProgram(item, idx))
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

export function savePrograms(programs) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(programs.map((item, idx) => normalizeProgram(item, idx)))
  )
}

export function getStatusStyle(status) {
  return STATUS_COLORS[status] || { bg: '#e5e7eb', text: '#374151' }
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#1f2937'
}

export const PROGRAM_STATUS = ['AKTIF', 'MENDATANG', 'SELESAI']
export const PROGRAM_CATEGORIES = ['Sosial', 'Ekonomi', 'Olahraga', 'Lingkungan', 'Kesehatan', 'Pendidikan', 'Budaya', 'Religi', 'Kepemudaan']
export { FALLBACK_IMAGE }
