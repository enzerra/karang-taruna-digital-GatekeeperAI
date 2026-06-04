import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { sanitizeTransaction } from '../lib/normalize.js'

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'dummy'
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws }
})

export async function init() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase URL atau Service Key belum dikonfigurasi di .env')
  }
}

function handleDbResponse(result) {
  if (result.error) throw new Error(result.error.message)
  return result.data
}

/* ------------------------------- Berita ------------------------------ */
export async function listNews() {
  const { data, error } = await supabase.from('news')
    .select('id, title, category, catColor:cat_color, desc:descr, date, img, status')
    .order('id', { ascending: false })
  if (error) throw error
  return data
}
export async function getNews(id) {
  const { data, error } = await supabase.from('news')
    .select('id, title, category, catColor:cat_color, desc:descr, date, img, status')
    .eq('id', Number(id))
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function createNews(d) {
  const { data, error } = await supabase.from('news')
    .insert({ title: d.title, category: d.category, cat_color: d.catColor, descr: d.desc, date: d.date, img: d.img, status: d.status })
    .select('id, title, category, catColor:cat_color, desc:descr, date, img, status')
    .single()
  if (error) throw error
  return data
}
export async function updateNews(id, d) {
  const { data, error } = await supabase.from('news')
    .update({ title: d.title, category: d.category, cat_color: d.catColor, descr: d.desc, date: d.date, img: d.img, status: d.status })
    .eq('id', Number(id))
    .select('id, title, category, catColor:cat_color, desc:descr, date, img, status')
    .single()
  if (error) throw error
  return data
}
export async function deleteNews(id) {
  const { error } = await supabase.from('news').delete().eq('id', Number(id))
  return !error
}

/* ------------------------------ Program ------------------------------ */
export async function listPrograms() {
  const { data, error } = await supabase.from('programs')
    .select('id, title, category, badge, period, desc:descr, img')
    .order('id', { ascending: false })
  if (error) throw error
  return data
}
export async function getProgram(id) {
  const { data, error } = await supabase.from('programs')
    .select('id, title, category, badge, period, desc:descr, img')
    .eq('id', Number(id))
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function createProgram(d) {
  const { data, error } = await supabase.from('programs')
    .insert({ title: d.title, category: d.category, badge: d.badge, period: d.period, descr: d.desc, img: d.img })
    .select('id, title, category, badge, period, desc:descr, img')
    .single()
  if (error) throw error
  return data
}
export async function updateProgram(id, d) {
  const { data, error } = await supabase.from('programs')
    .update({ title: d.title, category: d.category, badge: d.badge, period: d.period, descr: d.desc, img: d.img })
    .eq('id', Number(id))
    .select('id, title, category, badge, period, desc:descr, img')
    .single()
  if (error) throw error
  return data
}
export async function deleteProgram(id) {
  const { error } = await supabase.from('programs').delete().eq('id', Number(id))
  return !error
}

/* ------------------------------ Pengguna ----------------------------- */
const USER_SEL = 'id, name, email, role, status, lastLogin:last_login'
const USER_AUTH_SEL = `${USER_SEL}, password`

export async function listUsers() {
  const { data, error } = await supabase.from('users').select(USER_SEL).order('id')
  if (error) throw error
  return data
}
export async function getUser(id) {
  const { data, error } = await supabase.from('users').select(USER_SEL).eq('id', Number(id)).single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function getUserByEmail(email) {
  const target = String(email || '').trim().toLowerCase()
  const { data, error } = await supabase.from('users').select(USER_AUTH_SEL).eq('email', target).single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function createUser(d, password) {
  const { data, error } = await supabase.from('users')
    .insert({ name: d.name, email: d.email, role: d.role, status: d.status, last_login: d.lastLogin, password: password ? String(password) : null })
    .select(USER_SEL)
    .single()
  if (error) throw error
  return data
}
export async function updateUser(id, d, password) {
  const updatePayload = { name: d.name, email: d.email, role: d.role, status: d.status, last_login: d.lastLogin }
  if (password) updatePayload.password = String(password)
  const { data, error } = await supabase.from('users').update(updatePayload).eq('id', Number(id)).select(USER_SEL).single()
  if (error) throw error
  return data
}
export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', Number(id))
  return !error
}
export async function touchLastLogin(id, time) {
  await supabase.from('users').update({ last_login: time }).eq('id', Number(id))
}

/* ------------------------------ Keuangan ----------------------------- */
const TX_SEL = 'id, date, type, desc:descr, category, status, amount, source, receipt_image, validation_confidence, items, ocr_raw_result'

export async function listTransactions() {
  const { data, error } = await supabase.from('transactions').select(TX_SEL).order('id', { ascending: false })
  if (error) throw error
  return data.map(row => ({ ...row, ...sanitizeTransaction(row) }))
}
export async function createTransaction(d) {
  const sanitized = sanitizeTransaction(d)
  const { data, error } = await supabase.from('transactions')
    .insert({
      date: sanitized.date, type: sanitized.type, descr: sanitized.desc, category: sanitized.category,
      status: sanitized.status, amount: sanitized.amount, source: sanitized.source, receipt_image: sanitized.receipt_image,
      validation_confidence: sanitized.validation_confidence, items: sanitized.items, ocr_raw_result: sanitized.ocr_raw_result
    })
    .select(TX_SEL)
    .single()
  if (error) throw error
  return { ...data, ...sanitizeTransaction(data) }
}
export async function createTransactions(transactions) {
  if (!transactions || !transactions.length) return []
  const payload = transactions.map(d => {
    const sanitized = sanitizeTransaction(d)
    return {
      date: sanitized.date, type: sanitized.type, descr: sanitized.desc, category: sanitized.category,
      status: sanitized.status, amount: sanitized.amount, source: sanitized.source, receipt_image: sanitized.receipt_image,
      validation_confidence: sanitized.validation_confidence, items: sanitized.items, ocr_raw_result: sanitized.ocr_raw_result
    }
  })
  const { data, error } = await supabase.from('transactions').insert(payload).select(TX_SEL)
  if (error) throw error
  return data.map(row => ({ ...row, ...sanitizeTransaction(row) }))
}
export async function updateTransaction(id, d) {
  const sanitized = sanitizeTransaction(d)
  const { data, error } = await supabase.from('transactions')
    .update({
      date: sanitized.date, type: sanitized.type, descr: sanitized.desc, category: sanitized.category,
      status: sanitized.status, amount: sanitized.amount, source: sanitized.source, receipt_image: sanitized.receipt_image,
      validation_confidence: sanitized.validation_confidence, items: sanitized.items, ocr_raw_result: sanitized.ocr_raw_result
    })
    .eq('id', Number(id))
    .select(TX_SEL)
    .single()
  if (error) throw error
  return data ? { ...data, ...sanitizeTransaction(data) } : null
}
export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', Number(id))
  return !error
}

export async function getCategories() {
  const { data, error } = await supabase.from('finance_categories').select('type, name').order('id')
  if (error) throw error
  const result = { pemasukan: [], pengeluaran: [] }
  for (const row of data) {
    if (result[row.type]) result[row.type].push(row.name)
  }
  return result
}
export async function addCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  await supabase.from('finance_categories').insert({ type: key, name }).select()
  return getCategories()
}
export async function removeCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  await supabase.from('finance_categories').delete().match({ type: key, name })
  return getCategories()
}

/* --------------------------- Import Batch ---------------------------- */
const BATCH_SEL = 'id, sourceType:source_type, fileName:file_name, originalName:original_name, status, totalRows:total_rows, validRows:valid_rows, invalidRows:invalid_rows, previewReady:preview_ready, confirmedAt:confirmed_at, createdAt:created_at, updatedAt:updated_at'

export async function listImportBatches() {
  const { data, error } = await supabase.from('import_batches').select(BATCH_SEL).order('id', { ascending: false })
  if (error) throw error
  return data
}
export async function getImportBatch(id) {
  const { data, error } = await supabase.from('import_batches').select(BATCH_SEL).eq('id', Number(id)).single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function createImportBatch(d) {
  const { data, error } = await supabase.from('import_batches').insert({
    source_type: d.sourceType || 'excel', file_name: d.fileName, original_name: d.originalName, status: d.status || 'draft',
    total_rows: Number(d.totalRows) || 0, valid_rows: Number(d.validRows) || 0, invalid_rows: Number(d.invalidRows) || 0,
    preview_ready: Boolean(d.previewReady), confirmed_at: d.confirmedAt ?? null
  }).select(BATCH_SEL).single()
  if (error) throw error
  return data
}
export async function updateImportBatch(id, d) {
  const { data, error } = await supabase.from('import_batches').update({
    source_type: d.sourceType || 'excel', file_name: d.fileName, original_name: d.originalName, status: d.status || 'draft',
    total_rows: Number(d.totalRows) || 0, valid_rows: Number(d.validRows) || 0, invalid_rows: Number(d.invalidRows) || 0,
    preview_ready: Boolean(d.previewReady), confirmed_at: d.confirmedAt ?? null, updated_at: new Date().toISOString()
  }).eq('id', Number(id)).select(BATCH_SEL).single()
  if (error) throw error
  return data
}
export async function deleteImportBatch(id) {
  const { error } = await supabase.from('import_batches').delete().eq('id', Number(id))
  return !error
}

const RECORD_SEL = 'id, batchId:batch_id, rowIndex:row_index, rawData:raw_data, normalizedData:normalized_data, validationErrors:validation_errors, status, createdAt:created_at, updatedAt:updated_at'

export async function listImportRecords(batchId) {
  const { data, error } = await supabase.from('import_records').select(RECORD_SEL).eq('batch_id', Number(batchId)).order('row_index')
  if (error) throw error
  return data
}
export async function getImportRecord(id) {
  const { data, error } = await supabase.from('import_records').select(RECORD_SEL).eq('id', Number(id)).single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}
export async function createImportRecord(d) {
  const { data, error } = await supabase.from('import_records').insert({
    batch_id: Number(d.batchId), row_index: Number(d.rowIndex) || 0, raw_data: d.rawData ?? {}, normalized_data: d.normalizedData ?? {},
    validation_errors: Array.isArray(d.validationErrors) ? d.validationErrors : [], status: d.status || 'pending'
  }).select(RECORD_SEL).single()
  if (error) throw error
  return data
}
export async function createImportRecords(records) {
  if (!records || !records.length) return []
  const payload = records.map(d => ({
    batch_id: Number(d.batchId), row_index: Number(d.rowIndex) || 0, raw_data: d.rawData ?? {}, normalized_data: d.normalizedData ?? {},
    validation_errors: Array.isArray(d.validationErrors) ? d.validationErrors : [], status: d.status || 'pending'
  }))
  // Supabase limits bulk insert to 1000 rows by default, so we can chunk if needed. 
  // But 872 is fine. We will just send it directly.
  const { data, error } = await supabase.from('import_records').insert(payload).select(RECORD_SEL)
  if (error) throw error
  return data
}
export async function updateImportRecord(id, d) {
  const { data, error } = await supabase.from('import_records').update({
    batch_id: Number(d.batchId), row_index: Number(d.rowIndex) || 0, raw_data: d.rawData ?? {}, normalized_data: d.normalizedData ?? {},
    validation_errors: Array.isArray(d.validationErrors) ? d.validationErrors : [], status: d.status || 'pending', updated_at: new Date().toISOString()
  }).eq('id', Number(id)).select(RECORD_SEL).single()
  if (error) throw error
  return data
}
export async function deleteImportRecord(id) {
  const { error } = await supabase.from('import_records').delete().eq('id', Number(id))
  return !error
}

/* ----------------------------- Struktur ------------------------------ */
export async function getStructure() {
  const { data, error } = await supabase.from('org_structure').select('data').eq('id', 1).single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.data ?? {}
}
export async function updateStructure(patch) {
  const current = await getStructure()
  const next = { ...current, ...patch }
  const { error } = await supabase.from('org_structure').upsert({ id: 1, data: next })
  if (error) throw error
  return next
}
