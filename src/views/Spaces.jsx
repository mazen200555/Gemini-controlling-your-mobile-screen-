import { useEffect, useState } from 'react'
import { SPACES, userById, hash } from '../data'
import { Icon, Avatar, LiveBadge, fmtNum, Toast } from '../components/ui'

function Wave({ seed }) {
  const bars = new Array(9).fill(0).map((_, i) => 0)
  return (
    <div className="wave">
      {bars.map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i * 0.11 + (seed % 5) * 0.05)}s`, height: 6 + (hash(seed + i) % 18) }} />
      ))}
    </div>
  )
}

export default function Spaces() {
  const [spaces, setSpaces] = useState(SPACES)
  const [toast, setToast] = useState(null)
  const [joined, setJoined] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [active, setActive] = useState(SPACES[0].id)

  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const activeSpace = spaces.find(s => s.id === active)

  const join = (space) => {
    setJoined(true)
    setActive(space.id)
    notify(`انضممت إلى ${space.title.split('|')[0].trim()} 🎙️`)
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">المساحات الصوتية</h1>
        <p className="page-sub">نقاشات حيّة بالصوت والتفاعل · برؤية ثلاثية الأبعاد للمتحدثين</p>
      </div>

      {/* Hero live space */}
      <div className="ai-hero" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,.3), rgba(236,72,153,.2))' }}>
        <div className="flex" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <span className="pill live"><span className="pulse" /> مباشر الآن</span>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginTop: 12 }}>{activeSpace.title}</h2>
            <p className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>{activeSpace.description}</p>
          </div>
          <div className="center" style={{ flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 36 }}>🎙️</div>
            <span className="pill soft">👂 {fmtNum(activeSpace.listeners)}</span>
          </div>
        </div>

        {/* Speakers grid */}
        <div className="flex mt-2" style={{ gap: 14, flexWrap: 'wrap' }}>
          {activeSpace.speakers.map(sp => {
            const u = userById(sp.id)
            return (
              <div key={sp.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, background: 'rgba(0,0,0,.25)' }}>
                <Avatar user={u} size="lg" speaking={sp.speaking} />
                <div>
                  <div className="flex" style={{ alignItems: 'center', gap: 5 }}>
                    <span style={{ fontWeight: 800 }}>{u.name}</span>
                    {sp.order === 1 && <span className="pill amber" style={{ fontSize: 10 }}>مضيف</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>@{u.handle}</div>
                  {sp.speaking ? <Wave seed={hash(sp.id)} /> : <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>🔇 صامت</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex mt-2" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => { setMicOn(!micOn); notify(micOn ? 'أوقفت الميكروفون 🔇' : 'الميكروفون يعمل 🎤') }}>
            <Icon name={micOn ? 'mic' : 'micOff'} size={16} /> {micOn ? 'إيقاف المايك' : 'تشغيل المايك'}
          </button>
          <button className="btn ghost" onClick={() => notify('رفعت يدك ✋')}>✋ ارفع يدك</button>
          <button className="btn ghost" onClick={() => notify('أضفت إيموجي تفاعلي')}>🎉 تفاعل</button>
          <span className="pill soft" style={{ marginRight: 'auto' }}>🔊 جودة صوتية فائقة · تقنية العزل</span>
        </div>
      </div>

      {/* All spaces */}
      <h3 className="page-sub" style={{ fontSize: 18, fontWeight: 800, margin: '24px 0 14px' }}>المساحات الأكثر تفاعلاً</h3>
      <div>
        {spaces.map(space => {
          const owner = userById(space.owner)
          return (
            <div className="space-card" key={space.id} onClick={() => join(space)}>
              <div className="space-top">
                <Avatar user={owner} size="md" />
                <div className="grow">
                  <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                    <span className="space-title">{space.title}</span>
                    {space.status === 'live' && <LiveBadge />}
                  </div>
                  <div className="space-desc">{space.description}</div>
                </div>
              </div>
              <div className="tags" style={{ marginTop: 10 }}>
                {space.topics.map(t => <span className="tag" key={t}>#{t}</span>)}
              </div>
              <div className="space-footer">
                <div className="space-speakers">
                  {space.speakers.slice(0, 5).map(sp => <Avatar key={sp.id} user={userById(sp.id)} size="sm" speaking={sp.speaking} />)}
                  <span className="pill soft" style={{ marginRight: 6 }}>{space.speakers.length} متحدثين</span>
                </div>
                <span className={`pill ${space.status === 'live' ? 'grad' : 'cyan'}`} style={{ marginRight: 'auto' }}>
                  {space.status === 'live' ? <><Icon name="user" size={12} /> {fmtNum(space.listeners)} يستمعون</> : <>📅 {space.scheduled}</>}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <Toast message={toast} />
    </div>
  )
}
