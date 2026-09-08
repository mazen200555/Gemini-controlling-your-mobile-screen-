// Lightweight SVG/CSS chart primitives (no external deps)

export const LineChart = ({ series, labels = [], height = 160, color = 'var(--pink)', width = 100 }) => {
  const max = Math.max(...series, 1)
  const min = Math.min(...series)
  const stepX = width / (series.length - 1)
  const pts = series.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / (max - min || 1)) * (height - 20) - 8
    return [x, y]
  })
  const line = pts.map(p => p.join(',')).join(' ')
  const area = `0,${height} ${line} ${width},${height}`
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`lg-${color.replace(/\W/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lg-${color.replace(/\W/g, '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} />)}
    </svg>
  )
}

export const DonutChart = ({ data = [], size = 150, thickness = 18, centerLabel, centerSub }) => {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const gap = 2 // px between segments
  let offset = 0
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = (d.value / total) * c
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={d.color} strokeWidth={thickness}
              strokeDasharray={`${Math.max(0, len - gap)} ${c - len + gap}`}
              strokeDashoffset={-offset + c / 4} />
          )
          offset += len
          return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{centerLabel}</div>
          {centerSub && <div className="muted" style={{ fontSize: 11 }}>{centerSub}</div>}
        </div>
      </div>
    </div>
  )
}

export const BarChart = ({ data = [], height = 150, color = 'var(--grad)' }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height, width: '100%' }}>
      {data.map((d, i) => (
        <div key={d.label || i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="muted" style={{ fontSize: 11 }}>{d.value}</span>
          <div title={d.label} style={{ width: '100%', borderRadius: '6px 6px 0 0', background: color, height: `${(d.value / max) * (height - 40)}px`, minHeight: 6 }} />
          <span className="muted" style={{ fontSize: 10 }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export const HorizontalBars = ({ data = [], color = 'var(--violet)' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {data.map((d, i) => (
      <div key={d.label || i}>
        <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
          <span style={{ fontWeight: 700 }}>{d.label}</span>
          <span className="muted">{d.value}</span>
        </div>
        <div className="bar"><div style={{ width: `${Math.min(100, typeof d.value === 'number' && d.value <= 100 ? d.value : d.value)}%`, background: Array.isArray(color) ? color[i % color.length] : color }} /></div>
      </div>
    ))}
  </div>
)
