import { NEWS } from './portalData'

const STORAGE_KEY = 'karang-taruna-news-v1'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80'

const CATEGORY_COLORS = {
  KEGIATAN: '#059669',
  EKONOMI: '#2563eb',
  OLAHRAGA: '#ea580c',
  PENDIDIKAN: '#7c3aed',
  SOSIAL: '#dc2626',
  BUDAYA: '#b45309',
}

function normalizeNews(item, idx = 0) {
  const category = String(item.category || 'KEGIATAN').toUpperCase()
  return {
    id: Number(item.id) || Date.now() + idx,
    title: String(item.title || 'Berita Baru').trim(),
    category,
    catColor: item.catColor || CATEGORY_COLORS[category] || '#1f2937',
    desc: String(item.desc || '').trim(),
    date: String(item.date || '-').trim(),
    img: String(item.img || '').trim() || FALLBACK_IMAGE,
    status: item.status || 'Published',
  }
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map((item, idx) => normalizeNews(item, idx))
  } catch {
    return null
  }
}

export function getNews() {
  if (typeof window === 'undefined') {
    return NEWS.map((item, idx) => normalizeNews(item, idx))
  }
  const saved = safeParse(window.localStorage.getItem(STORAGE_KEY))
  if (saved && saved.length) return saved
  const seeded = NEWS.map((item, idx) => normalizeNews(item, idx))
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

export function saveNews(news) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(news.map((item, idx) => normalizeNews(item, idx)))
  )
}

export function getNewsCategoryColor(category) {
  return CATEGORY_COLORS[String(category || '').toUpperCase()] || '#1f2937'
}

export const NEWS_CATEGORIES = ['KEGIATAN', 'EKONOMI', 'OLAHRAGA', 'PENDIDIKAN', 'SOSIAL', 'BUDAYA']
export const NEWS_STATUS = ['Published', 'Draft']
export { FALLBACK_IMAGE }
