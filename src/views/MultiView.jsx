import { useState } from 'react'
import { STREAMS, userById, hash } from '../data'
import { Icon, Avatar, fmtNum } from '../components/ui'
import { useApp } from '../context'
import { Toast } from '../components/ui'

export default function MultiView() {
  const { nav, openProfile, addXp, notify } = useApp()
  const [layout, setLayout] = useState('2x2')
  const [selected, setSelected] = useState({})
  const [toast, setToast] = useState(null)
  const layouts = {
    '2x2': { cols: 2, rows: 2 },
    '3x1': { cols: 3, rows: 1 },
    '4x1': { cols: 4, rows: 1 },
  }
  const L = layouts[layout]
  const streams = STREAMS.slice(0, 4)

  const toggleSel = (id, e) => {
    e.stopPropagation()
    setSelected(s => ({ ...s, [id]: !s[id] }))
  }

  const mix = () => {
    setToast('تم إرسال الموجة إلى المنشئ — اشترك في المكس لتظهر بثّهم في شبكتك 🎨')
    setTimeout(() => setToast(null), 2400)
    addXp(15, 'بثّ متعدد')
    notify('حصلت على +15 XP من مشاهدة متعددة ⚡')
  }

  return (
    <div className="fade-in">
      <div className="page-head flex" style={{ alignItems: 'center' }}>
        <div className="grow">
          <h1 className="page-title">مشاهدة متعددة</h1>
          <p className="page-sub">شاهد حتى 4 بثوث مباشرة في آنٍ واحد · أنشئ شبكة مشاهدة باشتراكاتك</p>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div className="flex" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="pill violet"><Icon name="flame" size={13} /> متابعة حيّة</span>
          <div className="flex gap-sm grow" style={{ flexWrap: 'wrap' }}>
            {Object.keys(layouts).map(k => (
              <button key={k} className={`pill ${layout === k ? 'grad' : 'soft'}`} onClick={() => setLayout(k)}>{layouts[k].name}</button>
            ))}
          </div>
          <button className="btn sm primary" onClick={mix}>🎨 مزج الشبكة</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${L.cols}, 1fr)`, gap: 14, marginTop: 16 }}>
          {streams.map(s => {
            const host = userById(s.host)
            const c = hash(s.id)
            const sel = !!selected[s.id]
            return (
              <div className="card" key={s.id} onClick={() => nav('live', { streamId: s.id })} style={{ overflow: 'hidden', cursor: 'pointer', border: sel ? '1px solid var(--violet)' : '1px solid var(--border)', position: 'relative', padding: 0 }}>
                <div style={{ height: 120, position: 'relative', background: `radial-gradient(circle at 50% 40%, hsl(${c % 360},80%,45%), transparent 70%)`, display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontSize: 34 }}>🎮</span>
                  <span className="live-badge"><span className="pulse" /> LIVE</span>
                  <span className="viewers-badge"><Icon name="user" size={11} /> {fmtNum(s.viewers)}</span>
                  <span className={`pill ${sel ? 'grad' : 'soft'}`} onClick={e => toggleSel(s.id, e)} style={{ position: 'absolute', top: 10, left: 10, fontSize: 11 }}>
                    {sel ? '✓' : '+'}
                  </span>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{s.title}</div>
                  <div className="flex" style={{ alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <Avatar user={host} size="sm" />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{host.name}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 6 }}>لماذا المشاهدة المتعددة؟</h3>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>معالم NEXA تسمح لك بمراقبة بطولات متعددة، مقارنة أداء لاعبين، أو متابعة مجرّد حاوٍ للبثّ الخاص مع البطولات، في آنٍ واحد — كل ذلك مع تحكم كامل بالصوت وبدون فقدان أي لحظة من المحتوى.</p>
        <div className="flex gap-sm mt-1" style={{ flexWrap: 'wrap' }}>
          <span className="pill cyan">🔊 صوت منفصل لكل بثّ</span>
          <span className="pill green">⚡ أداء عالٍ في المعاينة</span>
          <span className="pill violet">📡 متزامنة مع تدفق الإشارات</span>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
