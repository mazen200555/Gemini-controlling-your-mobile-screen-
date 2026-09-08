import { useState } from 'react'
import { useApp } from '../context'
import { Icon, Modal } from './ui'
import { SETTING_GROUPS, THEMES, ACCENTS } from '../settings'

const LABELS = {
  sm: 'صغير', md: 'وسط', lg: 'كبير', xl: 'ضخم',
  compact: 'مدمج', comfort: 'مريح', spacious: 'واسع',
  cairo: 'Cairo', ibm: 'IBM', system: 'نظام',
  rtl: 'يمين', ltr: 'يسار', ar: 'عربي', en: 'إنجليزي',
  locale: 'محلي', '24h': '24س', '12h': '12س',
  Auto: 'تلقائي', '1080p': '1080p', '720p': '720p', '480p': '480p',
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="set-seg">
      {options.map(o => (
        <button key={o} className={`set-seg-opt ${value === o ? 'on' : ''}`} onClick={() => onChange(o)}>
          {LABELS[o] || o}
        </button>
      ))}
    </div>
  )
}

function ThemePicker({ value, onChange }) {
  return (
    <div className="set-themes">
      {Object.entries(THEMES).map(([k, t]) => (
        <button key={k} className={`set-theme ${value === k ? 'on' : ''}`} onClick={() => onChange(k)} style={{ background: t.vars['--bg-2'] }}>
          <span style={{ color: t.vars['--text'] }}>{t.icon}</span>
          <div style={{ color: t.vars['--text'] }}>{t.label}</div>
        </button>
      ))}
    </div>
  )
}

function AccentPicker({ value, onChange }) {
  return (
    <div className="accents">
      {ACCENTS.map(a => (
        <button key={a.id} className={`accent ${value === a.id ? 'on' : ''}`} onClick={() => onChange(a.id)}
          style={{ background: `linear-gradient(135deg, ${a.violet}, ${a.pink})` }} title={a.label}>
          {value === a.id && '✓'}
        </button>
      ))}
    </div>
  )
}

function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'switch':
      return (
        <button className={`set-switch ${value ? 'on' : ''}`} onClick={() => onChange(!value)}>
          <span className="set-switch-knob" /> {value ? 'تشغيل' : 'إيقاف'}
        </button>
      )
    case 'segmented': return <Segmented options={field.options} value={value} onChange={onChange} />
    case 'theme': return <ThemePicker value={value} onChange={onChange} />
    case 'accent': return <AccentPicker value={value} onChange={onChange} />
    case 'density':
      return (
        <Segmented options={['compact', 'comfort', 'spacious']} value={value} onChange={onChange} />
      )
    default: return null
  }
}

export default function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, settings, setSetting, resetSettings, notify } = useApp()
  const [group, setGroup] = useState('appearance')
  if (!settingsOpen) return null

  const currentGroup = SETTING_GROUPS.find(g => g.id === group)

  const change = (key, value) => {
    setSetting(key, value)
    notify('📦 تم تحديث الإعدادات وحُفظت تلقائياً')
  }

  return (
    <Modal open onClose={() => setSettingsOpen(false)} width="min(760px, 96vw)">
      <div className="set-wrap">
        {/* sidebar of groups */}
        <aside className="set-nav">
          <div className="set-nav-head">الإعدادات</div>
          {SETTING_GROUPS.map(g => (
            <button key={g.id} className={`set-nav-item ${group === g.id ? 'on' : ''}`} onClick={() => setGroup(g.id)}>
              <span>{g.icon}</span>{g.title}
            </button>
          ))}
          <button className="set-reset" onClick={() => { resetSettings(); notify('↺ استُعيدت الإعدادات الافتراضية') }}>↺ استعادة الافتراضي</button>
          <div className="set-live">كل التغييرات تُطبَّق لحظياً</div>
        </aside>

        {/* fields */}
        <div className="set-content">
          <div className="set-head">
            <h2 style={{ fontWeight: 900, fontSize: 20 }}>{currentGroup.icon} {currentGroup.title}</h2>
            <button className="modal-close" onClick={() => setSettingsOpen(false)}><Icon name="close" size={14} /></button>
          </div>
          <p className="muted" style={{ marginBottom: 14, fontSize: 13 }}>خصّص تجربتك لتكون مريحة لأطول جلسات. تُحفظ تلقائياً على جهازك.</p>

          {currentGroup.fields.map(f => {
            const val = settings[f.key]
            return (
              <div className="set-row" key={f.key}>
                <div className="grow">
                  <div style={{ fontWeight: 700 }}>{f.label}</div>
                  {f.hint && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{f.hint}</div>}
                </div>
                <Field field={f} value={val} onChange={(v) => change(f.key, v)} />
              </div>
            )
          })}

          {/* live preview clock/tip */}
          <div className="set-tip">💡 تحبّ التخصيص؟ جرّب «دافئ (عناية بالعين)» + «تقليل الحركة» لقراءة أطول دون إجهاد.</div>
        </div>
      </div>
    </Modal>
  )
}
