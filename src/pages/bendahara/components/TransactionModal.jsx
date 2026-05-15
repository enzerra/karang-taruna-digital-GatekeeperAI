export default function TransactionModal({
  editingId,
  form,
  setForm,
  errorMessage,
  isSaving,
  closeModal,
  submitTx,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
        </div>

        <form onSubmit={submitTx} className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700">
              Tanggal
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Jenis
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700">
              Kategori
              <input
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Contoh: Donasi"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Nominal
              <input
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Contoh: 250000"
              />
            </label>
          </div>

          <label className="text-sm font-medium text-gray-700 block">
            Keterangan
            <textarea
              value={form.desc}
              onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </label>

          <label className="text-sm font-medium text-gray-700 block">
            Status
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="Lunas">Lunas</option>
              <option value="Proses">Proses</option>
            </select>
          </label>

          {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#1a3a6b] text-white font-semibold hover:bg-[#152f58] transition-colors"
            >
              {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
