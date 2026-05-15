import { TRANSACTIONS } from '../../mocks/portalData'
import { readStorage, writeStorage } from '../../lib/storage'

const TX_KEY = 'karang-taruna-finance-transactions-v1'
const CAT_KEY = 'karang-taruna-finance-categories-v1'

const DEFAULT_CATEGORIES = {
  pemasukan: ['Kas bulanan', 'Wifi', 'Donasi'],
  pengeluaran: ['Konsumsi', 'Peralatan', 'Event'],
}

function normalizeTransaction(item, idx = 0) {
  const type = item.type === 'Pengeluaran' || item.amount < 0 ? 'Pengeluaran' : 'Pemasukan'
  const amountAbs = Math.abs(Number(item.amount) || 0)
  const signedAmount = type === 'Pengeluaran' ? -amountAbs : amountAbs
  return {
    id: Number(item.id) || Date.now() + idx,
    date: String(item.date || '').trim() || new Date().toISOString().slice(0, 10),
    type,
    desc: String(item.desc || '').trim(),
    category: String(item.category || '').trim() || (type === 'Pemasukan' ? 'Kas bulanan' : 'Konsumsi'),
    status: String(item.status || 'Lunas').trim(),
    amount: signedAmount,
  }
}

function safeParse(raw) {
  try {
    const parsed = raw
    return parsed
  } catch {
    return null
  }
}

export function getTransactions() {
  if (typeof window === 'undefined') {
    return TRANSACTIONS.map((item, idx) => normalizeTransaction(item, idx))
  }
  const saved = safeParse(readStorage(TX_KEY))
  if (Array.isArray(saved) && saved.length) return saved.map((item, idx) => normalizeTransaction(item, idx))
  const seeded = TRANSACTIONS.map((item, idx) => normalizeTransaction(item, idx))
  writeStorage(TX_KEY, seeded)
  return seeded
}

export function saveTransactions(transactions) {
  if (typeof window === 'undefined') return
  writeStorage(TX_KEY, transactions.map((item, idx) => normalizeTransaction(item, idx)))
}

export function getCategories() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  const saved = safeParse(readStorage(CAT_KEY))
  if (saved && typeof saved === 'object') {
    return {
      pemasukan: Array.isArray(saved.pemasukan) ? saved.pemasukan : DEFAULT_CATEGORIES.pemasukan,
      pengeluaran: Array.isArray(saved.pengeluaran) ? saved.pengeluaran : DEFAULT_CATEGORIES.pengeluaran,
    }
  }
  writeStorage(CAT_KEY, DEFAULT_CATEGORIES)
  return DEFAULT_CATEGORIES
}

export function saveCategories(categories) {
  if (typeof window === 'undefined') return
  const next = {
    pemasukan: Array.isArray(categories?.pemasukan) ? categories.pemasukan : DEFAULT_CATEGORIES.pemasukan,
    pengeluaran: Array.isArray(categories?.pengeluaran) ? categories.pengeluaran : DEFAULT_CATEGORIES.pengeluaran,
  }
  writeStorage(CAT_KEY, next)
}

