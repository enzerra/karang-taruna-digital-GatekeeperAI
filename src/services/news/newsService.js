import { FALLBACK_IMAGE, getNews, getNewsCategoryColor, saveNews } from './newsStore'
import { USE_BACKEND_API } from '../../config/api'
import { requestJson } from '../../lib/apiClient'

function formatDate(dateRaw) {
  if (!dateRaw) return '-'
  const date = new Date(dateRaw)
  if (Number.isNaN(date.getTime())) return String(dateRaw)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function sanitizeNewsPayload(payload = {}) {
  const category = String(payload.category || 'KEGIATAN').toUpperCase()
  return {
    title: String(payload.title || '').trim(),
    category,
    catColor: getNewsCategoryColor(category),
    desc: String(payload.desc || '').trim(),
    date: formatDate(payload.date),
    img: String(payload.img || '').trim() || FALLBACK_IMAGE,
    status: payload.status || 'Published',
  }
}

export async function listNews() {
  if (USE_BACKEND_API) return requestJson('/api/news')
  return getNews()
}

export async function findNewsById(id) {
  if (USE_BACKEND_API) return requestJson(`/api/news/${Number(id)}`)
  const news = getNews()
  return news.find((item) => item.id === Number(id)) ?? null
}

export async function createNews(payload) {
  if (USE_BACKEND_API) {
    return requestJson('/api/news', { method: 'POST', body: JSON.stringify(payload) })
  }
  const news = getNews()
  const nextItem = {
    id: Date.now(),
    ...sanitizeNewsPayload(payload),
  }
  const nextNews = [nextItem, ...news]
  saveNews(nextNews)
  return nextItem
}

export async function updateNews(id, payload) {
  if (USE_BACKEND_API) {
    return requestJson(`/api/news/${Number(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  }
  const targetId = Number(id)
  const news = getNews()
  const nextNews = news.map((item) => {
    if (item.id !== targetId) return item
    return { ...item, ...sanitizeNewsPayload(payload) }
  })
  saveNews(nextNews)
  return nextNews.find((item) => item.id === targetId) ?? null
}

export async function removeNews(id) {
  if (USE_BACKEND_API) {
    await requestJson(`/api/news/${Number(id)}`, { method: 'DELETE' })
    return true
  }
  const targetId = Number(id)
  const news = getNews()
  const nextNews = news.filter((item) => item.id !== targetId)
  saveNews(nextNews)
  return true
}
