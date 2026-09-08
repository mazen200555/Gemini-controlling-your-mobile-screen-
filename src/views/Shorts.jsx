import { useState, useEffect } from 'react'
import { CLIPS, userById } from '../data'
import { Icon, Avatar, fmtNum } from '../components/ui'
import { useApp } from '../context'

export default function Shorts() {
  const { nav, openProfile, addXp, notify } = useApp()
  const [idx, setIdx] = useState(0)
  const [liked, setLiked] = useState({})
  const clip = CLIPS[idx]
  const author = userById(clip.src)
  const likes = clip.likes + (liked[clip.id] ? 1 : 0)

  const like = (e) => {
    e.stopPropagation()
    setLiked(l => ({ ...l, [clip.id]: !l[clip.id] }))
    if (!liked[clip.id]) addXp(8, 'إعجاب بمقطع')
  }

  const next = () => { setIdx(i => (i + 1) % CLIPS.length); }
  const prev = () => { setIdx(i => (i - 1 + CLIPS.length) % CLIPS.length); }

  const share = () => {
    nav('live', {})
    notify('تم نشر المقطع في البثّ المباشر 🎬')
    setIdx(i => (i + 1) % CLIPS.length)
  }

  const gradAudio = 'linear-gradient(135deg, #22d3ee, #8b5cf6, #ec4899)'

  return (
    <div className="fade-in">
      <div className="page-head flex" style={{ alignItems: 'center' }}>
        <div className="grow">
          <h1 className="page-title">المقاطع القصيرة</h1>
          <p className="page-sub">لقطات بثّ مقتطعة بالذكاء الاصطناعي · شغّل بالاسفل للتجربة</p>
        </div>
        <span className="pill grad">🎬 وضع الإيقاع</span>
      </div>

      <div className="flex" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Reels player */}
        <div className="card" style={{ width: 'min(340px, 100%)', overflow: 'hidden', position: 'relative', border: 'none', padding: 0 }}>
          <div className="reels-stage" onClick={next} style={{ background: `radial-gradient(circle at 50% 20%, hsl(${clip.vivid * 60 + 180},80%,45%), #000 75%)` }}>
            <div className="reels-num">{idx + 1} / {CLIPS.length}</div>
            <div className="reels-emoji">🎬</div>
            <div className="reels-title">{clip.title}</div>
            <div className="reels-length">{clip.length}</div>
            <div className="reels-slides" style={{ width: `${(idx + 1) % (clip.vivid + 3)}%`, background: gradAudio }} />
          </div>
          <div className="reels-controls">
            <button className="control" onClick={prev}>◀</button>
            <button className="control" onClick={next}>▶</button>
            <button className="control" onClick={share}>↗</button>
            <span className="pill soft" style={{ marginRight: 'auto' }}>auto-play</span>
          </div>
        </div>

        {/* Right: info + actions */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <div className="card" style={{ padding: 18, marginBottom: 16 }}>
            <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
              <Avatar user={author} size="lg" noClick />
              <div className="grow">
                <div style={{ fontWeight: 800 }}>{author.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>@{author.handle}</div>
                <span className="pill soft" style={{ marginTop: 6 }}>🎬 انشأه الذكاء الاصطناعي</span>
              </div>
              <button className="btn sm primary" onClick={() => openProfile(clip.src)}>متابعة</button>
            </div>
            <div className="mt-1" style={{ fontSize: 15, lineHeight: 1.7 }}>{clip.title}</div>
            <div className="post-actions" style={{ marginTop: 16 }}>
              <span className={`post-action ${liked[clip.id] ? 'liked' : ''}`} onClick={like}><Icon name="heart" size={18} /> {fmtNum(likes)}</span>
              <span className="post-action" onClick={share}><Icon name="share" size={18} /> منشور</span>
              <span className="post-action"><Icon name="comment" size={18} /> {fmtNum(clip.comments)}</span>
              <span className="post-action"><Icon name="up" size={18} /> حفظ</span>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>كيف صنع NEXA هذا المقطع؟</h3>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              <span className="pill cyan">🧠 ذكاء اصطناعي حلّل البثّ</span>
              <span className="pill violet">✂️ عزل اللقطات الأقوى</span>
              <span className="pill green">⚡ يشغّل الآن</span>
            </div>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>ستقوم الخوارزمية بتحليل الحوار ولغة الجسد والتفاعل الحي لاستخراج أقوى 30 ثانية، ثم أقترحها لك لنشرها فوراً في المنصة.</p>
            <button className="btn primary block mt-1" onClick={() => { addXp(20, 'AI clip'); notify('حصلت على +20 XP من مقطع AI 🎬') }}>ولّد مقطع جديد بالذكاء 🤖</button>
          </div>
        </div>
      </div>

      {/* Clip list */}
      <h3 className="page-sub" style={{ fontSize: 18, fontWeight: 800, margin: '26px 0 14px' }}>كل المقاطع</h3>
      <div className="strip">
        {CLIPS.map((c, i) => {
          const u = userById(c.src)
          return (
            <div className="live-card" key={c.id} style={{ minWidth: 200, width: 200 }} onClick={() => setIdx(i)}>
              <div className="live-thumb" style={{ background: `radial-gradient(circle at 50% 30%, hsl(${c.vivid * 60 + 180},80%,45%), #000 80%)` }}>
                <div className="cover-icon" style={{ fontSize: 36 }}>🎬</div>
                <span className="viewers-badge"><Icon name="eye" size={11} /> {fmtNum(c.views)}</span>
              </div>
              <div className="live-body">
                <div className="live-title" style={{ fontSize: 13 }}>{c.title}</div>
                <div className="flex" style={{ alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <Avatar user={u} size="sm" noClick />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>{u.name}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
