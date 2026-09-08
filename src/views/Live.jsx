import { useEffect, useRef, useState } from 'react'
import { STREAMS, CHAT_SEED, CHAT_POOL, userById, hash } from '../data'
import { Icon, Avatar, fmtNum, Toast } from '../components/ui'
import { useApp } from '../context'

const EMOJI = ['🔥', '❤️', '🎉', '👏', '😂', '💜', '🚀', '🤯', '🎊', '🕺']
const GIFTS = [
  { emoji: '🍕', name: 'بيتزا', cost: 5 },
  { emoji: '🚀', name: 'صاروخ', cost: 50 },
  { emoji: '🦄', name: 'يونيكورن', cost: 20 },
  { emoji: '👑', name: 'تاج', cost: 100 },
  { emoji: '🌹', name: 'وردة', cost: 8 },
  { emoji: '💎', name: 'ماسة', cost: 200 },
]

export default function Live() {
  const { navTarget, toggleFollow, followed } = useApp()
  const stream = STREAMS.find(s => s.id === navTarget?.streamId) || STREAMS[0]
  const host = userById(stream.host)
  const isFollowing = !!followed[host.id]

  const [msgs, setMsgs] = useState(() => CHAT_SEED.map(m => ({ ...m, id: 's' + Math.random() })))
  const [viewers, setViewers] = useState(stream.viewers)
  const [msg, setMsg] = useState('')
  const [floats, setFloats] = useState([])
  const [muted, setMuted] = useState(false)
  const [toast, setToast] = useState(null)
  const [pulse, setPulse] = useState(0)
  const listRef = useRef()

  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }

  // simulate incoming chat + viewers
  useEffect(() => {
    const iv = setInterval(() => {
      const pick = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)]
      setMsgs(prev => [...prev.slice(-28), { id: Math.random(), author: pick.author, text: pick.text }])
      setViewers(v => v + Math.floor(Math.random() * 60 - 25))
    }, 1600)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, [msgs])

  const send = () => {
    if (!msg.trim()) return
    setMsgs(prev => [...prev.slice(-28), { id: Math.random(), author: 'you', text: msg.trim() }])
    setMsg('')
  }

  const gift = (g) => {
    const x = 15 + Math.random() * 70
    setFloats(prev => [...prev, { id: Math.random(), emoji: g.emoji, x }])
    setPulse(p => p + 1)
    notify(`أرسلت هدية ${g.name} 🎁`)
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== 0)), 1)
    setTimeout(() => setFloats(prev => prev.slice(1)), 4200)
  }

  const react = () => {
    const e = EMOJI[Math.floor(Math.random() * EMOJI.length)]
    setFloats(prev => [...prev.slice(-40), { id: Math.random(), emoji: e, x: 10 + Math.random() * 80 }])
    setPulse(p => p + 1)
  }

  const c = hash(stream.id)

  return (
    <div className="fade-in">
      <div className="page-head flex" style={{ alignItems: 'center' }}>
        <div className="grow">
          <h1 className="page-title">البثّ المباشر</h1>
          <p className="page-sub">تفاعل لحظياً · هدايا · تصويت · إعلانات مدمجة</p>
        </div>
        <span className="pill live"><span className="pulse" /> {fmtNum(viewers)} يشاهد</span>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2.2fr 1fr' }}>
        {/* Player */}
        <div className="player-wrap">
          <div className="player-stage">
            <div className="glow" style={{ background: `radial-gradient(circle at 50% 40%, hsl(${c % 360},80%,45%), transparent 70%)` }} />
            <div className="stage-content" style={{ flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 48 }}>🎮</div>
              <div style={{ textAlign: 'center', padding: '0 30px' }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{stream.title}</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>{stream.description}</div>
              </div>
            </div>
          </div>
          <div className="gift-bar">
            <span className="pill violet"><Icon name="target" size={13} /> إعلان مدمج — TechGulf NX-9</span>
          </div>
          <div className="live-now">
            <span className="pill live"><span className="pulse" /> LIVE</span>
            <span className="pill soft">{stream.quality}</span>
          </div>
          {floats.map(f => (
            <div key={f.id} className="float-msg" style={{ left: `${f.x}%`, fontSize: 30 + (pulse % 10) }}>
              {f.emoji}
            </div>
          ))}
          <div className="player-controls">
            <button className="control" onClick={() => setMuted(!muted)}>{muted ? '🔇' : '🔊'}</button>
            <button className="control">📺</button>
            <button className="control">⚙️</button>
            <button className="control main" onClick={react}>❤️</button>
            <div className="player-meta" style={{ marginRight: 'auto' }}>
              <Avatar user={host} size="sm" speaking />
              <div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{host.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{fmtNum(host.followers)} متابع</div>
              </div>
              <button className="btn sm" style={{ background: isFollowing ? 'rgba(255,255,255,.1)' : 'var(--grad)', color: '#fff' }} onClick={() => toggleFollow(host.id)}>
                {isFollowing ? 'متابع ✓' : 'متابعة'}
              </button>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="chat">
          <div className="chat-head">
            <span className="pill live">💬 مباشر</span>
            <span className="muted" style={{ marginRight: 'auto', fontSize: 12 }}>{fmtNum(viewers)} معك</span>
          </div>
          <div className="chat-list" ref={listRef}>
            {msgs.map(m => {
              const u = userById(m.author)
              return (
                <div className="chat-msg" key={m.id}>
                  <Avatar user={u} size="sm" />
                  <div>
                    <span className="chat-author">{u.name}</span>
                    <p className="chat-text">{m.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="chat-input">
            <input placeholder="اكتب رسالة..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="control" onClick={send}>🚀</button>
          </div>
        </div>
      </div>

      {/* Gifts */}
      <div className="card mt-2" style={{ padding: 18 }}>
        <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 800 }}>إرسال هدية</h3>
          <span className="pill soft" style={{ marginRight: 'auto' }}><Icon name="coins" size={13} /> الرصيد: 520</span>
        </div>
        <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
          {GIFTS.map(g => (
            <button key={g.name} onClick={() => gift(g)} className="card" style={{ padding: '12px 16px', textAlign: 'center', minWidth: 92, cursor: 'pointer', transition: 'transform .15s' }}>
              <div style={{ fontSize: 28 }}>{g.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>{g.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{g.cost} قطعة</div>
            </button>
          ))}
        </div>
      </div>

      {/* Poll / engagement */}
      <div className="grid-2 mt-2">
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🗳️ تصويت للجمهور — من يفوز بالمباراة؟</h3>
          <div className="flex" style={{ flexDirection: 'column', gap: 12 }}>
            {[{ t: 'الفريق الأزرق', p: 64, c: '#3b82f6' }, { t: 'الفريق الأحمر', p: 36, c: '#ef4444' }].map(o => (
              <div key={o.t}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{o.t}</span><span className="muted">{o.p}%</span>
                </div>
                <div className="bar"><div style={{ width: `${o.p}%`, background: o.c }} /></div>
              </div>
            ))}
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>2048 صويت حتى الآن · نتيجة لحظية</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📣 إعلان مدمج · TechGulf NX-9</h3>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>يظهر هذا الإعلان لمشاهدي هذا البثّ ضمن خوارزمية NEXA الذكية ليتناسب مع اهتمامات الجمهور الرياضي.</p>
          <div className="flex gap-sm mt-1" style={{ alignItems: 'center' }}>
            <div className="badge-brand" style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>T</div>
            <div className="grow">
              <div style={{ fontWeight: 800, fontSize: 14 }}>NX-9 Pro — سرعة خارقة</div>
              <div className="muted" style={{ fontSize: 12 }}>عرض خاص لمتابعي NEXA</div>
            </div>
            <button className="btn sm primary">اعرف المزيد</button>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
