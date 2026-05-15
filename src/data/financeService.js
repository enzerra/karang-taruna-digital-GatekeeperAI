import { getCategories, getTransactions, saveCategories, saveTransactions } from './financeStore'

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
  return getTransactions()
}

export async function createTransaction(payload) {
  const tx = getTransactions()
  const next = { id: Date.now(), ...sanitizeTxPayload(payload) }
  const nextTx = [next, ...tx]
  saveTransactions(nextTx)
  return next
}

export async function updateTransaction(id, payload) {
  const targetId = Number(id)
  const tx = getTransactions()
  const nextTx = tx.map((item) => (item.id === targetId ? { ...item, ...sanitizeTxPayload(payload), id: item.id } : item))
  saveTransactions(nextTx)
  return nextTx.find((item) => item.id === targetId) ?? null
}

export async function removeTransaction(id) {
  const targetId = Number(id)
  const tx = getTransactions()
  const nextTx = tx.filter((item) => item.id !== targetId)
  saveTransactions(nextTx)
  return true
}

export async function listCategories() {
  return getCategories()
}

export async function addCategory(type, name) {
  const categories = getCategories()
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  const nextName = String(name || '').trim()
  if (!nextName) return categories
  const nextList = Array.from(new Set([...(categories[key] || []), nextName]))
  const next = { ...categories, [key]: nextList }
  saveCategories(next)
  return next
}

export async function removeCategory(type, name) {
  const categories = getCategories()
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  const target = String(name || '').trim()
  const next = { ...categories, [key]: (categories[key] || []).filter((item) => item !== target) }
  saveCategories(next)
  return next
}

