import XLSX from 'xlsx'

const HEADER_ALIASES = {
  date: ['date', 'tanggal', 'tgl', 'transaction date', 'tanggal transaksi'],
  desc: ['desc', 'description', 'keterangan', 'uraian', 'deskripsi', 'nama transaksi'],
  category: ['category', 'kategori', 'jenis', 'group', 'klasifikasi'],
  type: ['type', 'tipe', 'jenis transaksi', 'debit kredit'],
  amount: ['amount', 'nominal', 'jumlah', 'nilai', 'total'],
  status: ['status', 'kondisi', 'keterangan status'],
}

function toText(value) {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function toDateText(value) {
  if (!value) return ''
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  const text = toText(value)
  if (!text) return ''
  const parsed = new Date(text)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return text
}

function detectType(rawType, rawAmount) {
  const type = toText(rawType).toLowerCase()
  if (type.includes('keluar') || type.includes('expense') || type.includes('pengeluaran') || type === 'out') {
    return 'Pengeluaran'
  }
  if (type.includes('masuk') || type.includes('income') || type.includes('pemasukan') || type === 'in') {
    return 'Pemasukan'
  }

  const amount = Number(String(rawAmount).replace(/[^0-9.-]/g, ''))
  if (!Number.isNaN(amount) && amount < 0) return 'Pengeluaran'
  return 'Pemasukan'
}

function detectCategory(type, rawCategory) {
  const category = toText(rawCategory)
  if (category) return category
  return type === 'Pengeluaran' ? 'Konsumsi' : 'Kas bulanan'
}

function parseAmount(rawAmount, type) {
  const numeric = Number(String(rawAmount ?? '').replace(/[^0-9.-]/g, ''))
  const abs = Math.abs(Number.isNaN(numeric) ? 0 : numeric)
  return type === 'Pengeluaran' ? -abs : abs
}

function pickField(row, aliases) {
  const keys = Object.keys(row || {})
  for (const key of keys) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    if (aliases.includes(normalized)) return row[key]
  }
  return ''
}

function normalizeRow(row, index) {
  const rawDate = pickField(row, HEADER_ALIASES.date)
  const rawDesc = pickField(row, HEADER_ALIASES.desc)
  const rawCategory = pickField(row, HEADER_ALIASES.category)
  const rawType = pickField(row, HEADER_ALIASES.type)
  const rawAmount = pickField(row, HEADER_ALIASES.amount)
  const rawStatus = pickField(row, HEADER_ALIASES.status)

  let type = detectType(rawType, rawAmount)
  let amount = parseAmount(rawAmount, type)

  // Support separate Pemasukan / Pengeluaran columns
  const keys = Object.keys(row || {})
  const pemasukanKey = keys.find(k => ['pemasukan', 'masuk', 'debit', 'debet'].includes(k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))
  const pengeluaranKey = keys.find(k => ['pengeluaran', 'keluar', 'kredit'].includes(k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))

  if (pemasukanKey || pengeluaranKey) {
    const valIn = Number(String(row[pemasukanKey] ?? '').replace(/[^0-9.-]/g, '')) || 0
    const valOut = Number(String(row[pengeluaranKey] ?? '').replace(/[^0-9.-]/g, '')) || 0
    if (valIn > 0) {
      type = 'Pemasukan'
      amount = valIn
    } else if (valOut > 0) {
      type = 'Pengeluaran'
      amount = -Math.abs(valOut)
    }
  }

  const normalized = {
    rowIndex: index + 1,
    date: toDateText(rawDate),
    type,
    desc: toText(rawDesc),
    category: detectCategory(type, rawCategory),
    status: toText(rawStatus) || 'Lunas',
    amount,
  }

  const issues = []
  if (!normalized.date) issues.push('Tanggal belum terdeteksi')
  if (!normalized.desc) issues.push('Deskripsi belum terdeteksi')
  if (!normalized.category) issues.push('Kategori belum terdeteksi')
  if (!normalized.amount) issues.push('Nominal belum terdeteksi')

  return {
    rowIndex: normalized.rowIndex,
    raw: row,
    transaction: normalized,
    issues,
  }
}

function processRows(rows, fileName, sourceType, sheetName) {
  const normalizedRows = rows
    .map((row, index) => normalizeRow(row, index))
    .filter((item) => item.transaction.desc || item.transaction.date || item.transaction.amount)

  let initialBalance = 0;
  let firstValidDate = new Date().toISOString().slice(0, 10);
  
  if (rows.length > 0) {
    for (const row of rows) {
      const keys = Object.keys(row);
      const saldoKey = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'saldo');
      if (saldoKey) {
        const valSaldo = Number(String(row[saldoKey] ?? '').replace(/[^0-9.-]/g, '')) || 0;
        if (valSaldo > 0) {
          const pemasukanKey = keys.find(k => ['pemasukan', 'masuk', 'debit', 'debet'].includes(k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
          const pengeluaranKey = keys.find(k => ['pengeluaran', 'keluar', 'kredit'].includes(k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
          
          const valIn = pemasukanKey ? (Number(String(row[pemasukanKey] ?? '').replace(/[^0-9.-]/g, '')) || 0) : 0;
          const valOut = pengeluaranKey ? (Number(String(row[pengeluaranKey] ?? '').replace(/[^0-9.-]/g, '')) || 0) : 0;
          
          const expectedInitial = valSaldo - valIn + valOut;
          if (expectedInitial > 0) {
            initialBalance = expectedInitial;
            const dateKey = keys.find(k => ['date', 'tanggal', 'tgl'].includes(k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
            if (dateKey && row[dateKey]) {
                firstValidDate = toDateText(row[dateKey]) || firstValidDate;
            }
          }
          break; // Stop after evaluating the first valid Saldo row
        }
      }
    }
  }

  if (initialBalance > 0) {
    normalizedRows.unshift({
      rowIndex: 0,
      raw: {},
      transaction: {
        rowIndex: 0,
        date: firstValidDate,
        type: 'Pemasukan',
        desc: 'Saldo Awal Sistem (Otomatis)',
        category: 'Kas bulanan',
        status: 'Lunas',
        amount: initialBalance
      },
      issues: []
    });
  }

  const totalRows = normalizedRows.length
  const validRows = normalizedRows.filter((item) => item.issues.length === 0).length
  const invalidRows = totalRows - validRows

  return {
    sourceType,
    fileName,
    sheetName,
    totalRows,
    validRows,
    invalidRows,
    previewRows: normalizedRows.map((item) => ({
      rowIndex: item.rowIndex,
      ...item.transaction,
      issues: item.issues,
    })),
  }
}

export function parseImportPreview(file) {
  if (!file?.buffer) {
    throw new Error('File upload tidak ditemukan.')
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('File tidak memiliki sheet yang dapat dibaca.')
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })
  
  const sourceType = file.originalname.toLowerCase().endsWith('.csv') ? 'csv' : 'xlsx'
  return processRows(rows, file.originalname, sourceType, sheetName)
}

export function parseScanPreview(jsonArray, fileName = 'scan_buku_kas.jpg') {
  if (!Array.isArray(jsonArray)) {
    throw new Error('Data hasil scan AI tidak valid.')
  }
  return processRows(jsonArray, fileName, 'image', 'AI Scan')
}