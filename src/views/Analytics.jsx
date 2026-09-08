import { useState } from 'react'
import { ANALYTICS } from '../data'
import { Icon } from '../components/ui'
import { LineChart, DonutChart, BarChart, HorizontalBars } from '../components/charts'
import { useApp } from '../context'

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'م'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'ك'
  return String(n)
}

export default function Analytics() {
  const { nav, addXp, notify } = useApp()
  const [tab, setTab] = useState('صانع')
  const A = ANALYTICS

  const big = [
    { label: 'مشاهدات الأسبوع', value: 12700, delta: '+24%', color: 'var(--green)' },
    { label: 'دقائق المشاهدة', value: 566000, delta: '+31%', color: 'var(--cyan)' },
    { label: 'متابعين جدد', value: 461, delta: '+15%', color: 'var(--pink)' },
    { label: 'إيرادات الشهر', value: 3450, delta: '+42%', color: 'var(--violet)', cur: 'ريال' },
  ]

  const hours = Object.entries(A.hours).map(([label, value]) => ({ label, value }))

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">لوحة التحليلات الشاملة</h1>
        <p className="page-sub">مشاهدات، احتفاظ، إيرادات، وجمهورك بالمنطقة — كُلّها مترابطة وقابلة للتعمّق</p>
      </div>

      <div className="flex gap-sm" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
        {['صانع', 'علامة'].map(t => (
          <button key={t} className={`pill ${tab === t ? 'grad' : 'soft'}`} onClick={() => { setTab(t); addXp(5, 'تحليل') }} style={{ padding: '9px 18px', fontSize: 14 }}>{t === 'صانع' ? 'تحليلات صانع المحتوى' : 'تحليلات الإعلان'}</button>
        ))}
      </div>

      <div className="metric-grid">
        {big.map(m => (
          <div className="stat-card" key={m.label}>
            <div className="stat-label">{m.label}</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{fmt(m.value)} {m.cur && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{m.cur}</span>}</div>
            <div className="stat-delta" style={{ color: m.color }}>{m.delta} ▲</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Views line chart */}
        <div className="card" style={{ padding: 20 }}>
          <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 800 }}>📈 المشاهدات اليومية</h3>
            <span className="pill soft" style={{ marginRight: 'auto' }}>7 أيام</span>
          </div>
          <LineChart series={A.daily.map(d => d.views)} labels={A.daily.map(d => d.day)} color="#ec4899" />
          <div className="flex gap-md" style={{ justifyContent: 'space-between', marginTop: 6 }}>
            {A.daily.map(d => <span key={d.day} className="muted" style={{ fontSize: 10 }}>{d.day}</span>)}
          </div>
        </div>

        {/* Watch time bar */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>⏱️ ساعات الذروة (مشاهدة)</h3>
          <BarChart data={hours} color="linear-gradient(180deg,#8b5cf6,#ec4899)" height={150} />
          <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>الذروة بين 8 مساءً و 12 منتصف الليل — جرّب توقيت بثّك ليتزامن.</p>
        </div>
      </div>

      <div className="grid-2 mt-2">
        {/* Regions donut */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🌍 جمهورك حسب المنطقة</h3>
          <div className="flex" style={{ alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <DonutChart data={A.regions} centerLabel="44%" centerSub="السعودية" />
            <div className="grow">
              {A.regions.map(r => (
                <div key={r.label} className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: r.color, display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{r.label}</span>
                  <span className="muted" style={{ marginRight: 'auto' }}>{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention funnel */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🎯 قمع الاحتفاظ بالمشاهدين</h3>
          <HorizontalBars data={A.retention} color="linear-gradient(90deg,#22d3ee,#8b5cf6)" />
        </div>
      </div>

      {/* Funnel + revenue */}
      <div className="grid-2 mt-2">
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🔻 رحلة التحوّل</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {A.funnel.map(f => (
              <div key={f.label}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{f.label}</span><span className="muted">{f.v}%</span>
                </div>
                <div className="bar"><div style={{ width: `${f.v}%`, background: 'var(--grad)' }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(139,92,246,.18), rgba(236,72,153,.12))' }}>
          <h3 style={{ fontWeight: 800 }}>💎 إيرادات هذا الشهر</h3>
          <div style={{ fontSize: 44, fontWeight: 900, marginTop: 8, background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>3,450 ريال</div>
          <p className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>ارتفعت 42% عن الشهر الماضي عبر الدعم، الاشتراكات، والهدايا. أضف مصدر إيراد جديد من متجر NEXA.</p>
          <button className="btn primary mt-1" onClick={() => { addXp(15, 'تحليل'); notify('فُتح جدول تعمّق الإيرادات 📊') }}>تعمّق في الإيرادات</button>
        </div>
      </div>

    </div>
  )
}
