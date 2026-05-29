// Sanitasi & normalisasi payload agar bentuk data dari API sama persis
// dengan yang diharapkan UI frontend (lihat src/services/* pada frontend).

const NEWS_CATEGORY_COLORS = {
  KEGIATAN: '#059669',
  EKONOMI: '#2563eb',
  OLAHRAGA: '#ea580c',
  PENDIDIKAN: '#7c3aed',
  SOSIAL: '#dc2626',
  BUDAYA: '#b45309',
}

const NEWS_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80'
const PROGRAM_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'

export function getNewsCategoryColor(category) {
  return NEWS_CATEGORY_COLORS[String(category || '').toUpperCase()] || '#1f2937'
}

function formatNewsDate(dateRaw) {
  if (!dateRaw) return '-'
  const date = new Date(dateRaw)
  if (Number.isNaN(date.getTime())) return String(dateRaw)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function sanitizeNews(payload = {}) {
  const category = String(payload.category || 'KEGIATAN').toUpperCase()
  return {
    title: String(payload.title || '').trim(),
    category,
    catColor: getNewsCategoryColor(category),
    desc: String(payload.desc || '').trim(),
    date: formatNewsDate(payload.date),
    img: String(payload.img || '').trim() || NEWS_FALLBACK_IMAGE,
    status: payload.status || 'Published',
  }
}

export function sanitizeProgram(payload = {}) {
  return {
    title: String(payload.title || '').trim(),
    category: String(payload.category || 'Sosial').trim(),
    badge: String(payload.badge || 'AKTIF').trim(),
    period: String(payload.period || '').trim(),
    desc: String(payload.desc || '').trim(),
    img: String(payload.img || '').trim() || PROGRAM_FALLBACK_IMAGE,
  }
}

export function sanitizeUser(payload = {}) {
  return {
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    role: String(payload.role || 'anggota').toLowerCase(),
    status: payload.status || 'Aktif',
    lastLogin: String(payload.lastLogin || '-').trim(),
  }
}

export function sanitizeTransaction(payload = {}) {
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

// Menghapus field sensitif (mis. password) sebelum dikirim ke klien.
export function publicUser(user) {
  if (!user) return user
  const { password, ...rest } = user
  return rest
}
