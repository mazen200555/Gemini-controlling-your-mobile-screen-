import { useState } from 'react'
import { TOURNAMENTS, userById } from '../data'
import { Icon, Avatar, fmtNum } from '../components/ui'
import { useApp } from '../context'

export default function Tournaments() {
  const { nav, addXp, notify } = useApp()
  const [tab, setTab] = useState('t1')
  const t = TOURNAMENTS.find(x => x.id === tab) || TOURNAMENTS[0]

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">البطولات الحيّة</h1>
        <p className="page-sub">نافس، تابع، وفُز — بثّ تورنمنت مباشر مع مجتمع NEXA</p>
      </div>

      <div className="flex gap-sm" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
        {TOURNAMENTS.map(tn => (
          <button key={tn.id} className={`pill ${tab === tn.id ? 'grad' : 'soft'}`} onClick={() => setTab(tn.id)} style={{ padding: '9px 18px', fontSize: 14 }}>
            {tn.name} {tn.status === 'live' && <span className="pulse" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', marginRight: 4 }} />}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div className="ai-hero">
        <div className="flex" style={{ alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 54 }}>🏆</span>
          <div className="grow">
            <h2 style={{ fontSize: 24, fontWeight: 900 }}>{t.name}</h2>
            <div className="flex gap-sm mt-1" style={{ flexWrap: 'wrap' }}>
              <span className="pill soft">🎮 {t.game}</span>
              <span className="pill soft">🌍 {t.region}</span>
              <span className="pill amber">💰 جائزة {fmtNum(t.prize)}</span>
              <span className={`pill ${t.status === 'live' ? 'live' : 'cyan'}`}>{t.status === 'live' ? 'مباشرة الآن' : `تبدأ ${t.start}`}</span>
            </div>
          </div>
          <button className="btn primary" onClick={() => { addXp(30, 'بطولة'); notify('انضممت للبطولة +30 XP 🏆'); nav('live', { streamId: 's3' }) }}>انضم الآن</button>
        </div>
      </div>

      <div className="grid-2">
        {/* Bracket */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🔀 قرعة المنافسة</h3>
          {t.bracket.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 30 }}>القرعة تُفتح قبل بدء البطولة</div>}
          {t.bracket.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {t.bracket.map(m => (
                <div key={m.id} className="card" style={{ padding: 14, background: 'rgba(0,0,0,.25)', border: '1px solid var(--border)' }}>
                  <div className={`flex`} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: m.winner === 'a' ? 'var(--green)' : 'var(--text)' }}>
                      {m.a} <span style={{ color: 'var(--muted)' }}>{m.aScore}</span>
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>VS</span>
                    <span style={{ fontWeight: 800, color: m.winner === 'b' ? 'var(--green)' : 'var(--text)' }}>
                      {m.bScore} {m.b}
                    </span>
                  </div>
                  {m.winner === null && <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>جارٍ الانطلاق</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🏅 لوحة المتصدرين</h3>
          {t.topPlayers.map((p, i) => {
            const u = userById(p.id)
            return (
              <div className="support-row" key={p.id}>
                <span style={{ fontWeight: 900, width: 22, fontSize: 16, color: ['#f59e0b', '#94a3b8', '#b45309'][i] || 'var(--muted)' }}>{i + 1}</span>
                <Avatar user={u} size="md" noClick />
                <div className="grow">
                  <div style={{ fontWeight: 800 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>⚡ سلسلة {p.streak} مباريات</div>
                </div>
                <span style={{ fontWeight: 900, color: 'var(--green)', fontSize: 16 }}>{p.score}</span>
              </div>
            )
          })}
          <button className="btn ghost block mt-1" onClick={() => nav('live', { streamId: 's3' })}>📺 شاهد البثّ الحيّ للبطولة</button>
        </div>
      </div>

      <div className="card mt-2" style={{ padding: 20 }}>
        <div className="flex" style={{ alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18 }}>💡 كيف أشارك في البطولات؟</h3>
          <span className="pill violet" style={{ marginRight: 'auto' }}>دليل سريع</span>
        </div>
        <div className="flex gap-md" style={{ flexWrap: 'wrap', color: 'var(--muted)', fontSize: 14 }}>
          <span>1️⃣ سجّل في البطولة المفضلة</span>
          <span>2️⃣ شاهد البثّ وتفاعل</span>
          <span>3️⃣ اجمع النقاط وارتقِ</span>
          <span>4️⃣ اربح الجوائز والشارات</span>
        </div>
      </div>
    </div>
  )
}
