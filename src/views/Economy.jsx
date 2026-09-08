import { useState } from 'react'
import { WALLET, SHOP_ITEMS, BADGES, XP_LEVELS, initialXp } from '../data'
import { Icon, fmtNum, Progress, Toast } from '../components/ui'
import { useApp } from '../context'

export default function Economy() {
  const { xp, streak, levelData, levelProgress, nextLevel, wallet, spendFromWallet, addXp, notify } = useApp()
  const [owned, setOwned] = useState({})
  const [toast, setToast] = useState(null)

  const buy = (item) => {
    if (owned[item.id]) { notify('🙌 لديك هذا العنصر بالفعل'); return }
    if (wallet < item.price) { notify('❌ رصيدك غير كافٍ لشراء هذا'); return }
    spendFromWallet(item.price)
    setOwned(o => ({ ...o, [item.id]: true }))
    addXp(15, 'شراء من المتجر')
    notify(`🛍️ اشتريت ${item.name}`)
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">اقتصاد NEXA — النقاط والمتجر</h1>
        <p className="page-sub">اكسب بالنقاط، ارتقِ بالمستوى، اشترِ بغالب، واجمع الشارات</p>
      </div>

      {/* Level card */}
      <div className="ai-hero">
        <div className="flex" style={{ alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 86, height: 86, borderRadius: '50%', background: 'var(--grad)', display: 'grid', placeItems: 'center', fontSize: 40, boxShadow: '0 0 40px rgba(236,72,153,.5)' }}>{levelData.icon}</div>
          <div className="grow">
            <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 20 }}>المستوى {levelData.level}</span>
              <span className="pill grad">{levelData.name}</span>
            </div>
            <div className="flex" style={{ alignItems: 'center', gap: 14, marginTop: 6 }}>
              <div className="grow">
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span className="muted">{fmtNum(xp)} XP</span>
                  {nextLevel && <span className="muted">المستوى {nextLevel.level} عند {fmtNum(nextLevel.xp)}</span>}
                </div>
                <Progress value={levelProgress} />
              </div>
            </div>
            <div className="flex gap-sm mt-1" style={{ flexWrap: 'wrap' }}>
              <span className="pill live"><span className="pulse" /> 🔥 سلسلة {streak} أيام</span>
              <span className="pill cyan">⚡ {fmtNum(xp)} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Wallet */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>💳 محفظتك</h3>
          <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
            <div><div className="stat-label">رصيدك</div><div style={{ fontSize: 30, fontWeight: 900 }}>${wallet}</div></div>
            <div><div className="stat-label">عملات</div><div style={{ fontSize: 26, fontWeight: 900 }}>🪙 {fmtNum(WALLET.coins)}</div></div>
            <div><div className="stat-label">جواهر</div><div style={{ fontSize: 26, fontWeight: 900 }}>💎 {fmtNum(WALLET.gems)}</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn sm ghost" onClick={() => { addXp(50, 'إيداع'); notify('أضفت $100 إلى رصيدك 🎉') }}>+ إيداع</button>
            <button className="btn sm ghost" style={{ marginRight: 10 }} onClick={() => { notify('فُتح معرض الجواهر 💎') }}>الجواهر</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="muted" style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>آخر الحركات</div>
            {WALLET.transactions.map(w => (
              <div className="support-row" key={w.id}>
                <span style={{ fontSize: 18 }}>{w.kind === 'earn' ? '⬆️' : '⬇️'}</span>
                <div className="grow">
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{w.label}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{w.time}</div>
                </div>
                <span style={{ fontWeight: 800, color: w.kind === 'earn' ? 'var(--green)' : 'var(--red)' }}>{w.amount > 0 ? '+' : ''}{w.amount}$</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>🛍️ متجر NEXA</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SHOP_ITEMS.map(item => (
              <div key={item.id} className="tier" style={{ padding: 16 }}>
                <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{item.name}</div>
                    <span className="pill soft" style={{ fontSize: 10 }}>{item.kind}</span>
                  </div>
                </div>
                <button className={`btn ${owned[item.id] ? 'ghost' : 'primary'} sm block`} onClick={() => buy(item)}>
                  {owned[item.id] ? '✓ ملكك' : `$${item.price}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card mt-2" style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>🏅 الشارات</h3>
        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
          {BADGES.map(b => (
            <div key={b.id} className="card" style={{ padding: 16, width: 130, textAlign: 'center', opacity: b.done ? 1 : 0.45, border: b.done ? '1px solid var(--violet)' : '1px solid var(--border)' }}>
              <div style={{ fontSize: 32 }}>{b.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginTop: 6 }}>{b.name}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{b.desc}</div>
              {b.done && <span className="pill green" style={{ marginTop: 6 }}>مُنجز ✓</span>}
            </div>
          ))}
        </div>
        <div className="flex gap-sm mt-2" style={{ alignItems: 'center' }}>
          <span className="pill soft">اطّلع على المستويات</span>
          <span className="pill soft">شارة جديدة تُفتح قريباً</span>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
