import { getCategories, getTransactions, saveCategories, saveTransactions } from './financeStore'
import { USE_BACKEND_API } from '../../config/api'
import { requestJson } from '../../lib/apiClient'

function sanitizeTxPayload(payload = {}) {
  const type = payload.type === 'Pengeluaran' ? 'Pengeluaran' : 'Pemasukan'
  const amountAbs = Math.abs(Number(payload.amount) || 0)
  return {
    date: String(payload.date || '').trim() || new Date().toISOString().slice(0, 10),
    type,
    desc: String(payload.desc || '').trim(),
    category: String(payload.category || '').trim(),
    status: String(payload.status || 'Lunas').trim(),
    amount: type === 'Pengeluaran' ? -amountAbs : amountAbs,
  }
}

export async function listTransactions() {
  if (USE_BACKEND_API) return requestJson('/api/finance/transactions')
  return getTransactions()
}

export async function createTransaction(payload) {
  if (USE_BACKEND_API) {
    return requestJson('/api/finance/transactions', { method: 'POST', body: JSON.stringify(payload) })
  }
  const tx = getTransactions()
  const next = { id: Date.now(), ...sanitizeTxPayload(payload) }
  const nextTx = [next, ...tx]
  saveTransactions(nextTx)
  return next
}

export async function updateTransaction(id, payload) {
  if (USE_BACKEND_API) {
    return requestJson(`/api/finance/transactions/${Number(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  }
  const targetId = Number(id)
  const tx = getTransactions()
  const nextTx = tx.map((item) => (item.id === targetId ? { ...item, ...sanitizeTxPayload(payload), id: item.id } : item))
  saveTransactions(nextTx)
  return nextTx.find((item) => item.id === targetId) ?? null
}

export async function removeTransaction(id) {
  if (USE_BACKEND_API) {
    await requestJson(`/api/finance/transactions/${Number(id)}`, { method: 'DELETE' })
    return true
  }
  const targetId = Number(id)
  const tx = getTransactions()
  const nextTx = tx.filter((item) => item.id !== targetId)
  saveTransactions(nextTx)
  return true
}

export async function listCategories() {
  if (USE_BACKEND_API) return requestJson('/api/finance/categories')
  return getCategories()
}

export async function addCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  const nextName = String(name || '').trim()
  if (USE_BACKEND_API) {
    if (!nextName) return requestJson('/api/finance/categories')
    return requestJson('/api/finance/categories', {
      method: 'POST',
      body: JSON.stringify({ type: key, name: nextName }),
    })
  }
  const categories = getCategories()
  if (!nextName) return categories
  const nextList = Array.from(new Set([...(categories[key] || []), nextName]))
  const next = { ...categories, [key]: nextList }
  saveCategories(next)
  return next
}

export async function removeCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  const target = String(name || '').trim()
  if (USE_BACKEND_API) {
    return requestJson('/api/finance/categories', {
      method: 'DELETE',
      body: JSON.stringify({ type: key, name: target }),
    })
  }
  const categories = getCategories()
  const next = { ...categories, [key]: (categories[key] || []).filter((item) => item !== target) }
  saveCategories(next)
  return next
}

