import { useState } from 'react'
import { AI_STUDIO } from '../data'
import { Icon, Toast } from '../components/ui'
import { useApp } from '../context'

export default function AIStudio() {
  const { nav, addXp, notify } = useApp()
  const [tool, setTool] = useState('a1')
  const [topic, setTopic] = useState('الرياضة الإلكترونية')
  const [thinking, setThinking] = useState(false)
  const [output, setOutput] = useState('')
  const [toast, setToast] = useState(null)
  const templates = AI_STUDIO.templates

  const generate = () => {
    setThinking(true)
    setOutput('')
    notify('🔮 الذكاء يعمل...')
    setTimeout(() => {
      let res = AI_STUDIO.samples[tool] || ''
      if (tool === 'a1' || tool === 'a2' || tool === 'a6') {
        res = res.replace(/\[الموضوع\]/g, topic).replace(/\[المنتج\]/g, topic)
      }
      setOutput(res)
      setThinking(false)
      addXp(25, 'توليد ذكاء')
      notify('✅ اكتمل التوليد — +25 XP')
    }, 1200)
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">استوديو الذكاء الاصطناعي</h1>
        <p className="page-sub">أنشئ محتوى، اقترح بثوثاً، استخرج مقاطع، وكتبُ ردوداً — بالكامل بالذكاء</p>
      </div>

      <div className="grid-2">
        {/* Templates */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🧰 أدوات الذكاء</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {templates.map(t => (
              <div key={t.id} className={`stream-opt ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)}>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{t.prompt}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-1">
            <div className="muted" style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>أدخل الموضوع / المنتج</div>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="مثال: التقنية، السفر، الرياضة..."
              className="chat-input" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }}
            />
            <button className="btn primary block mt-1" onClick={generate} disabled={thinking}>
              {thinking ? <><Icon name="ai" size={16} /> يفكّر...</> : <><Icon name="sparkle" size={16} /> ولّد بالذكاء</>}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="card" style={{ padding: 20, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
          <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 800 }}>🖥️ الناتج</h3>
            {thinking && <span className="pill cyan" style={{ marginRight: 'auto' }}><span className="pulse" /> جارٍ التوليد</span>}
            {!thinking && output && <button className="pill soft" style={{ marginRight: 'auto' }} onClick={() => { navigator.clipboard?.writeText(output); notify('نُسخ الناتج إلى الحافظة 📋') }}>نسخ</button>}
          </div>
          {!output && !thinking && <div className="center grow" style={{ color: 'var(--muted)' }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 46 }}>🤖</div><p>اختر أداة ثم اضغط «ولّد» ليرى الذكاء اصطناعي إبداعه.</p></div></div>}
          {output && (
            <pre className="ai-output">{output}</pre>
          )}
          {output && (
            <div className="flex gap-sm mt-1" style={{ marginTop: 'auto', paddingTop: 14 }}>
              <button className="btn sm ghost" onClick={() => { nav('home'); notify('نُشر المحتوى في الموجز 💫') }}>نشر في الموجز</button>
              <button className="btn sm ghost" onClick={() => { nav('live'); notify('فُتح في البثّ 🎬') }}>استخدم في بثّ</button>
              <button className="btn sm primary" onClick={generate}>⟲ إعادة توليد</button>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
