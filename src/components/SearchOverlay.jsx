import { useApp } from '../context'
import { Icon, Avatar, fmtNum } from './ui'
import { userById } from '../data'

export default function SearchOverlay() {
  const { showSearch, search, searchIndex, nav, openProfile, setShowSearch } = useApp()

  if (!showSearch) return null
  const r = searchIndex(search)
  const empty = !r.users.length && !r.streams.length && !r.spaces.length && !r.posts.length && !r.brands.length

  return (
    <div className="search-results" onClick={e => e.stopPropagation()}>
      <div className="sr-group">
        <div className="sr-title">المستخدمون</div>
        {r.users.length === 0 && <div className="sr-empty" style={{ padding: '12px 16px' }}>لا مستخدمين</div>}
        {r.users.map(u => (
          <div className="sr-item" key={u.id} onClick={() => { openProfile(u.id); setShowSearch(false) }}>
            <Avatar user={u} size="md" noClick />
            <div>
              <div className="sr-name">{u.name} {u.isVerified && <Icon name="verify" size={12} />}</div>
              <div className="sr-sub">@{u.handle} · {fmtNum(u.followers)} متابع</div>
            </div>
          </div>
        ))}
      </div>

      {r.streams.length > 0 && (
        <div className="sr-group" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="sr-title">بثّ مباشر</div>
          {r.streams.map(s => (
            <div className="sr-item" key={s.id} onClick={() => nav('live', { streamId: s.id })}>
              <div className="badge-brand" style={{ background: 'var(--grad)', fontSize: 14 }}>📺</div>
              <div>
                <div className="sr-name">{s.title}</div>
                <div className="sr-sub">{s.category} · {fmtNum(s.viewers)} يشاهد · {userById(s.host).name}</div>
              </div>
              <span className="pill live"><span className="pulse" /> حيّ</span>
            </div>
          ))}
        </div>
      )}

      {r.spaces.length > 0 && (
        <div className="sr-group" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="sr-title">مساحات صوتية</div>
          {r.spaces.map(sp => (
            <div className="sr-item" key={sp.id} onClick={() => nav('spaces', { spaceId: sp.id })}>
              <div className="badge-brand" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', fontSize: 14 }}>🎙️</div>
              <div>
                <div className="sr-name">{sp.title}</div>
                <div className="sr-sub">{sp.status === 'live' ? `${fmtNum(sp.listeners)} يستمعون الآن` : `مجدولة ${sp.scheduled}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {r.posts.length > 0 && (
        <div className="sr-group" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="sr-title">منشورات</div>
          {r.posts.map(p => (
            <div className="sr-item" key={p.id} onClick={() => nav('home')}>
              <div className="badge-brand" style={{ background: 'linear-gradient(135deg,#22d3ee,#8b5cf6)', fontSize: 14 }}>💬</div>
              <div>
                <div className="sr-name">{p.text.slice(0, 60)}{p.text.length > 60 ? '…' : ''}</div>
                <div className="sr-sub">@{userById(p.author).handle}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {r.brands.length > 0 && (
        <div className="sr-group" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="sr-title">علامات تجارية</div>
          {r.brands.map(b => (
            <div className="sr-item" key={b.id} onClick={() => nav('ads')}>
              <div className="badge-brand" style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', fontSize: 14 }}>📣</div>
              <div>
                <div className="sr-name">{b.name}</div>
                <div className="sr-sub">{b.brand} · حملة إعلانية</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {empty && search && (
        <div className="sr-empty">🔍 لا نتائج لـ «{search}» — جرّب "سارة" أو "ألعاب" أو "ملكي"</div>
      )}
      {!empty && (
        <div style={{ textAlign: 'center', padding: 10, fontSize: 11, color: 'var(--muted-2)', borderTop: '1px solid var(--border)' }}>
          اضغط على أي نتيجة للانتقال إليها · بحث متكامل عبر كل المنصة
        </div>
      )}
    </div>
  )
}
