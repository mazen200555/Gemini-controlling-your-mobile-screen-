import { useState } from 'react'
import { useApp } from '../context'
import { Icon, Modal } from './ui'

const TYPES = [
  { id: 'game', e: '🎮', name: 'بثّ ألعاب', desc: 'شارك شاشتك وألعب مع الجمهور' },
  { id: 'talk', e: '🎙️', name: 'بثّ نقاش', desc: 'تحدّث مباشرة مع متابعيك' },
  { id: 'music', e: '🎶', name: 'بثّ موسيقي', desc: 'بثّ جلسة أو حفلة صوتية' },
  { id: 'irl', e: '🌍', name: 'بثّ عام', desc: 'وثّق يومك وأي شئ آخر' },
]

export default function GoLive() {
  const { goLiveOpen, setGoLiveOpen, nav, notify } = useApp()
  const [type, setType] = useState('game')
  const [title, setTitle] = useState('')
  if (!goLiveOpen) return null

  const start = () => {
    setGoLiveOpen(false)
    notify(`بدأت بثّاً مباشراً «${TYPES.find(t => t.id === type).name}» 🔴`)
    nav('live')
  }

  return (
    <Modal open onClose={() => setGoLiveOpen(false)} width="min(520px, 92vw)">
      <div className="modal-head">
        <div className="brand-logo" style={{ width: 34, height: 34, fontSize: 16 }}>✴</div>
        <span style={{ fontWeight: 800, fontSize: 16 }}>ابدأ بثّاً مباشراً</span>
        <button className="modal-close" onClick={() => setGoLiveOpen(false)}><Icon name="close" size={14} /></button>
      </div>
      <div style={{ padding: 20 }}>
        <div className="muted" style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>اختر نوع البثّ</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TYPES.map(t => (
            <div key={t.id} className={`stream-opt ${type === t.id ? 'active' : ''}`} onClick={() => setType(t.id)}>
              <span style={{ fontSize: 26 }}>{t.e}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{t.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1">
          <div className="muted" style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>عنوان البثّ</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="مثال: جلسة تفاعل مع المجتمع 🎉"
            className="chat-input" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }}
          />
        </div>
        <button className="btn primary block mt-2" onClick={start}>مرر جهاز البثّ 🔴</button>
      </div>
    </Modal>
  )
}
