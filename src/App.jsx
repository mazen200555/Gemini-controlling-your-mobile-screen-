import { useState } from 'react'
import Home from './views/Home'
import Live from './views/Live'
import Spaces from './views/Spaces'
import Creators from './views/Creators'
import Ads from './views/Ads'
import AI from './views/AI'
import { AI_INSIGHTS, userById } from './data'
import { Icon, Avatar, fmtNum as fmt } from './components/ui'
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

function RightRail({ onNav }) {
  const trends = AI_INSIGHTS.hotTopics.slice(0, 4)
  const creators = ['u2', 'u3', 'u10', 'u1', 'u5']
  return (
    <div className="right-rail">
      <div className="rail-block">
        <div className="rail-title"><Icon name="trending" size={16} /> ينتشر الآن</div>
        {trends.map(t => (
          <div className="trend-item" key={t.label} onClick={() => onNav('ai')}>
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
            <div className="side-creator" key={id} onClick={() => onNav('live')}>
              <Avatar user={u} size="md" />
              <div className="grow">
                <div className="flex" style={{ alignItems: 'center', gap: 4 }}>
                  <span className="name">{u.name}</span>
                  {u.isVerified && <Icon name="verify" size={11} />}
                </div>
                <div className="sub">@{u.handle} · {fmtNum(u.followers)} متابع</div>
              </div>
              <span className="pill soft" style={{ fontSize: 10 }}>متابعة</span>
            </div>
          )
        })}
      </div>

      <div className="rail-block" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,.25), rgba(236,72,153,.16))' }}>
        <div className="rail-title">✨ NEXA PRO</div>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>ارفُع مستوى تجربتك: بثّ 4K، مساحات غير محدودة، تحليلات متقدمة.</p>
        <button className="btn primary block" style={{ marginTop: 12 }}>جرّب مجاناً</button>
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

export default function App() {
  const [page, setPage] = useState('home')
  const [query, setQuery] = useState('')

  const nav = (p) => { setPage(p); window.scrollTo(0, 0) }

  const views = {
    home: <Home onNav={nav} />,
    live: <Live onNav={nav} />,
    spaces: <Spaces onNav={nav} />,
    creators: <Creators onNav={nav} />,
    ads: <Ads onNav={nav} />,
    ai: <AI onNav={nav} />,
  }

  const me = userById('you')

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
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
        <button className="nav-action" onClick={() => nav('live')}><Icon name="plus" size={18} /> ابدأ البثّ</button>
        <div className="sidebar-me">
          <Avatar user={me} size="md" />
          <div className="grow">
            <div style={{ fontWeight: 700, fontSize: 13 }}>{me.name}</div>
            <div className="muted" style={{ fontSize: 11 }}>@{me.handle}</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <div className="search">
            <Icon name="search" />
            <input placeholder="ابحث عن بثّ، مساحة، شخص، هاشتاق..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button className="pill soft" onClick={() => setQuery('')}>مسح</button>}
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => nav('ai')} title="الذكاء الاصطناعي"><Icon name="ai" size={20} /></button>
            <button className="icon-btn" title="إشعارات"><Icon name="bell" size={20} /><span className="dot" /></button>
            <button className="icon-btn" title="رسائل"><Icon name="mail" size={20} /></button>
          </div>
        </div>
        <div className="content">{views[page]}</div>
      </main>

      {/* Right rail */}
      <RightRail onNav={nav} />

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {NAV.slice(0, 5).map(n => (
          <button key={n.key} className={`mnav-item ${page === n.key ? 'active' : ''}`} onClick={() => nav(n.key)}>
            <span className="ic"><Icon name={NAV_ICON[n.key]} size={20} /></span>
            {n.label.split(' ')[0]}
          </button>
        ))}
      </nav>
    </div>
  )
}
