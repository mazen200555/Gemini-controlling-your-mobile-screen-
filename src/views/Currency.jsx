import { useState } from 'react'
import { CURRENCIES, WITHDRAW_METHODS, EXCHANGE_TICKS } from '../data'
import { Icon, Toast } from '../components/ui'
import { useApp } from '../context'

export default function Currency() {
  const { balances, convert, withdraw, rateOf, priceTick, conversionHistory, withdrawHistory } = useApp()
  const [tab, setTab] = useState('تحويل')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('SAR')
  const [amount, setAmount] = useState(100)
  const [methodId, setMethodId] = useState('w1')
  const [wdCur, setWdCur] = useState('USD')
  const [wdAmt, setWdAmt] = useState(100)
  const [toast, setToast] = useState(null)

  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const rateOfFrom = rateOf(from), rateOfTo = rateOf(to)
  const got = +(amount / rateOfFrom * rateOfTo).toFixed(2)
  const method = WITHDRAW_METHODS.find(m => m.id === methodId)
  const fee = +(wdAmt * (method?.fee || 0) / 100).toFixed(2)
  const constNet = +(wdAmt - fee).toFixed(2)

  const c = (code) => CURRENCIES.find(x => x.code === code)

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">المحفظة والعملات القابلة للتحويل</h1>
        <p className="page-sub">أرصدة حقيقية بأسعار صرف لحظية · حوّل بين العملات واسحب لمحفظتك</p>
      </div>

      <div className="flex gap-sm" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
        {['تحويل', 'سحب', 'الأسعار'].map(t => (
          <button key={t} className={`pill ${tab === t ? 'grad' : 'soft'}`} onClick={() => setTab(t)} style={{ padding: '9px 18px', fontSize: 14 }}>{t}</button>
        ))}
      </div>

      {/* Balance strip */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {CURRENCIES.map(cur => {
          const tick = priceTick(cur.code)
          return (
            <div className="stat-card" key={cur.code}>
              <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{cur.flag}</span>
                <div>
                  <div className="stat-label">{cur.code}</div>
                  <div className="stat-value" style={{ fontSize: 20 }}>{balances[cur.code]?.toLocaleString('en-US')}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, color: tick.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {tick.change >= 0 ? '▲' : '▼'} {Math.abs(tick.change).toFixed(2)}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Convert */}
      {tab === 'تحويل' && (
        <div className="grid-2">
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 16 }}>💱 محوّل العملات</h3>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8, fontWeight: 700 }}>من</div>
            <select className="curr-select" value={from} onChange={e => setFrom(e.target.value)}>
              {CURRENCIES.map(x => <option key={x.code} value={x.code}>{x.flag} {x.code} — {x.name}</option>)}
            </select>
            <input type="number" className="curr-input" value={amount} min={0} onChange={e => setAmount(+e.target.value)} />

            <div className="center" style={{ margin: '12px 0' }}>⇅</div>

            <div className="muted" style={{ fontSize: 13, marginBottom: 8, fontWeight: 700 }}>إلى</div>
            <select className="curr-select" value={to} onChange={e => setTo(e.target.value)}>
              {CURRENCIES.map(x => <option key={x.code} value={x.code}>{x.flag} {x.code} — {x.name}</option>)}
            </select>

            <div className="card" style={{ padding: 16, marginTop: 16, background: 'var(--bg-2)' }}>
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <span className="muted" style={{ fontSize: 13 }}>ستحصل على</span>
                <span style={{ fontWeight: 900, fontSize: 22 }}>{got.toLocaleString('en-US')} <small style={{ fontSize: 14, color: 'var(--muted)' }}>{c(to).symbol}</small></span>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>السعر: 1 {from} = {(rateOfTo / rateOfFrom).toFixed(4)} {to}</div>
            </div>
            <button className="btn primary block mt-1" onClick={() => { if (convert(amount, from, to)) notify(`تم التبديل ✨`) }}>
              <Icon name="money" size={16} /> حوّل الآن
            </button>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🧾 سجلّ التبديلات</h3>
            {conversionHistory.map(h => (
              <div className="support-row" key={h.id}>
                <span style={{ fontSize: 20 }}>💱</span>
                <div className="grow">
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{h.fromAmt} {h.from} ← {h.toAmt} {h.to}</div>
                  <div className="muted" style={{ fontSize: 11 }}>السعر {h.rate} · {h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Withdraw */}
      {tab === 'سحب' && (
        <div className="grid-2">
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 16 }}>🏦 سحب الأرباح</h3>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              {WITHDRAW_METHODS.map(m => (
                <div key={m.id} className={`stream-opt ${methodId === m.id ? 'active' : ''}`} style={{ width: '48%' }} onClick={() => setMethodId(m.id)}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 12 }}>{m.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>رسوم {m.fee}% · {m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 16, marginBottom: 8, fontWeight: 700 }}>العملة</div>
            <select className="curr-select" value={wdCur} onChange={e => setWdCur(e.target.value)}>
              {CURRENCIES.map(x => <option key={x.code} value={x.code}>{x.flag} {x.code}</option>)}
            </select>
            <div className="muted" style={{ fontSize: 13, marginTop: 12, marginBottom: 8, fontWeight: 700 }}>المبلغ</div>
            <input type="number" className="curr-input" value={wdAmt} min={0} onChange={e => setWdAmt(+e.target.value)} />
            <div className="flex" style={{ justifyContent: 'space-between', marginTop: 14, fontSize: 13 }}>
              <span className="muted">الرسوم: {fee} {wdCur}</span>
              <span style={{ fontWeight: 800 }}>تحصل على {constNet.toFixed(2)} {wdCur}</span>
            </div>
            <button className="btn primary block mt-1" onClick={() => { if (withdraw(methodId, wdAmt, wdCur)) notify('✅ طلب السحب قيد المعالجة') }}>
              اطلب السحب (يصل خلال {method?.time})
            </button>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📦 عمليات السحب الأخيرة</h3>
            {withdrawHistory.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 24 }}>لا عمليات سحب بعد — ابدأ أول سحب.</div>}
            {withdrawHistory.map(h => (
              <div className="support-row" key={h.id}>
                <span style={{ fontSize: 20 }}>{h.method.icon}</span>
                <div className="grow">
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{h.net} {h.currency} عبر {h.method.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>رسوم {h.fee} · {h.time}</div>
                </div>
                <span className="pill green">قيد المعالجة</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rates live */}
      {tab === 'الأسعار' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 6 }}>💹 أسعار الصرف لحظية</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>المعروض لكل 1 دولار أمريكي (USD) — يتحدّث تلقائياً.</p>
          <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {CURRENCIES.map(cur => {
              const tick = priceTick(cur.code)
              return (
                <div className="stat-card" key={cur.code}>
                  <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{cur.flag}</span>
                    <span style={{ fontWeight: 800 }}>{cur.code}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{cur.rate.toFixed(2)}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: tick.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {tick.change >= 0 ? '▲' : '▼'} {Math.abs(tick.change).toFixed(2)}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}
