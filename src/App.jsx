import { useState } from 'react'
import { AppProvider, useApp } from './context'
import Home from './views/Home'
import Live from './views/Live'
import Spaces from './views/Spaces'
import Creators from './views/Creators'
import Ads from './views/Ads'
import AI from './views/AI'
import SearchOverlay from './components/SearchOverlay'
import Notifications from './components/Notifications'
import ProfileModal from './components/ProfileModal'
import GoLive from './components/GoLive'
import { AI_INSIGHTS, userById, STREAMS } from './data'
import { Icon, Avatar, Toast, FollowBtn, fmtNum as fmt } from './components/ui'
import './index.css'

const NAV = [
  { key: 'home', label: 'الرئيسية' },
  { key: 'live', label: 'البثّ المباشر' },
  { key: 'spaces', label: 'المساحات الصوتية' },
  { key: 'creators', label: 'دعم صانعي المحتوى' },
  { key: 'ads', label: 'إعلانات الشركات' },
  { key: 'ai', label: 'الذكاء الاصطناعي' },
]
const NAV_ICON = { home: 'home', live: 'live', spaces: 'spaces', creators: 'creators', ads: 'ads', ai: 'ai' }

function RightRail({ nav }) {
  const trends = AI_INSIGHTS.hotTopics.slice(0, 4)
  const creators = ['u2', 'u3', 'u10', 'u1', 'u5']
  const { openProfile } = useApp()
  return (
    <div className="right-rail">
      <div className="rail-block">
        <div className="rail-title"><Icon name="trending" size={16} /> ينتشر الآن</div>
        {trends.map(t => (
          <div className="trend-item" key={t.label} onClick={() => nav('ai')}>
            <div className="trend-cat">رائج · #{t.label.split(' ')[0]}</div>
            <div className="trend-name">{t.label}</div>
            <div className="trend-meta">{t.growth}</div>
          </div>
        ))}
      </div>

      <div className="rail-block">
        <div className="rail-title"><Icon name="live" size={16} /> منشئون يقترحون</div>
        {creators.map(id => {
          const u = userById(id)
          return (
            <div className="side-creator" key={id} onClick={() => openProfile(id)}>
              <Avatar user={u} size="md" noClick />
              <div className="grow">
                <div className="flex" style={{ alignItems: 'center', gap: 4 }}>
                  <span className="name">{u.name}</span>
                  {u.isVerified && <Icon name="verify" size={11} />}
                </div>
                <div className="sub">@{u.handle} · {fmt(u.followers)} متابع</div>
              </div>
              <FollowBtn userId={id} />
            </div>
          )
        })}
      </div>

      <div className="rail-block" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,.25), rgba(236,72,153,.16))' }}>
        <div className="rail-title">✨ NEXA PRO</div>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>ارفُع مستوى تجربتك: بثّ 4K، مساحات غير محدودة، تحليلات متقدمة.</p>
        <button className="btn primary block" style={{ marginTop: 12 }} onClick={() => nav('creators')}>جرّب مجاناً</button>
      </div>

      <div className="rail-block">
        <div className="rail-title"><Icon name="bolt" size={16} /> دعم مجتمع NEXA</div>
        <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌍</span>
          <div className="grow">
            <div style={{ fontWeight: 800, fontSize: 13 }}>2.4 مليون عضو نشط</div>
            <div className="muted" style={{ fontSize: 11 }}>مجتمع حي يبثّ ويتبادل 24/7</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Floating live-active bar present across the whole app (integration)
function LiveActiveBar({ nav }) {
  const stream = STREAMS[0]
  const host = userById(stream.host)
  return (
    <div className="live-active" onClick={() => nav('live')}>
      <span className="pill live"><span className="pulse" /> LIVE</span>
      <div style={{ fontWeight: 800, fontSize: 13, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stream.title}</div>
      <div style={{ color: 'var(--muted)', fontSize: 12 }}>· {fmt(stream.viewers)} يشاهد</div>
    </div>
  )
}

function Shell() {
  const { page, nav, search, setSearch, setShowSearch, showSearch, setShowNotifs, showNotifs, unread, setGoLiveOpen, toast, openProfile } = useApp()
  const [q, setQ] = useState('')

  const views = {
    home: <Home />,
    live: <Live />,
    spaces: <Spaces />,
    creators: <Creators />,
    ads: <Ads />,
    ai: <AI />,
  }

  const me = userById('you')

  // sync local search box with context search (for the overlay index)
  const handleSearch = (v) => {
    setQ(v)
    setSearch(v)
    setShowSearch(!!v.trim())
  }

  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <div className="brand" onClick={() => nav('home')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo">✴</div>
            <div className="brand-name">NE<span>XA</span></div>
          </div>
          <nav className="nav">
            {NAV.map(n => (
              <button key={n.key} className={`nav-item ${page === n.key ? 'active' : ''}`} onClick={() => nav(n.key)}>
                <span className="nav-icon"><Icon name={NAV_ICON[n.key]} size={19} /></span>
                {n.label}
              </button>
            ))}
          </nav>
          <button className="nav-action" onClick={() => setGoLiveOpen(true)}><Icon name="plus" size={18} /> ابدأ البثّ</button>
          <div className="sidebar-me" onClick={() => openProfile('you')} style={{ cursor: 'pointer' }}>
            <Avatar user={me} size="md" noClick />
            <div className="grow">
              <div style={{ fontWeight: 700, fontSize: 13 }}>{me.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>@{me.handle}</div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar" style={{ position: 'relative' }}>
            <div className="search" style={{ position: 'relative' }}>
              <Icon name="search" />
              <input placeholder="ابحث عن بثّ، مساحة، شخص، هاشتاق..." value={q} onChange={e => handleSearch(e.target.value)} onFocus={() => setShowSearch(!!search.trim())} />
              {q && <button className="pill soft" onClick={() => handleSearch('')}>مسح</button>}
              <SearchOverlay />
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => nav('ai')} title="الذكاء الاصطناعي"><Icon name="ai" size={20} /></button>
              <button className="icon-btn" title="إشعارات" onClick={() => setShowNotifs(!showNotifs)}>
                <Icon name="bell" size={20} />{unread > 0 && <span className="dot" />}
              </button>
              <button className="icon-btn" title="رسائل"><Icon name="mail" size={20} /></button>
            </div>
            <Notifications />
          </div>
          <div className="content">{views[page]}</div>
        </main>

        <RightRail nav={nav} />
      </div>

      <LiveActiveBar nav={nav} />

      <nav className="mobile-nav">
        {NAV.slice(0, 5).map(n => (
          <button key={n.key} className={`mnav-item ${page === n.key ? 'active' : ''}`} onClick={() => nav(n.key)}>
            <span className="ic"><Icon name={NAV_ICON[n.key]} size={20} /></span>
            {n.label.split(' ')[0]}
          </button>
        ))}
      </nav>

      <ProfileModal />
      <GoLive />
      <Toast message={toast} />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
