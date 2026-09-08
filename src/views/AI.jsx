import { useState } from 'react'
import { AI_INSIGHTS, userById } from '../data'
import { Icon, Avatar, Progress, Toast } from '../components/ui'
import { useApp } from '../context'

export default function AI() {
  const { nav } = useApp()
  const [toast, setToast] = useState(null)
  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const { trendScore, sparkline, hotTopics, recommendations, engagement, sentiment } = AI_INSIGHTS

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">محرّك الذكاء الاصطناعي</h1>
        <p className="page-sub">يحلّل اهتماماتك ويبدّي محتوى يليق بك · يزيد تفاعلك بنسبة تصل إلى 3.2×</p>
      </div>

      {/* AI Hero */}
      <div className="ai-hero">
        <div className="flex" style={{ alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'var(--grad)', display: 'grid', placeItems: 'center', boxShadow: '0 0 60px rgba(236,72,153,.5)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40 }}>🤖</div>
            </div>
          </div>
          <div className="grow">
            <h2 style={{ fontSize: 23, fontWeight: 900 }}>ذكاء NEXA — توقّع المزاج</h2>
            <p className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>
              خوارزمية متقدمة تتعلّم من تفاعلك: المشاهدات، الإعجابات، الوقت داخل البثّ، والمساحات التي تنضمّ إليها، ثم تُخصّص الموجز لك في الوقت الفعلي.
            </p>
            <div className="flex gap-sm mt-1" style={{ flexWrap: 'wrap' }}>
              <span className="pill green">✓ تعلّم عميق</span>
              <span className="pill cyan">✓ تخصيص لحظي</span>
              <span className="pill violet">✓ رفع التفاعل +3.2×</span>
            </div>
          </div>
          <div className="center" style={{ flexDirection: 'column' }}>
            <div style={{ fontSize: 44, fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{trendScore}%</div>
            <div className="muted" style={{ fontSize: 12 }}>درجة اهتمامك الفورية</div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="sparkline">
          {sparkline.map((v, i) => (
            <span key={i} style={{ height: `${(v / 90) * 100}%`, opacity: 0.45 + (i / sparkline.length) * 0.55 }} />
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Recommendations */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>موصى به لك خصّيصاً</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {recommendations.map(r => {
              const cu = userById(r.by)
              return (
                <div className="rec-card" key={r.id} style={{ position: 'relative' }} onClick={() => nav('live', { streamId: 's2' })}>
                  <span className="pill grad match">{r.match}% مطابقة</span>
                  <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
                    <Avatar user={cu} size="md" />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{r.title}</div>
                      <div className="muted" style={{ fontSize: 11 }}>بواسطة {cu.name}</div>
                    </div>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>💡 {r.reason}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Analytics */}
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 19, marginBottom: 14 }}>رصد سلوكك &amp; تفاعلك</h3>
          <div className="card" style={{ padding: 18, marginBottom: 16 }}>
            {engagement.map(e => (
              <div key={e.label} style={{ marginBottom: 14 }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{e.label}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{e.value}%</span>
                </div>
                <Progress value={e.value} />
              </div>
            ))}
          </div>

          {/* Sentiment */}
          <div className="card" style={{ padding: 18 }}>
            <h4 style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>توجّه الجمهور في موجزك</h4>
            {sentiment.map(s => (
              <div key={s.label} className="flex" style={{ alignItems: 'center', marginBottom: 10 }}>
                <div className="grow">
                  <div className="flex" style={{ justifyContent: 'space-between', fontSize: 13 }}>
                    <span>{s.label}</span><span>{s.value}%</span>
                  </div>
                  <Progress value={s.value} color={s.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot topics */}
      <div className="card mt-2" style={{ padding: 20 }}>
        <div className="flex" style={{ alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontWeight: 800, fontSize: 19 }}>🔥 المواضيع الرائجة لحظة بلحظة</h3>
          <span className="pill live" style={{ marginRight: 'auto' }}><span className="pulse" /> مباشر</span>
        </div>
        {hotTopics.map(t => (
          <div className="topic-row" key={t.label}>
            <span style={{ fontWeight: 800, minWidth: 180 }}>{t.label}</span>
            <div className="topic-heat grow">
              <div className="bar"><div style={{ width: `${t.heat}%`, background: `linear-gradient(90deg, ${t.heat > 90 ? '#ef4444' : '#f59e0b'}, #ec4899)` }} /></div>
            </div>
            <span style={{ fontWeight: 800, width: 70, textAlign: 'left', color: 'var(--green)' }}>{t.growth}</span>
          </div>
        ))}
      </div>

      <Toast message={toast} />
    </div>
  )
}
