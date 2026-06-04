import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL dan SUPABASE_SERVICE_KEY harus diset di .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('Mulai migrasi data dari db.json ke Supabase...')
  const dbPath = path.join(__dirname, '..', '..', 'data', 'db.json')
  
  if (!fs.existsSync(dbPath)) {
    console.error('ERROR: db.json tidak ditemukan!')
    process.exit(1)
  }

  const raw = fs.readFileSync(dbPath, 'utf8')
  const db = JSON.parse(raw)

  // Migrate Users
  if (db.users && db.users.length > 0) {
    console.log(`Migrasi ${db.users.length} users...`)
    for (const u of db.users) {
      const payload = {
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        last_login: u.lastLogin,
        password: u.password
      }
      await supabase.from('users').insert(payload)
    }
  }

  // Migrate Transactions
  if (db.transactions && db.transactions.length > 0) {
    console.log(`Migrasi ${db.transactions.length} transactions...`)
    for (const t of db.transactions) {
      const payload = {
        date: t.date,
        type: t.type,
        descr: t.desc || t.descr,
        category: t.category,
        status: t.status,
        amount: Number(t.amount),
        source: t.source || 'manual',
        receipt_image: t.receipt_image || null,
        validation_confidence: t.validation_confidence || null,
        items: t.items || [],
        ocr_raw_result: t.ocr_raw_result || {}
      }
      await supabase.from('transactions').insert(payload)
    }
  }

  // Migrate Programs
  if (db.programs && db.programs.length > 0) {
    console.log(`Migrasi ${db.programs.length} programs...`)
    for (const p of db.programs) {
      const payload = {
        title: p.title,
        category: p.category,
        badge: p.badge,
        period: p.period,
        descr: p.desc || p.descr,
        img: p.img
      }
      await supabase.from('programs').insert(payload)
    }
  }

  // Migrate News
  if (db.news && db.news.length > 0) {
    console.log(`Migrasi ${db.news.length} news...`)
    for (const n of db.news) {
      const payload = {
        title: n.title,
        category: n.category,
        cat_color: n.catColor || n.cat_color,
        descr: n.desc || n.descr,
        date: n.date,
        img: n.img,
        status: n.status
      }
      await supabase.from('news').insert(payload)
    }
  }

  // Migrate Categories
  if (db.categories) {
    console.log('Migrasi finance_categories...')
    for (const type of ['pemasukan', 'pengeluaran']) {
      if (db.categories[type]) {
        for (const name of db.categories[type]) {
          await supabase.from('finance_categories').insert({ type, name }).select()
        }
      }
    }
  }

  // Migrate Structure
  if (db.structure) {
    console.log('Migrasi org_structure...')
    await supabase.from('org_structure').upsert({ id: 1, data: db.structure })
  }

  console.log('✅ Migrasi Selesai!')
}

runMigration().catch(console.error)
