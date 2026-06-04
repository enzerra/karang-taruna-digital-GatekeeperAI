import { httpError } from '../middleware/errors.js'

export async function generateAiReport(req, res, next) {
  try {
    const { saldo, totalIn, totalOut, latestTransactions } = req.body

    const gatekeeperUrl = process.env.GATEKEEPER_URL || 'http://localhost:8000'
    const response = await fetch(`${gatekeeperUrl}/ai-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        saldo: Number(saldo) || 0,
        total_in: Number(totalIn) || 0,
        total_out: Number(totalOut) || 0,
        latest_transactions: Array.isArray(latestTransactions) ? latestTransactions : [],
      }),
    })

    if (!response.ok) {
      let errorMsg = `Gatekeeper AI gagal (Status ${response.status})`
      try {
        const errData = await response.json()
        errorMsg = errData.detail || errorMsg
      } catch (e) {
        // ignore
      }
      return next(httpError(500, errorMsg))
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    next(httpError(500, `Gagal terhubung ke AI Gatekeeper: ${error.message}`))
  }
}
