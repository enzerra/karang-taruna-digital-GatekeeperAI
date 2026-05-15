export default function InsightCard({ title, body }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#0f294f]">{title}</p>
      <p className="text-sm text-[#556987] leading-relaxed mt-2">{body}</p>
    </div>
  )
}
