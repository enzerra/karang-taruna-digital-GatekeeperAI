// Middleware penanganan rute tak ditemukan & error global, plus helper.

export function notFound(req, res, next) {
  res.status(404).json({ message: `Rute tidak ditemukan: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Multer file size error
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File terlalu besar. Periksa batas upload server.' })
  }

  // body-parser / express.json payload too large
  // err.type can be 'entity.too.large' or code 'PayloadTooLargeError'
  if (err && (err.type === 'entity.too.large' || err.code === 'PayloadTooLargeError')) {
    return res.status(413).json({ message: 'Payload terlalu besar. Batasi ukuran permintaan atau gunakan unggahan bertahap.' })
  }

  const status = err.status || 500
  if (status >= 500) {
    console.error(err)
  }
  res.status(status).json({ message: err.message || 'Terjadi kesalahan pada server.' })
}

// Helper untuk membuat error dengan status HTTP.
export function httpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

// Membungkus handler async agar error-nya diteruskan ke errorHandler.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
