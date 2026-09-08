import { useState } from 'react'
import { CREATOR_SUPPORT } from '../data'
import { Icon, fmtNum, Toast } from '../components/ui'

export default function Creators() {
  const [tier, setTier] = useState('t2')
  const [toast, setToast] = useState(null)
  const [supported, setSupported] = useState(false)
  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const { tiers, recentSupporters, goals, stats } = CREATOR_SUPPORT

  const pickTier = (id) => {
    setTier(id)
    setSupported(true)
    const t = tiers.find(x => x.id === id)
    notify(`أنت الآن داعم لمستوى «${t.name}» 💜`)
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">مركز صانعي المحتوى</h1>
        <p className="page-sub">حوّل شغفك إلى دخل · احصل على الدعم من جمهورك وشركاء NEXA</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{fmtNum(s.value)}{s.cur ? <span style={{ fontSize: 16, color: 'var(--muted)' }}> {s.cur}</span> : ''}</div>
            <div className="stat-delta" style={{ color: 'var(--green)' }}>{s.delta} ▲</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Support tiers */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>خطط الدعم الشهري</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {tiers.map(t => (
              <div className={`tier ${t.popular ? 'popular' : ''}`} key={t.id}>
                {t.popular && <span className="pill grad tier-badge">الأكثر شعبية</span>}
                <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{['💌','⭐','👑'][tiers.indexOf(t)]}</span>
                  <span style={{ fontWeight: 800 }}>{t.name}</span>
                </div>
                <div className="tier-price">{t.price}<small> {t.per}</small></div>
                <ul>
                  {t.perks.map(p => <li key={p}><span className="check">✔</span>{p}</li>)}
                </ul>
                <button className={`btn ${t.popular ? 'primary' : 'ghost'} block`} onClick={() => pickTier(t.id)}>
                  {supported && tier === t.id ? 'مشترك ✓' : 'ادعم'}
                </button>
              </div>
            ))}
          </div>

          {/* Goals */}
          <div className="flex mt-2" style={{ gap: 14 }}>
            {goals.map(g => (
              <div className="goal grow" key={g.label}>
                <div className="flex" style={{ justifyContent: 'space-between' }}>
                  <span className="muted" style={{ fontSize: 13 }}>{g.label}</span>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>{fmtNum(g.current)}{g.unit} / {fmtNum(g.target)}{g.unit}</span>
                </div>
                <div className="goal-bar"><div className="goal-fill" style={{ width: `${(g.current / g.target) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent supporters */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>أحدث الداعمين</h3>
          <div className="card" style={{ padding: '6px 18px' }}>
            {recentSupporters.map(s => (
              <div className="support-row" key={s.id}>
                <div className="badge-brand" style={{ background: `linear-gradient(135deg, #${5800000 + s.color * 900000}, #${9700000 + s.color * 600000})` }}>{s.name[0]}</div>
                <div className="grow">
                  <div className="flex" style={{ alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 800 }}>{s.name}</span>
                    <span className="pill soft" style={{ fontSize: 10 }}>{s.tier}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>"{s.message}" · {s.time}</div>
                </div>
                <span style={{ fontWeight: 900, color: 'var(--green)' }}>$ {s.amount}</span>
              </div>
            ))}
          </div>

          <div className="card mt-1" style={{ padding: 18 }}>
            <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26 }}>🌍</span>
              <div>
                <div style={{ fontWeight: 800 }}>صندوق دعم المجتمع</div>
                <div className="muted" style={{ fontSize: 12 }}>عبر NEXA، 20% من استحواذاتك تدعم صانعي المحتوى الناشئين.</div>
              </div>
            </div>
            <div className="flex gap-sm mt-1">
              <span className="pill green">✓ 4,280 صانع استفاد</span>
              <span className="pill soft">💰 1.2M ريال موزّعة</span>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
