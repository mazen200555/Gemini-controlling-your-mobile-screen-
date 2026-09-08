import { avatarGradient, hash } from '../data'
import { useApp } from '../context'

export const Icon = ({ name, size = 20 }) => {
  const map = {
    home: '🏠', live: '📺', spaces: '🎙️', creators: '🌈', ads: '📣', ai: '🤖', trending: '📈',
    search: '🔍', bell: '🔔', mail: '✉️', bookmarks: '🔖', calendar: '📅', settings: '⚙️',
    plus: '➕', heart: '❤️', retweet: '🔁', comment: '💬', share: '🌐', send: '🚀',
    play: '▶️', pause: '⏸️', mic: '🎤', micOff: '🔇', waveform: '〰️', gift: '🎁',
    up: '👍', star: '⭐', list: '📋', user: '👤', money: '💰', chart: '📊', target: '🎯',
    shield: '🛡️', verify: '✔️', coins: '🪙', flame: '🔥', bolt: '⚡', sparkle: '✨', close: '✖️', x: '✖️',
  }
  return <span style={{ fontSize: size, lineHeight: 1, display: 'inline-flex' }}>{map[name] || '▪️'}</span>
}

// Monogram avatar renderer, deterministic gradient from seed.
// Clicking anywhere opens the global profile (full-app integration).
export const Avatar = ({ user, size = 'md', speaking = false, className = '', noClick = false, onClick }) => {
  const { openProfile } = useApp()
  const grad = avatarGradient(user?.color ?? 0)
  const initials = (user?.name || '؟').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('')
  const handle = (e) => {
    if (e) e.stopPropagation()
    if (onClick) return onClick()
    if (!noClick && user) openProfile(user.id)
  }
  return (
    <div
      className={`avatar ${size} ${speaking ? 'speaking-ring' : ''} ${className}`}
      style={{ background: grad, cursor: noClick ? 'default' : 'pointer' }}
      role="button"
      onClick={handle}
      title={user?.name}
    >
      {initials}
    </div>
  )
}

// Interactive username row (avatar + name) that opens the profile.
export const Person = ({ user, size = 'md', sub, onClick, stopped }) => {
  const { openProfile } = useApp()
  return (
    <div className="flex" style={{ alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => openProfile(user?.id)}>
      <Avatar user={user} size={size} noClick />
      <div style={{ minWidth: 0 }}>
        <div className="flex" style={{ alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{user?.name}</span>
          {user?.isVerified && <Icon name="verify" size={12} />}
        </div>
        {sub && <div className="muted" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{sub}</div>}
      </div>
    </div>
  )
}

export const LiveBadge = () => (
  <span className="pill live"><span className="pulse" /> حيّ الآن</span>
)

export const FollowBtn = ({ userId }) => {
  const { followed, toggleFollow } = useApp()
  const on = followed[userId]
  return (
    <button className={`btn sm ${on ? 'ghost' : 'primary'}`} style={{ padding: '5px 12px', minWidth: 78 }} onClick={(e) => { e.stopPropagation(); toggleFollow(userId) }}>
      {on ? 'متابع ✓' : 'متابعة'}
    </button>
  )
}

export const Tabs = ({ items, active, onChange }) => (
  <div className="flex gap-sm" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
    {items.map(it => (
      <button key={it}
        className={`pill ${active === it ? 'grad' : 'soft'}`}
        onClick={() => onChange(it)}
        style={{ padding: '8px 16px', fontSize: 14 }}>
        {it}
      </button>
    ))}
  </div>
)

export const Progress = ({ value, color = 'var(--grad)', height = 8 }) => (
  <div className="bar" style={{ height }}>
    <div style={{ width: `${value}%`, background: color }} />
  </div>
)

export const Toast = ({ message }) => {
  if (!message) return null
  return <div className="toast"><span>✅</span>{message}</div>
}

export const Modal = ({ open, onClose, children, width = 'min(560px, 92vw)' }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ width }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'م'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'ك'
  return String(n)
}
