import { avatarGradient, hash } from '../data'

export const Icon = ({ name, size = 20 }) => {
  const map = {
    home: '🏠', live: '📺', spaces: '🎙️', creators: '🌈', ads: '📣', ai: '🤖', trending: '📈',
    search: '🔍', bell: '🔔', mail: '✉️', bookmarks: '🔖', calendar: '📅', settings: '⚙️',
    plus: '➕', heart: '❤️', retweet: '🔁', comment: '💬', share: '🌐', send: '🚀',
    play: '▶️', pause: '⏸️', mic: '🎤', micOff: '🔇', waveform: '〰️', gift: '🎁',
    up: '👍', star: '⭐', list: '📋', user: '👤', money: '💰', chart: '📊', target: '🎯',
    shield: '🛡️', verify: '✔️', coins: '🪙', flame: '🔥', bolt: '⚡', sparkle: '✨',
  }
  return <span style={{ fontSize: size, lineHeight: 1, display: 'inline-flex' }}>{map[name] || '▪️'}</span>
}

// Monogram avatar renderer, deterministic gradient from seed
export const Avatar = ({ user, size = 'md', speaking = false, className = '' }) => {
  const grad = avatarGradient(user?.color ?? 0)
  const initials = (user?.name || '؟').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('')
  const style = {}
  return (
    <div className={`avatar ${size} ${speaking ? 'speaking-ring' : ''} ${className}`} style={{ background: grad, ...style }}>
      {initials}
    </div>
  )
}

export const LiveBadge = () => (
  <span className="pill live"><span className="pulse" /> حيّ الآن</span>
)

export const FollowBtn = () => {
  return <button className="btn sm ghost" style={{ padding: '5px 12px', minWidth: 78 }}>متابعة</button>
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

export function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'م'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'ك'
  return String(n)
}
