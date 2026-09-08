// =============================================================
// NEXA —  Rich settings engine: themes, accent, accessibility,
// density, player prefs, notifications, data, privacy & language.
// Applied live as CSS variables + body classes, persisted locally.
// =============================================================

export const THEMES = {
  dark: {
    label: 'ليلي', icon: '🌙', desc: 'الافتراضي، داكن مع لمسات نيون',
    vars: {
      '--bg': '#07070d', '--bg-2': '#0c0c16', '--bg-3': '#12121f',
      '--card': 'rgba(255,255,255,0.035)', '--card-solid': '#14141f',
      '--border': 'rgba(255,255,255,0.09)', '--border-strong': 'rgba(255,255,255,0.16)',
      '--text': '#f4f4fb', '--muted': '#9a97b0', '--muted-2': '#6b6886',
    },
  },
  midnight: {
    label: 'منتصف الليل', icon: '🌌', desc: 'أغمق وأهدأ، أقل تبايناً ليلاً',
    vars: {
      '--bg': '#04040a', '--bg-2': '#07070f', '--bg-3': '#0b0b16',
      '--card': 'rgba(255,255,255,0.028)', '--card-solid': '#0e0e18',
      '--border': 'rgba(255,255,255,0.07)', '--border-strong': 'rgba(255,255,255,0.12)',
      '--text': '#e6e6f2', '--muted': '#8886a0', '--muted-2': '#5c5a72',
    },
  },
  light: {
    label: 'نهاري', icon: '☀️', desc: 'فاتح واضح، مريح للقراءة نهاراً',
    vars: {
      '--bg': '#eef0f8', '--bg-2': '#ffffff', '--bg-3': '#e7eaf5',
      '--card': 'rgba(0,0,0,0.03)', '--card-solid': '#ffffff',
      '--border': 'rgba(0,0,0,0.09)', '--border-strong': 'rgba(0,0,0,0.16)',
      '--text': '#15151f', '--muted': '#5c5c78', '--muted-2': '#8b8ba6',
    },
  },
  amber: {
    label: 'دافئ (عناية بالعين)', icon: '🕯️', desc: 'يقلّل الضوء الأزرق، لون دافئ',
    vars: {
      '--bg': '#17110a', '--bg-2': '#1f1710', '--bg-3': '#2a1f14',
      '--card': 'rgba(255,235,200,0.05)', '--card-solid': '#221a12',
      '--border': 'rgba(255,235,200,0.1)', '--border-strong': 'rgba(255,235,200,0.18)',
      '--text': '#f4e7d4', '--muted': '#c8b39a', '--muted-2': '#9a8668',
    },
  },
}

export const ACCENTS = [
  { id: 'violet', label: 'بنفسجي', violet: '#8b5cf6', pink: '#ec4899' },
  { id: 'cyan', label: 'سماوي', violet: '#22d3ee', pink: '#3b82f6' },
  { id: 'emerald', label: 'زمردي', violet: '#10b981', pink: '#22d3ee' },
  { id: 'rose', label: 'وردي', violet: '#f472b6', pink: '#fb7185' },
  { id: 'amber', label: 'عسلي', violet: '#f59e0b', pink: '#ef4444' },
  { id: 'crimson', label: 'قرمزي', violet: '#ef4444', pink: '#8b5cf6' },
]

export const DEFAULT_SETTINGS = {
  // appearance
  theme: 'dark',
  themeMode: 'manual',          // manual | auto | scheduled
  themeSchedule: '#21:00-#07:00', // for scheduled: start-end 24h
  autoDark: 'midnight',         // which dark theme auto mode switches to at night
  autoLight: 'light',           // which light theme auto mode switches to by day
  accent: 'violet',
  density: 'comfort',          // compact | comfort | spacious
  textSize: 'md',              // sm | md | lg | xl
  fontStyle: 'cairo',          // cairo | ibm | system
  roundness: 'md',             // sm | md | lg
  reduceMotion: false,
  reduceGlare: false,
  highContrast: false,
  dimBackground: false,        // optional darker vignette

  // player & content
  defaultQuality: 'Auto',
  defaultVolume: 0.8,
  autoplay: true,
  chatTextSize: 'md',          // sm | md | lg
  compactChat: false,
  hideChatOnMobile: false,
  captionsDefault: true,

  // notifications & sound
  notifSound: false,
  livePulse: true,
  confirmActions: true,

  // accessibility
  captionsAlways: false,
  subtitlesStyle: 'default',   // default | boxed | outline

  // language & region
  language: 'ar',
  layoutDir: 'rtl',
  timeFormat: 'locale',        // locale | 24h | 12h

  // privacy & data
  showOnlineStatus: true,
  dataSaver: false,
  clearCache: false,

  // account sync / backup
  syncSettings: true,
  backupCode: '',               // opaque code to identify local account backup
}

// ---- persistence ----
const KEY = 'nexa.settings.v1'

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch (e) {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { /* ignore */ }
}

// ---- resolve effective theme (whatever the user picks in auto/scheduled) ----
function isNightAt(now) {
  const h = now.getHours()
  return h >= 19 || h < 6
}

export function resolveTheme(s, now = new Date()) {
  if (s.themeMode === 'auto') {
    return isNightAt(now) ? (s.autoDark || 'midnight') : (s.autoLight || 'light')
  }
  if (s.themeMode === 'scheduled') {
    // parse "#21:00-#07:00"
    const m = String(s.themeSchedule || '').match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
    if (m) {
      const start = (+m[1]) * 60 + (+m[2])
      const end = (+m[3]) * 60 + (+m[4])
      const cur = now.getHours() * 60 + now.getMinutes()
      const night = start <= end ? (cur >= start && cur < end) : (cur >= start || cur < end)
      return night ? (s.autoDark || 'midnight') : (s.autoLight || 'light')
    }
  }
  return s.theme || 'dark'
}

// ---- apply settings to the live document ----
export function applySettings(s, now = new Date()) {
  const eff = resolveTheme(s, now)
  const theme = THEMES[eff] || THEMES[s.theme] || THEMES.dark
  const root = document.documentElement
  const body = document.body

  // base palette from theme
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))

  // accent colors + gradients
  const acc = ACCENTS.find(a => a.id === s.accent) || ACCENTS[0]
  root.style.setProperty('--violet', acc.violet)
  root.style.setProperty('--pink', acc.pink)
  root.style.setProperty('--grad', `linear-gradient(135deg, ${acc.violet} 0%, ${acc.pink} 100%)`)
  root.style.setProperty('--grad-cool', `linear-gradient(135deg, ${eff === 'light' ? '#0ea5e9' : '#22d3ee'} 0%, ${acc.violet} 100%)`)
  root.style.setProperty('--grad-warm', `linear-gradient(135deg, ${eff === 'light' ? '#f59e0b' : '#f59e0b'} 0%, #ef4444 100%)`)

  // roundness
  const round = { sm: '10px', md: '18px', lg: '26px' }[s.roundness] || '18px'
  root.style.setProperty('--radius', round)
  root.style.setProperty('--radius-sm', { sm: '8px', md: '12px', lg: '16px' }[s.roundness] || '12px')

  // text size scale (root font)
  const fs = { sm: '14px', md: '16px', lg: '18px', xl: '20px' }[s.textSize] || '16px'
  root.style.fontSize = fs

  // global classes (based on the *resolved* theme)
  body.classList.remove('theme-light', 'theme-midnight', 'theme-amber')
  body.classList.add(eff === 'light' ? 'theme-light' : eff === 'midnight' ? 'theme-midnight' : eff === 'amber' ? 'theme-amber' : '')
  body.classList.toggle('density-compact', s.density === 'compact')
  body.classList.toggle('density-spacious', s.density === 'spacious')
  body.classList.toggle('reduce-motion', !!s.reduceMotion)
  body.classList.toggle('reduce-glare', !!s.reduceGlare)
  body.classList.toggle('high-contrast', !!s.highContrast)
  body.classList.toggle('dim-bg', !!s.dimBackground)
  body.classList.toggle('font-ibm', s.fontStyle === 'ibm')
  body.classList.toggle('font-system', s.fontStyle === 'system')
  body.classList.toggle('chat-sm', s.chatTextSize === 'sm')
  body.classList.toggle('chat-lg', s.chatTextSize === 'lg')
  body.classList.toggle('chat-compact', !!s.compactChat)
  body.classList.toggle('subtitles-outline', s.subtitlesStyle === 'outline')
  body.classList.toggle('subtitles-boxed', s.subtitlesStyle === 'boxed')

  // direction (RTL/LTR)
  const dir = s.layoutDir === 'ltr' ? 'ltr' : 'rtl'
  if (dir !== document.documentElement.getAttribute('dir')) {
    document.documentElement.setAttribute('dir', dir)
  }
}

// ---- field groups for the settings panel ----
export const SETTING_GROUPS = [
  {
    id: 'appearance', title: 'المظهر', icon: '🎨',
    fields: [
      { key: 'theme', type: 'theme', label: 'سمة اللون', hint: 'غيّر المزاج العام والتباين' },
      { key: 'themeMode', type: 'segmented', label: 'وضع السمة', options: ['manual', 'auto', 'scheduled'], hint: 'يدوي، تلقائي حسب الوقت، أو بجدول مخصّص' },
      { key: 'themeSchedule', type: 'schedule', label: 'جدول السمة (من-إلى)', hint: 'مثال: 21:00-07:00 يعني ليلاً' },
      { key: 'autoDark', type: 'theme', label: 'سمة الليل التلقائية', hint: 'تظهر تلقائياً في وضع auto/scheduled' },
      { key: 'autoLight', type: 'theme', label: 'سمة النهار التلقائية', hint: 'تظهر نهاراً في وضع auto/scheduled' },
      { key: 'accent', type: 'accent', label: 'اللون المميّز', hint: 'يُطعّم الأزرار والروابط والتدرّجات' },
      { key: 'density', type: 'density', label: 'كثافة الواجهة', hint: 'كم المساحات بين العناصر' },
      { key: 'textSize', type: 'segmented', label: 'حجم الخط', options: ['sm', 'md', 'lg', 'xl'], hint: 'كبّر لقراءة أريح' },
      { key: 'roundness', type: 'segmented', label: 'استدارة الزوايا', options: ['sm', 'md', 'lg'] },
      { key: 'fontStyle', type: 'segmented', label: 'نوع الخط', options: ['cairo', 'ibm', 'system'] },
    ],
  },
  {
    id: 'comfort', title: 'الراحة والعناية', icon: '🌿',
    fields: [
      { key: 'reduceMotion', type: 'switch', label: 'تقليل الحركة', hint: 'يخفّف الرسوم المتحركة لراحة أكبر' },
      { key: 'reduceGlare', type: 'switch', label: 'تقليل الوهج', hint: 'يقلّل التوهّجات النيون والظلال' },
      { key: 'highContrast', type: 'switch', label: 'تباين عالٍ', hint: 'يُقوّي الحدود والنصوص للوضوح' },
      { key: 'dimBackground', type: 'switch', label: 'تعتيم الخلفية', hint: 'خلفية أغمق حول المحتوى' },
    ],
  },
  {
    id: 'player', title: 'المشغّل والمحتوى', icon: '▶️',
    fields: [
      { key: 'defaultQuality', type: 'segmented', label: 'الجودة الافتراضية', options: ['Auto', '1080p', '720p', '480p'] },
      { key: 'autoplay', type: 'switch', label: 'تشغيل تلقائي', hint: 'ابدأ البثّ فوراً عند فتحه' },
      { key: 'captionsDefault', type: 'switch', label: 'ترجمات افتراضية' },
      { key: 'chatTextSize', type: 'segmented', label: 'حجم نص الدردشة', options: ['sm', 'md', 'lg'] },
      { key: 'compactChat', type: 'switch', label: 'دردشة مدمجة', hint: 'رسائل أقل ارتفاعاً' },
      { key: 'hideChatOnMobile', type: 'switch', label: 'إخفاء الدردشة جوالاً' },
    ],
  },
  {
    id: 'notifications', title: 'الإشعارات والصوت', icon: '🔔',
    fields: [
      { key: 'notifSound', type: 'switch', label: 'صوت الإشعارات', hint: 'نغمة خفيفة عند وصول إشعار' },
      { key: 'livePulse', type: 'switch', label: 'نبضة البثّ الحيّ', hint: 'مؤشّر LIVE النابض' },
      { key: 'confirmActions', type: 'switch', label: 'تأكيد الإجراءات', hint: 'نافذة تأكيد قبل الإجراءات الحسّاسة' },
      { key: 'language', type: 'segmented', label: 'اللغة', options: ['ar', 'en'], hint: 'واجهة عربية أو إنجليزية' },
      { key: 'layoutDir', type: 'segmented', label: 'اتجاه الواجهة', options: ['rtl', 'ltr'] },
      { key: 'timeFormat', type: 'segmented', label: 'صيغة الوقت', options: ['locale', '24h', '12h'] },
    ],
  },
  {
    id: 'privacy', title: 'الخصوصية والبيانات', icon: '🛡️',
    fields: [
      { key: 'showOnlineStatus', type: 'switch', label: 'إظهار حالة الاتصال', hint: 'ليعرف الآخرون أنك متصل' },
      { key: 'captionsAlways', type: 'switch', label: 'ترجمات دائمة' },
      { key: 'dataSaver', type: 'switch', label: 'وضع توفير البيانات', hint: 'يخفض جودة الصور والتحميل' },
    ],
  },
  {
    id: 'sync', title: 'المزامنة والنسخ الاحتياطي', icon: '☁️',
    fields: [
      { key: 'syncSettings', type: 'switch', label: 'مزامنة الإعدادات مع حسابك', hint: 'تحفظ تفضيلاتك عبر الأجهزة والجلسات' },
      { key: 'backupCode', type: 'code', label: 'رمز النسخ الاحتياطي', hint: 'شاركه لاستعادة تفضيلاتك على جهاز آخر' },
    ],
  },
]
