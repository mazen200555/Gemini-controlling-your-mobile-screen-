import { useState } from 'react'
import { useApp } from '../context'
import { userById, STREAMS, SPACES, CREATOR_SUPPORT } from '../data'
import { Icon, Avatar, Modal, FollowBtn, fmtNum } from './ui'

export default function ProfileModal() {
  const { profileId, closeProfile, nav, followed, toggleFollow } = useApp()
  const [tab, setTab] = useState('بثّ')
  if (!profileId) return null

  const u = userById(profileId)
  const isSelf = profileId === 'you'
  const streams = STREAMS.filter(s => s.host === profileId)
  const spaces = SPACES.filter(s => s.owner === profileId || s.speakers.some(p => p.id === profileId))
  const on = !!followed[profileId]
  const support = CREATOR_SUPPORT.tiers

  return (
    <Modal open onClose={closeProfile} width="min(620px, 94vw)">
      <div className="profile-hero">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
          <Avatar user={u} size="xl" noClick />
          <div className="grow">
            <div className="flex" style={{ alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>{u.name}</h2>
              {u.isVerified && <Icon name="verify" size={18} />}
            </div>
            <div className="muted">@{u.handle}</div>
            <p className="muted" style={{ marginTop: 6, fontSize: 13, maxWidth: 380 }}>{u.tagline}</p>
          </div>
          <button className="modal-close" onClick={closeProfile} title="إغلاق"><Icon name="close" size={14} /></button>
        </div>
        <div className="profile-actions">
          <div className="flex" style={{ alignItems: 'center', gap: 18 }}>
            <span style={{ fontWeight: 800 }}>{fmtNum(u.followers)} <span className="muted" style={{ fontWeight: 600, fontSize: 12 }}>متابع</span></span>
            <span style={{ fontWeight: 800 }}>{u.isLive ? <><span className="pill live"><span className="pulse" /> حيّ</span></> : 'غير متصل'}</span>
          </div>
          <div style={{ marginRight: 'auto' }}>
            {!isSelf && <FollowBtn userId={profileId} />}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        {['بثّ', 'مساحات', 'دعم'].map(t => (
          <div key={t} className={`profile-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {tab === 'بثّ' && (
        <div className="profile-sec">
          {streams.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 20 }}>لا بثّ حالي لهذا المستخدم</div>}
          {streams.map(s => (
            <div className="profile-row" key={s.id} onClick={() => { closeProfile(); nav('live', { streamId: s.id }) }}>
              <div className="badge-brand" style={{ background: 'var(--grad)' }}>📺</div>
              <div className="grow">
                <div style={{ fontWeight: 800, fontSize: 14 }}>{s.title}</div>
                <div className="muted" style={{ fontSize: 12 }}>{s.category} · {fmtNum(s.viewers)} يشاهدون</div>
              </div>
              <span className="pill live"><span className="pulse" /> حيّ</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'مساحات' && (
        <div className="profile-sec">
          {spaces.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 20 }}>لا مساحات مرتبطة</div>}
          {spaces.map(sp => (
            <div className="profile-row" key={sp.id} onClick={() => { closeProfile(); nav('spaces', { spaceId: sp.id }) }}>
              <div className="badge-brand" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>🎙️</div>
              <div className="grow">
                <div style={{ fontWeight: 800, fontSize: 14 }}>{sp.title}</div>
                <div className="muted" style={{ fontSize: 12 }}>{sp.status === 'live' ? `${fmtNum(sp.listeners)} يستمعون الآن` : `مجدولة ${sp.scheduled}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'دعم' && (
        <div className="profile-sec">
          <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>ادعم {u.name} عبر مستويات العضوية</div>
          {support.map(t => (
            <div className="profile-row" key={t.id}>
              <span style={{ fontSize: 22 }}>{['💌','⭐','👑'][support.indexOf(t)]}</span>
              <div className="grow">
                <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name} — {t.price} {t.per}</div>
                <div className="muted" style={{ fontSize: 12 }}>{t.perks.slice(0, 2).join(' · ')}</div>
              </div>
              <button className="btn sm primary" onClick={() => nav('creators')}>ادعم</button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
