import InsightCard from './components/InsightCard'

export default function BendaharaPrediksi({ dashboardInsight }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <InsightCard
        title="Prediksi saldo (placeholder)"
        body="Prediksi saldo akan ditampilkan di sini. Saat backend/ML siap, endpoint prediksi bisa mengembalikan proyeksi saldo 1-3 bulan ke depan."
      />
      <InsightCard
        title="Tren pengeluaran"
        body={dashboardInsight}
      />
    </div>
  )
}
