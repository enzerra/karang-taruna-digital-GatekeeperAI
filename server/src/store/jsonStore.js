// Implementasi store berbasis file JSON (db.json).
// Dipakai saat DB_DRIVER != postgres. Semua fungsi async agar antarmukanya
// sama persis dengan pgStore.

import { getCollection, loadDb, nextId, saveDb, setCollection } from '../lib/db.js'

export async function init() {
  loadDb()
}

/* ------------------------------- Berita ------------------------------ */
export async function listNews() {
  return [...getCollection('news')]
}
export async function getNews(id) {
  return getCollection('news').find((n) => n.id === Number(id)) ?? null
}
export async function createNews(data) {
  const news = getCollection('news')
  const item = { id: nextId(news), ...data }
  news.unshift(item)
  saveDb()
  return item
}
export async function updateNews(id, data) {
  const news = getCollection('news')
  const i = news.findIndex((n) => n.id === Number(id))
  if (i === -1) return null
  news[i] = { ...news[i], ...data, id: Number(id) }
  saveDb()
  return news[i]
}
export async function deleteNews(id) {
  const news = getCollection('news')
  const i = news.findIndex((n) => n.id === Number(id))
  if (i === -1) return false
  news.splice(i, 1)
  saveDb()
  return true
}

/* ------------------------------ Program ------------------------------ */
export async function listPrograms() {
  return [...getCollection('programs')]
}
export async function getProgram(id) {
  return getCollection('programs').find((p) => p.id === Number(id)) ?? null
}
export async function createProgram(data) {
  const programs = getCollection('programs')
  const item = { id: nextId(programs), ...data }
  programs.unshift(item)
  saveDb()
  return item
}
export async function updateProgram(id, data) {
  const programs = getCollection('programs')
  const i = programs.findIndex((p) => p.id === Number(id))
  if (i === -1) return null
  programs[i] = { ...programs[i], ...data, id: Number(id) }
  saveDb()
  return programs[i]
}
export async function deleteProgram(id) {
  const programs = getCollection('programs')
  const i = programs.findIndex((p) => p.id === Number(id))
  if (i === -1) return false
  programs.splice(i, 1)
  saveDb()
  return true
}

/* ------------------------------ Pengguna ----------------------------- */
export async function listUsers() {
  return [...getCollection('users')]
}
export async function getUser(id) {
  return getCollection('users').find((u) => u.id === Number(id)) ?? null
}
export async function getUserByEmail(email) {
  const target = String(email || '').trim().toLowerCase()
  return getCollection('users').find((u) => u.email === target) ?? null
}
export async function createUser(data, password) {
  const users = getCollection('users')
  const item = { id: nextId(users), ...data }
  if (password) item.password = String(password)
  users.unshift(item)
  saveDb()
  return item
}
export async function updateUser(id, data, password) {
  const users = getCollection('users')
  const i = users.findIndex((u) => u.id === Number(id))
  if (i === -1) return null
  const merged = { ...users[i], ...data, id: Number(id) }
  if (password) merged.password = String(password)
  users[i] = merged
  saveDb()
  return users[i]
}
export async function deleteUser(id) {
  const users = getCollection('users')
  const i = users.findIndex((u) => u.id === Number(id))
  if (i === -1) return false
  users.splice(i, 1)
  saveDb()
  return true
}
export async function touchLastLogin(id, time) {
  const user = await getUser(id)
  if (!user) return
  user.lastLogin = time
  saveDb()
}

/* ------------------------------ Keuangan ----------------------------- */
export async function listTransactions() {
  return [...getCollection('transactions')]
}
export async function createTransaction(data) {
  const tx = getCollection('transactions')
  const item = { id: nextId(tx), ...data }
  tx.unshift(item)
  saveDb()
  return item
}
export async function updateTransaction(id, data) {
  const tx = getCollection('transactions')
  const i = tx.findIndex((t) => t.id === Number(id))
  if (i === -1) return null
  tx[i] = { ...tx[i], ...data, id: Number(id) }
  saveDb()
  return tx[i]
}
export async function deleteTransaction(id) {
  const tx = getCollection('transactions')
  const i = tx.findIndex((t) => t.id === Number(id))
  if (i === -1) return false
  tx.splice(i, 1)
  saveDb()
  return true
}

export async function getCategories() {
  return getCollection('categories')
}
export async function addCategory(type, name) {
  const categories = getCollection('categories')
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  categories[key] = Array.from(new Set([...(categories[key] || []), name]))
  saveDb()
  return categories
}
export async function removeCategory(type, name) {
  const categories = getCollection('categories')
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  categories[key] = (categories[key] || []).filter((item) => item !== name)
  saveDb()
  return categories
}

/* ----------------------------- Struktur ------------------------------ */
export async function getStructure() {
  return getCollection('structure')
}
export async function updateStructure(patch) {
  const current = getCollection('structure')
  return setCollection('structure', { ...current, ...patch })
}
