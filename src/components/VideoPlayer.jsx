import { useEffect, useRef, useState, useCallback } from 'react'
import { hash } from '../data'
import { Icon } from './ui'

// A fully simulated live video player: a canvas engine renders a generated
// "broadcast" in real-time, with a working transport (play/pause/seek/volume),
// quality selector, fullscreen, picture-in-picture, subtitles and live-edge.

const DURATION = 10800 // 3h recorded buffer (seconds)
const QUALITIES = ['4K', '1080p60', '1080p', '720p', '480p', 'Auto']

function fmtTime(s) {
  s = Math.max(0, Math.floor(s || 0))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function VideoPlayer({ stream, host }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const posRef = useRef(DURATION - 40)   // start near live edge
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [quality, setQuality] = useState('Auto')
  const [buffering, setBuffering] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [position, setPosition] = useState(DURATION - 40)
  const [viewers, setViewers] = useState(stream.viewers)
  const [snapshot, setSnapshot] = useState(null)
  const [pip, setPip] = useState(false)
  const hideTimer = useRef(null)

  // --- real audio engine (Web Audio, synthesized per stream) ---
  const audioRef = useRef({ ctx: null, master: null, started: false, nodes: [] })
  const [soundOn, setSoundOn] = useState(true)

  // --- AI live commentary ---
  const [commentaryOn, setCommentaryOn] = useState(true)
  const [commentary, setCommentary] = useState('')
  const [commentMeta, setCommentMeta] = useState('')
  const [sentiment, setSentiment] = useState(72)

  const COMMENTARY = {
    games: [
      { t: 'لقطة رائعة من الزاوية! متابعة ممتعة 🔥', s: 'الجمهور متحمس' },
      { t: 'الذكاء يلتقط تصعيداً في التفاعل — توقّع موجة إعجاب', s: 'ارتفاع حاد' },
      { t: 'هذا هو اللاعب الأفضل في الجولة الأولى', s: 'تحليل أداء' },
      { t: 'لحظة حرجة! ننصح بالمتابعة حتى النهاية', s: 'ذروة البثّ' },
      { t: 'تعليقات الجمهور إيجابية جداً — شجّع على المزيد', s: 'تفاؤل 86%' },
    ],
    travel: [
      { t: 'منظر خلّاب! الجمهور يعيش اللحظة معك 🏝️', s: 'تفاعل عالٍ' },
      { t: 'الذكاء يقترح إضافة خريطة للمرحلة القادمة', s: 'نصيحة AI' },
      { t: 'أجواء هادئة — مثالية للاسترخاء والتأمل', s: 'مزاج هادئ' },
      { t: 'أسئلة كثيرة عن التكلفة — شارك التقديرات', s: 'طلب الجمهور' },
    ],
    default: [
      { t: 'مجتمع نشيط جداً في هذه اللحظة ⚡', s: 'حيوية عالية' },
      { t: 'الذكاء يوصي بتثبيت تعليق لتشجيع النقاش', s: 'نصيحة AI' },
      { t: 'لقطة لطيفة — أعد إنتاجها كمقطع قصير؟', s: 'اقتراح مقطع' },
      { t: 'ارتفاع في المشاهدين — أهلاً بالجمهور الجديد 👋', s: 'نمو لحظي' },
    ],
  }

  const seed = hash(stream.id)
  const theme = stream.category

  // Simulated broadcast engine (canvas) — deterministic per stream/seed
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      W = canvas.width = Math.max(320, rect?.width || 640) * (window.devicePixelRatio || 1) * 0.5
      H = canvas.height = Math.max(200, rect?.height || 360) * (window.devicePixelRatio || 1) * 0.5
    }
    resize()
    window.addEventListener('resize', resize)

    const rnd = (i) => {
      const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    const hue = seed % 360
    const parts = new Array(14).fill(0).map((_, i) => ({
      x: rnd(i) * 1, y: rnd(i + 50) * 1, r: 2 + rnd(i + 100) * 6,
      sp: 0.3 + rnd(i + 150) * 0.8, hue: (hue + i * 18) % 360,
    }))

    let running = true
    const draw = (tms) => {
      if (!running) return
      const t = (tms || 0) / 1000
      // background
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, `hsl(${hue},60%,8%)`)
      g.addColorStop(1, `hsl(${(hue + 90) % 360},55%,14%)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      // perspective grid (gaming vibe)
      ctx.strokeStyle = `hsla(${hue},90%,60%,0.18)`
      ctx.lineWidth = 1
      const cx = W / 2, cy = H / 2
      for (let i = 0; i < 14; i++) {
        const p = ((t * 0.15) + i / 14) % 1
        const r = p * Math.max(W, H)
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + t * 0.05
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a) * Math.max(W, H), cy + Math.sin(a) * Math.max(W, H))
        ctx.stroke()
      }

      // floating particles
      parts.forEach((p) => {
        p.x += (Math.sin(t * p.sp + p.r) * 0.002)
        p.y -= p.sp * 0.0012
        if (p.y < 0) { p.y = 1; p.x = Math.random() }
        const px = p.x * W, py = p.y * H
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},90%,65%,0.55)`
        ctx.shadowBlur = 12; ctx.shadowColor = `hsl(${p.hue},90%,60%)`
        ctx.fill(); ctx.shadowBlur = 0
      })

      // central "subject" — a glowing orb pulsing (the broadcaster/avatar action)
      const pulse = 1 + Math.sin(t * 3) * 0.08
      ctx.beginPath()
      ctx.arc(cx, cy, 40 * pulse, 0, Math.PI * 2)
      const sg = ctx.createRadialGradient(cx, cy, 4, cx, cy, 90 * pulse)
      sg.addColorStop(0, `hsla(${(hue + 140) % 360},95%,60%,0.95)`)
      sg.addColorStop(1, `hsla(${hue},90%,55%,0)`)
      ctx.fillStyle = sg; ctx.fill()

      // moving "reaction bars" across center (audio vibe)
      ctx.fillStyle = `hsla(${hue},90%,70%,0.5)`
      for (let i = 0; i < 24; i++) {
        const h = (Math.sin(t * 6 + i * 0.5) * 0.5 + 0.5) * (H * 0.5)
        ctx.fillRect(cx - 120 + i * 10, cy + 40, 5, h)
      }

      // scan light sweep
      const sx = ((t * 0.2) % (W + 200)) - 100
      const sg2 = ctx.createLinearGradient(sx - 60, 0, sx, H)
      sg2.addColorStop(0, 'rgba(255,255,255,0)')
      sg2.addColorStop(0.5, 'rgba(255,255,255,0.05)')
      sg2.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = sg2; ctx.fillRect(0, 0, W, H)

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { running = false; cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [seed, theme])

  // state machine: playing -> advance position; occasional buffering
  useEffect(() => {
    let id
    if (playing && !buffering) {
      id = setInterval(() => {
        setPosition(p => {
          const next = Math.min(DURATION, p + 1)
          posRef.current = next
          return next
        })
      }, 1000)
    }
    return () => clearInterval(id)
  }, [playing, buffering])

  // random buffering flicker while playing
  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => {
      if (Math.random() < 0.18) { setBuffering(true); setTimeout(() => setBuffering(false), 900 + Math.random() * 1200) }
    }, 6000)
    return () => clearInterval(iv)
  }, [playing])

  // live viewer ticker
  useEffect(() => {
    const iv = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 70 - 30)), 2000)
    return () => clearInterval(iv)
  }, [])

  // --- Build/resume the audio engine (must follow a user gesture) ---
  const ensureAudio = useCallback(() => {
    const A = audioRef.current
    if (!A.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      A.ctx = new AC()
      A.master = A.ctx.createGain()
      A.master.gain.value = muted ? 0 : volume
      A.master.connect(A.ctx.destination)
      // --- ambient "music" pad: 2 detuned oscillators + LFO ---
      const padOsc = A.ctx.createOscillator()
      padOsc.type = 'sawtooth'
      padOsc.frequency.value = 110 + (seed % 80)
      const padOsc2 = A.ctx.createOscillator()
      padOsc2.type = 'sine'
      padOsc2.frequency.value = (110 + (seed % 80)) * 1.5
      const lfo = A.ctx.createOscillator()
      lfo.frequency.value = 0.06 + (seed % 5) * 0.05
      const lfoGain = A.ctx.createGain()
      lfoGain.gain.value = 300
      const padFilter = A.ctx.createBiquadFilter()
      padFilter.type = 'lowpass'; padFilter.frequency.value = 900; padFilter.Q.value = 2
      const padGain = A.ctx.createGain(); padGain.gain.value = 0.14
      lfo.connect(lfoGain); lfoGain.connect(padOsc.frequency); lfoGain.connect(padOsc2.frequency)
      padOsc.connect(padFilter); padOsc2.connect(padFilter)
      padFilter.connect(padGain); padGain.connect(A.master)
      padOsc.start(); padOsc2.start(); lfo.start()
      // --- synthesized "crowd" noise (filtered white noise buffer) ---
      const len = A.ctx.sampleRate * 2
      const buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5
      const noise = A.ctx.createBufferSource()
      noise.buffer = buf; noise.loop = true
      const bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1000; bp.Q.value = 0.7
      const crowdGain = A.ctx.createGain(); crowdGain.gain.value = 0.03
      const lfo2 = A.ctx.createOscillator(); lfo2.frequency.value = 0.4
      const lfo2Gain = A.ctx.createGain(); lfo2Gain.gain.value = 0.02
      lfo2.connect(lfo2Gain); lfo2Gain.connect(crowdGain.gain)
      noise.connect(bp); bp.connect(crowdGain); crowdGain.connect(A.master)
      noise.start(); lfo2.start()
      A.nodes = [padOsc, padOsc2, lfo, noise, lfo2]
    }
    if (A.ctx.state === 'suspended') A.ctx.resume()
    A.started = true
  }, [muted, volume, seed])

  // suspend audio when paused
  useEffect(() => {
    const A = audioRef.current
    if (!A.ctx || !A.started) return
    if (playing && soundOn) A.ctx.resume()
    else A.ctx.suspend()
  }, [playing, soundOn])

  // --- AI commentary loop ---
  useEffect(() => {
    if (!commentaryOn || !playing) return
    const pool = COMMENTARY[theme === 'ألعاب' ? 'games' : theme === 'رحلات' ? 'travel' : 'default']
    const speak = () => setCommentary(pool[Math.floor(Math.random() * pool.length)])
    speak()
    const iv = setInterval(() => {
      speak()
      setSentiment(s => Math.min(98, Math.max(40, s + Math.floor(Math.random() * 14 - 7))))
    }, 6500)
    return () => clearInterval(iv)
  }, [commentaryOn, playing, theme])

  const showUIFn = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false) }, 2600)
  }, [playing])

  useEffect(() => { showUIFn() }, [showUIFn])

  const togglePlay = () => { ensureAudio(); setPlaying(p => !p) }
  const toggleMute = () => { ensureAudio(); setMuted(m => !m) }
  const setSoundToggle = () => { ensureAudio(); setSoundOn(s => !s) }
  const setVol = (v) => { ensureAudio(); setVolume(v); setMuted(false); if (audioRef.current.master) audioRef.current.master.gain.value = v }
  const seek = (val) => { setPosition(val); posRef.current = val; showUIFn() }
  const goLive = () => { setPosition(DURATION - 2); posRef.current = DURATION - 2; showUIFn() }
  const openSettings = (e) => { e.stopPropagation(); setSettingsOpen(o => !o) }
  const snap = () => {
    const c = canvasRef.current
    setSnapshot(c.toDataURL('image/png'))
    setTimeout(() => setSnapshot(null), 1800)
  }
  const togglePip = async () => {
    try {
      if (pip) { document.exitPictureInPicture?.(); setPip(false) }
      else if (canvasRef.current.requestPictureInPicture) { await canvasRef.current.requestPictureInPicture(); setPip(true) }
    } catch (e) { /* not supported */ }
  }
  const toggleFs = () => {
    const el = canvasRef.current
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  const atLiveEdge = position > DURATION - 10
  const brightness = quality === 'Auto' ? 1 : { '4K': 1.06, '1080p60': 1.02, '1080p': 1, '720p': 0.94, '480p': 0.88 }[quality] || 1
  const barPct = (position / DURATION) * 100

  return (
    <div
      className="vp"
      onMouseMove={showUIFn}
      onPointerDown={ensureAudio}
      onMouseLeave={() => playing && setShowControls(false)}
      style={{ filter: `brightness(${brightness})`, cursor: showControls ? 'default' : 'none' }}
    >
      <canvas ref={canvasRef} className="vp-canvas" onClick={() => { ensureAudio(); togglePlay(); showUIFn() }} />

      {/* overlays */}
      <div className="vp-top">
        <span className="pill live"><span className="pulse" /> LIVE</span>
        <span className="pill soft"><Icon name="user" size={12} /> {viewers.toLocaleString('en-US')}</span>
        <span className="pill soft">{quality === 'Auto' ? 'جودة' : quality}</span>
        {atLiveEdge
          ? <span className="pill live"><span className="pulse" /> مباشر</span>
          : <button className="pill cyan" onClick={goLive}>⟳ العودة للبثّ</button>}
      </div>

      {buffering && (
        <div className="vp-buffer"><div className="vp-spinner" /></div>
      )}

      {captions && (
        <div className="vp-caption">🔥 {stream.title} — {host.name} يبثّ الآن من {stream.category}</div>
      )}

      {commentaryOn && commentary && (
        <div className="vp-commentary">
          <span className="vp-ai-badge"><Icon name="sparkle" size={12} /> NEXA AI</span>
          <span className="vp-ai-text">{commentary.t}</span>
          <span className="vp-ai-meta">{commentary.s}</span>
        </div>
      )}

      {soundOn && (
        <span className="vp-sound-pill"><span className="pulse" /> 🎵 صوت حيّ</span>
      )}

      {snapshot && (
        <div className="vp-snapshot"><img src={snapshot} alt="لقطة" /> لقطة محفوظة 📸</div>
      )}

      {/* quality label flash */}
      {settingsOpen && (
        <div className="vp-settings" onClick={(e) => e.stopPropagation()}>
          <div className="vp-settings-title">جودة البثّ</div>
          {QUALITIES.map(q => (
            <button key={q} className={`vp-quality ${quality === q ? 'on' : ''}`} onClick={() => { setQuality(q); setSettingsOpen(false); showUIFn() }}>{q}</button>
          ))}
        </div>
      )}

      {/* controls */}
      <div className={`vp-controls ${showControls || !playing ? '' : 'hidden'}`} onClick={(e) => e.stopPropagation()}>
        <div className="vp-timeline" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          seek(pct * DURATION)
        }}>
          <div className="vp-timeline-fill" style={{ width: `${barPct}%` }} />
          <div className="vp-timeline-now" style={{ left: `${barPct}%` }} />
        </div>
        <div className="vp-buttons">
          <button className="vbtn" onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
          <button className="vbtn" onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
          <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
            className="vp-vol" onChange={(e) => setVol(+e.target.value)} />
          <span className="vp-time">{fmtTime(position)} / {fmtTime(0)} ({fmtTime(DURATION)} بثّ محفوظ)</span>
          <div className="vp-right">
            <button className={`vbtn ${soundOn ? '' : 'off'}`} onClick={setSoundToggle} title="الصوت الحيّ">{soundOn ? '🎵' : '🔕'}</button>
            <button className={`vbtn ${commentaryOn ? 'ai-on' : 'off'}`} onClick={() => setCommentaryOn(c => !c)} title="تعليق AI">
              <Icon name="ai" size={15} /> AI
            </button>
            <button className="vbtn" onClick={() => setCaptions(c => !c)} title="ترجمات">{captions ? 'CC' : 'CC'}</button>
            <button className="vbtn" onClick={openSettings} title="جودة">⚙️</button>
            <button className="vbtn" onClick={snap} title="لقطة">📸</button>
            <button className="vbtn" onClick={togglePip} title="صورة داخل صورة">{pip ? '▪️' : '📽️'}</button>
            <button className="vbtn" onClick={toggleFs} title="ملء الشاشة">⛶</button>
          </div>
        </div>
      </div>
    </div>
  )
}
