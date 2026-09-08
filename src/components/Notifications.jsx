import { useApp } from '../context'
import { Icon } from './ui'

const ICO = {
  live: { e: '📺', c: 'linear-gradient(135deg,#ef4444,#ec4899)' },
  space: { e: '🎙️', c: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  follow: { e: '❤️', c: 'linear-gradient(135deg,#ec4899,#f59e0b)' },
  support: { e: '💜', c: 'linear-gradient(135deg,#22c55e,#22d3ee)' },
  trend: { e: '🔥', c: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
}

export default function Notifications() {
  const { showNotifs, setShowNotifs, notifs, unread, markAllRead, nav } = useApp()
  if (!showNotifs) return null

  const go = (n) => {
    setShowNotifs(false)
    if (n.icon === 'live') nav('live')
    else if (n.icon === 'space') nav('spaces')
    else if (n.icon === 'trend') nav('ai')
    else if (n.icon === 'support') nav('creators')
  }

  return (
    <div className="notif-panel">
      <div className="notif-head">
        <span style={{ fontWeight: 800 }}>الإشعارات</span>
        {unread > 0 && <span className="pill grad">{unread} جديد</span>}
        <button className="btn sm ghost" style={{ marginRight: 'auto' }} onClick={markAllRead}>تحديد كمقروء</button>
      </div>
      <div>
        {notifs.map(n => (
          <div className={`notif-item ${n.unread ? 'unread' : ''}`} key={n.id} onClick={() => go(n)}>
            <div className="notif-ico" style={{ background: (ICO[n.icon] || ICO.live).c }}>{ICO[n.icon]?.e || '🔔'}</div>
            <div className="grow">
              <div className="notif-text">{n.text}</div>
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
