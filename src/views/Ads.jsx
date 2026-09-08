import { useState } from 'react'
import { AD_CAMPAIGNS, toArabic } from '../data'
import { Icon, Progress, Toast } from '../components/ui'

export default function Ads({ onNav }) {
  const [toast, setToast] = useState(null)
  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const { budget, campaigns, audiences } = AD_CAMPAIGNS

  const metrics = [
    { label: 'ميزانية شهرية', value: budget, cur: 'ريال', icon: 'money', color: '#8b5cf6' },
    { label: 'حملات نشطة', value: AD_CAMPAIGNS.active, icon: 'target', color: '#ec4899' },
    { label: 'إجمالي الوصول', value: AD_CAMPAIGNS.reach, icon: 'user', color: '#22d3ee' },
    { label: 'معدل التحويل', value: AD_CAMPAIGNS.conversion, cur: '%', icon: 'chart', color: '#22c55e' },
  ]

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">لوحة الإعلانات للشركات</h1>
        <p className="page-sub">أعلن للجمهور المناسب عبر بثٍّ مباشر ومساحات صوتية · خوارزمية NEXA تطابق جمهورك</p>
      </div>

      <div className="metric-grid">
        {metrics.map(m => (
          <div className="stat-card" key={m.label}>
            <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}><Icon name={m.icon} /></span>
              <div>
                <div className="stat-label">{m.label}</div>
                <div className="stat-value" style={{ fontSize: 25 }}>{m.value.toLocaleString('en-US')}<span style={{ fontSize: 14, color: 'var(--muted)' }}> {m.cur || ''}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="card" style={{ padding: 18, marginBottom: 22 }}>
        <div className="flex" style={{ alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 800 }}>استهلاك الميزانية</span>
          <span className="pill violet" style={{ marginRight: 'auto' }}>${AD_CAMPAIGNS.spent.toLocaleString()} منصرف</span>
        </div>
        <Progress value={(AD_CAMPAIGNS.spent / budget) * 100} height={10} />
        <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>المتبقّي ${(budget - AD_CAMPAIGNS.spent).toLocaleString()} هذا الشهر</div>
      </div>

      <div className="grid-2">
        {/* Campaigns */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>حملاتك الإعلانية</h3>
          <div className="card" style={{ padding: '0 8px' }}>
            {campaigns.map(cp => (
              <div className="campaign-row" key={cp.id}>
                <div className="badge-brand" style={{ background: `linear-gradient(135deg, hsl(${cp.color * 50},70%,45%), hsl(${cp.color * 60 + 30},70%,50%))` }}>{cp.brand[0]}</div>
                <div className="grow">
                  <div style={{ fontWeight: 800 }}>{cp.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{cp.brand} · {cp.type}</div>
                  <div className="flex gap-sm mt-1" style={{ alignItems: 'center' }}>
                    <span className="pill soft" style={{ fontSize: 11 }}>🌍 {cp.reach.toLocaleString()} وصول</span>
                    <span className="pill soft" style={{ fontSize: 11 }}>📊 {cp.engag}% تفاعل</span>
                    <span className={`pill ${cp.status === 'نشط' ? 'green' : 'amber'}`} style={{ fontSize: 11 }}>{cp.status}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>${cp.spent.toLocaleString()}</div>
                  <div className="muted" style={{ fontSize: 11 }}>من ${cp.budget.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audiences */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>جماهير متاحة للاستهداف</h3>
          <div className="card" style={{ padding: 18 }}>
            {audiences.map((a, i) => (
              <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{a.name}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{a.size.toLocaleString()}</span>
                </div>
                <Progress value={100 - i * 18} color={['#8b5cf6','#ec4899','#22d3ee','#f59e0b'][i]} />
              </div>
            ))}
          </div>

          <button className="btn primary block mt-1" onClick={() => notify('أنشأت حملة إعلانية جديدة 🎉')}>
            + إنشاء حملة جديدة
          </button>
          <button className="btn ghost block mt-1" onClick={() => notify('تم فتح تقرير التحليلات التفصيلي 📊')}>
            عرض تحليلات متقدمة
          </button>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
