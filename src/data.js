// =============================================================
// NEXA  —  Rich mock data layer (Arabic-first, RTL platform)
// =============================================================

// Helpers -----------------------------------------------------------------
let uid = 0
const id = () => String(++uid)

// Palette of avatar gradients for generated avatars
export const AVATAR_PALETTES = [
  ['#7c3aed', '#ec4899'],
  ['#06b6d4', '#3b82f6'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#22d3ee'],
  ['#8b5cf6', '#f472b6'],
  ['#f97316', '#eab308'],
  ['#3b82f6', '#8b5cf6'],
  ['#ec4899', '#f59e0b'],
]

export const avatarGradient = (n = 0) => {
  const p = AVATAR_PALETTES[n % AVATAR_PALETTES.length]
  return `linear-gradient(135deg, ${p[0]}, ${p[1]})`
}

// Deterministic pseudo-random from a seed string (for stable vibe/color)
export const hash = (s = '') => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export const toArabic = (n) => {
  const s = Number(n).toLocaleString('ar-EG')
  return s
}

// ---- USERS ---------------------------------------------------------------
export const USERS = [
  { id: 'u1', name: 'ليلى السالم', handle: 'LailaMakes', tagline: 'صانعة محتوى تقني 💜 أراجع أحدث التقنيات ورحلات بينك', followers: 128400, isLive: false, isVerified: true, color: 0 },
  { id: 'u2', name: 'يوسف العتيبي', handle: 'YusufGaming', tagline: 'بثّ ألعاب 24/7 — صانع محتوى محترف 🎮', followers: 891200, isLive: true, isVerified: true, color: 1 },
  { id: 'u3', name: 'نور الحارثي', handle: 'NoorDream', tagline: 'بودكاست ومساحات صوتية عن الإبداع والأحلام 🌙', followers: 45200, isLive: false, isVerified: false, color: 2 },
  { id: 'u4', name: 'عبدالله ممدوح', handle: 'AbdullahKick', tagline: 'لاعب محترف + بثّ مباشر ديني ⚽', followers: 340100, isLive: true, isVerified: true, color: 3 },
  { id: 'u5', name: 'سارة المطيري', handle: 'SarahTech', tagline: 'مطوّرة واجتماعية، أشرح البرمجة ببساطة 💻', followers: 67300, isLive: false, isVerified: true, color: 4 },
  { id: 'u6', name: 'طارق الزهراني', handle: 'TariqVibes', tagline: 'فنان وموسيقي، مساحات مزامير كل ليلة 🎶', followers: 90800, isLive: false, isVerified: true, color: 5 },
  { id: 'u7', name: 'هند الغامدي', handle: 'HindVlogs', tagline: 'مدوّنة رحلات ومنغّمة 🧳', followers: 152300, isLive: true, isVerified: true, color: 6 },
  { id: 'u8', name: 'ريان الشهري', handle: 'RayanArt', tagline: 'مبدع رقمي ورسم بثّ مباشر 🎨', followers: 28500, isLive: false, isVerified: false, color: 7 },
  { id: 'u9', name: 'مجد', handle: 'MajdPod', tagline: 'صوت مجتمع الصمّ | أداة لغة إشارة', followers: 41000, isLive: true, isVerified: true, color: 0 },
  { id: 'u10', name: 'كلوديا', handle: 'ClaudiaGaming', tagline: 'لاعبة بطولات، بثّ كل مساء 🔥', followers: 210300, isLive: true, isVerified: true, color: 1 },
  { id: 'u11', name: 'جو', handle: 'JoStreams', tagline: 'فنون العيش وأسلوب الحياة ✨', followers: 39900, isLive: false, isVerified: false, color: 2 },
  { id: 'you', name: 'أنا (تجربة)', handle: 'GuestExplorer', tagline: 'أستكشف NEXA', followers: 12, isLive: false, isVerified: false, color: 0 },
]

export const userById = (id) => USERS.find(u => u.id === id) || USERS[0]

// ---- LIVE STREAMS ----------------------------------------------------------
export const STREAMS = [
  {
    id: 's1', host: 'u2', title: 'تحدّي الإصدار الجديد 🔥 | تصفّح كامل + تفاعل مباشر',
    category: 'ألعاب', tags: ['Fortnite', 'أتحداك', 'تفاعل'],
    viewers: 48213, likes: 213490, isLive: true, quality: '1080p60', thumbnailCover: 1, startedAt: 'منذ 3 ساعات',
    description: 'بثّ شيّق كامل بتصميم عالي الجودة مع تفاعل مباشر وكلمات السر والجوائز.',
  },
  {
    id: 's2', host: 'u7', title: 'جولة على شواطئ المالديف 🏝️ | لماذا يجب أن تزورها؟',
    category: 'رحلات', tags: ['مالديف', 'سفر', 'تجربة'],
    viewers: 12087, likes: 78200, isLive: true, quality: '4K', thumbnailCover: 2, startedAt: 'منذ 50 دقيقة',
    description: 'جولة بثّ فيديو 4K لشواطئ المالديف، نصائح حصرية عن تكاليف السفر.',
  },
  {
    id: 's3', host: 'u10', title: 'بطولة الإقليم الصيفية | الجمهور يقود الفريق 💪',
    category: 'رياضة إلكترونية', tags: ['بطولة', 'eSports', 'Jury'],
    viewers: 30102, likes: 120400, isLive: true, quality: '1080p60', thumbnailCover: 3, startedAt: 'منذ 1 ساعة',
    description: 'جمهور NEXA يتحكم في اختيارات الفريق عبر التصويت المباشر.',
  },
  {
    id: 's4', host: 'u4', title: 'أهم 10 مباريات للأسبوع | تحليل مباشر مع الجمهور',
    category: 'رياضة', tags: ['كرة', 'تحليل', 'مباشر'],
    viewers: 22014, likes: 66800, isLive: true, quality: '1080p', thumbnailCover: 4, startedAt: 'منذ 2 ساعة',
    description: 'تحليل أسبوعي بالتعاون مع الجمهور، استطلاعات صوتية وتوقعات المباريات.',
  },
  {
    id: 's5', host: 'u9', title: 'مساء المعرفة | تحدث بالكلام مع لغة الإشارة',
    category: 'تعليم', tags: ['إشارة', 'تعليم', 'مجتمع'],
    viewers: 6120, likes: 21000, isLive: true, quality: '720p', thumbnailCover: 5, startedAt: 'منذ 40 دقيقة',
    description: 'جلسة تفاعلية هادفة للتعليم بلغة الإشارة لتوسيع الوعي المجتمعي.',
  },
]

// ---- FEED / POSTS (X-like) ------------------------------------------------
export const FEED = [
  {
    id: 'p1', author: 'u5', time: '5 د', text: 'تعلمت اليوم معالجة البيانات في JS في 30 دقيقة، خططت سهل ما تتوقعه! 💻\nشاركو الخبرة، سويو السؤال؟', likes: 4320, reposts: 1280, replies: 320, comments: [
      { id: id(), author: 'u8', time: '2 د', text: 'خطوة على الطريق! هل تشرحين دالة Map؟', likes: 40 },
      { id: id(), author: 'u3', time: '1 د', text: 'محتوى يشرح ببساطة 👏', likes: 12 },
    ], media: 'chart', mediaLabel: 'خوارزمية الذكاء + بيانات',
  },
  {
    id: 'p2', author: 'u1', time: '12 د', text: 'كشفت عن تجربة لطيفة: NEXA تدعم الآن المتحدثين بصوت واضح في المساحات 🎙️✨', likes: 9840, reposts: 2100, replies: 480, comments: [
      { id: id(), author: 'u7', time: '4 د', text: 'رائع! متى أجرّب؟', likes: 30 },
    ], media: 'space', mediaLabel: 'مساحة صوتية مباشرة',
  },
  {
    id: 'p3', author: 'u6', time: '26 د', text: 'ليلة جميلة مع أصدقائي في المساحة الصوتية، استمتعنا بالعزف والغناء 🎶 أدعوكم للجلسة القادمة!', likes: 12700, reposts: 3900, replies: 710, comments: [
      { id: id(), author: 'u2', time: '10 د', text: 'لطيف! متى بالضبط؟', likes: 55 },
    ], media: 'wave', mediaLabel: 'جلسة صوتية',
  },
  {
    id: 'p4', author: 'u4', time: '1 س', text: 'نظّمنا مسابقة دينية مع صانعي المحتوى، والجمهور ركّز على اللعب النظيف. Check my live now ⚽', likes: 5620, reposts: 1200, replies: 210, comments: [], media: 'live', mediaLabel: 'مباشر الآن',
  },
]

// ---- SPACES / VOICE ROOMS ---------------------------------------------------
export const SPACES = [
  {
    id: 'sp1', owner: 'u3', title: 'مسائية الإبداع 🌙 | كيف تحوّل شغفك إلى مشروع؟',
    description: 'جلسة عصف ذهني بين صانعي المحتوى لتحويل الشغف إلى مشروع حقيقي.',
    status: 'live', listeners: 3421, scheduled: null,
    speakers: [
      { id: 'u3', role: 'مضيف', speaking: true, order: 1 },
      { id: 'u6', role: 'متحدث', speaking: true, order: 2 },
      { id: 'u8', role: 'متحدث', speaking: false, order: 3 },
      { id: 'u11', role: 'متحدث', speaking: true, order: 4 },
      { id: 'u5', role: 'متحدث', speaking: false, order: 5 },
    ],
    topics: ['إبداع', 'مشاريع', 'تجربة'],
  },
  {
    id: 'sp2', owner: 'u6', title: 'همسات الجيتار 🎸 | أمسية موسيقية هادئة',
    description: 'عزف حيّ وتحدّث حول الموسيقى والأحاسيس مع الجمهور.',
    status: 'live', listeners: 1890, scheduled: null,
    speakers: [
      { id: 'u6', role: 'مضيف', speaking: true, order: 1 },
      { id: 'u1', role: 'متحدث', speaking: false, order: 2 },
      { id: 'u9', role: 'متحدث', speaking: true, order: 3 },
    ],
    topics: ['موسيقى', 'إحساس', 'جلسة'],
  },
  {
    id: 'sp3', owner: 'u2', title: 'لعبة السؤال | مع صانعي محتوى الألعاب 🎮',
    description: 'مسابقة أسئلة سريعة بين صنّاع المحتوى مع الجمهور.',
    status: 'scheduled', listeners: 0, scheduled: 'الليلة 9:30 م',
    speakers: [
      { id: 'u2', role: 'مضيف', speaking: false, order: 1 },
      { id: 'u10', role: 'متحدث', speaking: false, order: 2 },
      { id: 'u4', role: 'متحدث', speaking: false, order: 3 },
    ],
    topics: ['ألعاب', 'مسابقة', 'تفاعل'],
  },
  {
    id: 'sp4', owner: 'u1', title: 'مواهب صناعة المحتوى | دعم وتمويل 💰',
    description: 'فتح حوار حول خطة دعم صانعي المحتوى من NEXA والمشاركة المجتمعية.',
    status: 'scheduled', listeners: 0, scheduled: 'غداً 8:00 م',
    speakers: [
      { id: 'u1', role: 'مضيف', speaking: false, order: 1 },
      { id: 'u5', role: 'متحدث', speaking: false, order: 2 },
    ],
    topics: ['دعم', 'اقتصاد', 'محتوى'],
  },
]

// ---- CREATOR MONETIZATION (support platform) ---------------------------------
export const CREATOR_SUPPORT = {
  tiers: [
    { id: 't1', name: 'مشجّع', price: 5, per: 'شهرياً', perks: ['شارات في البث', 'مجتمع خاص', 'وصول مبكر'], popular: false, color: 0 },
    { id: 't2', name: 'مميز', price: 15, per: 'شهرياً', perks: ['كل ما سبق', 'بثّ حصري أسبوعي', 'لغة صوتية خاصة'], popular: true, color: 1 },
    { id: 't3', name: 'داعم ذهبي', price: 45, per: 'شهرياً', perks: ['كل ما سبق', 'جلسة صوتية 1:1', 'اختيار المواضيع'], popular: false, color: 2 },
  ],
  recentSupporters: [
    { id: 'sup1', name: 'عمر النجار', amount: 150, tier: 'داعم ذهبي', message: 'استمر! أنت ألهمتني لأبدأ.', time: 'قبل 10 د', color: 0 },
    { id: 'sup2', name: 'ريم القحطاني', amount: 50, tier: 'مميز', message: 'أحلى بثّ لهذا الشهر 🔥', time: 'قبل 1 س', color: 3 },
    { id: 'sup3', name: 'سلطان الشمري', amount: 20, tier: 'مشجّع', message: 'صليت لأستفيد منك.', time: 'قبل 3 س', color: 5 },
  ],
  goals: [
    { label: 'هدف الشهر', current: 1640, target: 2400, unit: 'ريال' },
    { label: 'إجمالي المتابعين', current: 128400, target: 150000, unit: '' },
  ],
  stats: [
    { label: 'متابعين جدد خلال 30 يوم', value: 12840, delta: '+18%' },
    { label: 'متوسط مشاهدة البث', value: 8140, delta: '+9%' },
    { label: 'دعم إجمالي هذا الشهر', value: 1640, delta: '+31%', cur: 'ريال' },
  ],
}

// ---- AD CAMPAIGNS (companies) -------------------------------------------------
export const AD_CAMPAIGNS = {
  budget: 125000,
  active: 8,
  reach: 2410000,
  conversion: 4.6,
  spent: 87300,
  campaigns: [
    { id: 'ad1', brand: 'TechGulf', name: 'إطلاق هاتف NX-9 برو', type: 'بثّ تفاعلي', budget: 45000, spent: 31200, reach: 840000, engag: 3.8, ctr: 3.1, status: 'نشط', color: 0 },
    { id: 'ad2', brand: 'CoffeeNation', name: 'مشروب الطاقة الجديد', type: 'مساحة صوتية', budget: 25000, spent: 14000, reach: 310000, engag: 5.2, ctr: 4.4, status: 'نشط', color: 1 },
    { id: 'ad3', brand: 'SprintMart', name: 'عروض الجمعة الذهبية', type: 'تسويق بالعمولة', budget: 30000, spent: 22100, reach: 620000, engag: 2.9, ctr: 2.2, status: 'متوقف', color: 2 },
    { id: 'ad4', brand: 'MusicForge', name: 'حزم الميكروفونات', type: 'إعلان صانعي', budget: 15000, spent: 9000, reach: 210000, engag: 4.1, ctr: 3.6, status: 'نشط', color: 3 },
  ],
  audiences: [
    { id: 'a1', name: 'لاعبون ورياضات إلكترونية', size: 3200000 },
    { id: 'a2', name: 'محبّو التقنية والأدوات', size: 1800000 },
    { id: 'a3', name: 'مهتمّون بالرحلات والأسلوب', size: 940000 },
    { id: 'a4', name: 'موسيقيون وصنّاع محتوى', size: 720000 },
  ]
}

// ---- AI INSIGHTS -------------------------------------------------------------
export const AI_INSIGHTS = {
  trendScore: 87,
  sparkline: [22, 28, 25, 34, 38, 36, 44, 52, 49, 58, 65, 61, 72, 79, 76, 87],
  hotTopics: [
    { label: 'منشأ Cyberpunk 2026', growth: '+240%', heat: 96 }, 
    { label: 'تجارب VOICE SPACES', growth: '+180%', heat: 90 },
    { label: 'تقنية العزل الصوتي', growth: '+150%', heat: 85 },
    { label: 'تحدي مُعلّمي الألعاب', growth: '+120%', heat: 79 },
  ],
  recommendations: [
    { id: 'r1', title: 'قناة يوسف للبثّ المباشر', reason: 'بسبب إعجابك بقناة كلوديا', by: 'u2', match: 94 },
    { id: 'r2', title: 'مساحة الإبداع الصوتي', reason: 'مواضيعك المفضلة تتضمن موسيقى', by: 'u3', match: 91 },
    { id: 'r3', title: 'سارة تشرح البايثون للمبتدئين', reason: 'اهتمامك بلغة Python', by: 'u5', match: 88 },
    { id: 'r4', title: 'جولة ريان رسم جماعي', reason: 'تفاعلت مع الرسم قبل يومين', by: 'u8', match: 85 },
  ],
  engagement: [
    { label: 'منفّذات', value: 78 },
    { label: 'مشاهدة', value: 64 },
    { label: 'نقرات', value: 52 },
    { label: 'تفاعل', value: 71 },
  ],
  sentiment: [
    { label: 'إيجابي', value: 68, color: '#22c55e' },
    { label: 'محايد', value: 22, color: '#eab308' },
    { label: 'سلبي', value: 10, color: '#ef4444' },
  ],
}

// ---- NOTIFICATIONS -------------------------------------------------------------
export const NOTIFICATIONS = [
  { id: 'n1', icon: 'live', text: 'يوسف بدأ بثّاً مباشراً الآن', time: 'الآن', unread: true },
  { id: 'n2', icon: 'space', text: 'مسائية الإبداع تبدأ خلال دقائق', time: 'منذ 2 د', unread: true },
  { id: 'n3', icon: 'follow', text: 'سارة بدأت تتبعك', time: 'منذ 1 س', unread: false },
  { id: 'n4', icon: 'support', text: 'عمر دعمك بمبلغ 150 ريال 💜', time: 'منذ 1 س', unread: false },
  { id: 'n5', icon: 'trend', text: 'موضوع "المساحات" ينتشر الآن', time: 'منذ 2 س', unread: false },
]

// ---- LIVE CHAT SEED --------------------------------------------------------------
export const CHAT_SEED = [
  { id: id(), author: 'u8', text: 'أول مرة أدخل البثّ! مرحباً 👋' },
  { id: id(), author: 'u3', text: 'اللقطة الأخيرة عجيبة 😂' },
  { id: id(), author: 'u11', text: 'مدح على الجودة 💯' },
  { id: id(), author: 'u5', text: 'هل يمكن تزويد كود تقديم؟' },
  { id: id(), author: 'u6', text: 'تفاحة 🍎🍎' },
]

// messages that get pumped in to simulate live chat
export const CHAT_POOL = [
  { author: 'u8', text: 'قفل الفريق في البطولة! 🔥' },
  { author: 'u11', text: 'هذا شي يخلي البثّ إدماني 😅' },
  { author: 'u3', text: 'استمروا، نحن معكم 💜' },
  { author: 'u5', text: 'كيف أسوي حساب في NEXA؟' },
  { author: 'u6', text: 'اللحن حلو، أرسلوا التفاعل 🎧' },
  { author: 'u7', text: 'جولة مالديف تستاهل 5 نجوم' },
  { author: 'u2', text: 'تحدّي التصويت الآن! 🗳️' },
  { author: 'u9', text: 'الجميع يدرس من هذا المحتوى' },
  { author: 'u4', text: 'تحليل اليوم دقيق جداً' },
  { author: 'u1', text: 'بثّ جديد لليلة عظيمة' },
  { author: 'u8', text: 'OMG 😱 احتاج هذا المنتج' },
  { author: 'u10', text: 'المرآة الأولى لهذا المشروع' },
]

// =============================================================
// NEXA —  Extended "heavy" feature data
// =============================================================

// ---- GAMIFICATION / XP ---------------------------------------
export const XP_LEVELS = [
  { level: 1, name: 'مبتدئ', xp: 0, icon: '🌱' },
  { level: 2, name: 'نشيط', xp: 200, icon: '⚡' },
  { level: 3, name: 'محترف', xp: 600, icon: '🔥' },
  { level: 4, name: 'نجم', xp: 1500, icon: '⭐' },
  { level: 5, name: 'أسطورة', xp: 3200, icon: '👑' },
  { level: 6, name: 'وسيم المنصة', xp: 6000, icon: '💎' },
  { level: 7, name: 'شيخ NEXA', xp: 12000, icon: '🏆' },
]
export const initialXp = 1640
export const initialStreak = 9

export const WALLET = {
  balance: 520, coins: 1240, gems: 8,
  transactions: [
    { id: 'w1', label: 'هدية ✈️ صاروخ إلى يوسف', amount: -50, time: 'الآن', kind: 'spend' },
    { id: 'w2', label: 'مكافأة مشاهدة البثّ', amount: +24, time: 'قبل 1 س', kind: 'earn' },
    { id: 'w3', label: 'دعم من عمر', amount: +150, time: 'قبل 3 س', kind: 'earn' },
    { id: 'w4', label: 'شراء قهوة بَحّة', amount: -12, time: 'قبل 5 س', kind: 'spend' },
    { id: 'w5', label: 'تحويل نجاح إلى محفظة', amount: +300, time: 'أمس', kind: 'earn' },
  ],
}

// ---- CLIPS / SHORTS (vertical reels) -------------------------
export const CLIPS = [
  { id: 'c1', src: 'u2', title: 'أعظم تعليق على اللقطة الأخيرة 😂', views: 892000, likes: 64000, comments: 2100, length: '0:32', vivid: 1 },
  { id: 'c2', src: 'u7', title: 'أجمل لحظة من جولة المالديف 🏝️', views: 410000, likes: 38000, comments: 900, length: '0:58', vivid: 2 },
  { id: 'c3', src: 'u10', title: 'هدف خارق من الزاوية البعيدة 🎯', views: 1300000, likes: 210000, comments: 4800, length: '0:21', vivid: 3 },
  { id: 'c4', src: 'u6', title: 'جلسة عزف على الجيتار — الجزء الأول 🎸', views: 220000, likes: 41000, comments: 700, length: '1:12', vivid: 4 },
  { id: 'c5', src: 'u1', title: 'أفضل 3 هواتف لعام 2026 📱', views: 540000, likes: 27000, comments: 1500, length: '0:44', vivid: 0 },
  { id: 'c6', src: 'u8', title: 'رسم فني مباشر بإطار زمني ⏱️', views: 130000, likes: 21000, comments: 300, length: '0:39', vivid: 5 },
]

// ---- TOURNAMENTS (live competitions) ---------------------------
export const TOURNAMENTS = [
  {
    id: 't1', name: 'بطولة NEXA للرياضات الإلكترونية', game: 'قنوات', prize: 500000, players: 128, status: 'live', start: 'الآن',
    region: 'الشرق الأوسط', streamId: 's3',
    bracket: [
      { id: 'b1', a: 'يوسف', b: 'كلوديا', aScore: 2, bScore: 0, winner: 'a' },
      { id: 'b2', a: 'عبدالله', b: 'طارق', aScore: 1, bScore: 2, winner: 'b' },
      { id: 'b3', a: 'سارة', b: 'ريان', aScore: 3, bScore: 2, winner: 'a' },
      { id: 'b4', a: 'نور', b: 'هند', aScore: 0, bScore: 0, winner: null },
    ],
    topPlayers: [
      { id: 'u2', name: 'يوسف', score: 98, streak: 12 },
      { id: 'u10', name: 'كلوديا', score: 91, streak: 8 },
      { id: 'u4', name: 'عبدالله', score: 87, streak: 6 },
      { id: 'u6', name: 'طارق', score: 84, streak: 5 },
    ],
  },
  {
    id: 't2', name: 'تحدي صانعي المحتوى', game: 'إبداع', prize: 120000, players: 64, status: 'upcoming', start: 'غداً 8م',
    region: 'عالمي',
    bracket: [],
    topPlayers: [
      { id: 'u1', name: 'ليلى', score: 95, streak: 14 },
      { id: 'u5', name: 'سارة', score: 90, streak: 9 },
      { id: 'u7', name: 'هند', score: 88, streak: 7 },
    ],
  },
]

// ---- ANALYTICS (creator + brand) ------------------------------
export const ANALYTICS = {
  daily: [
    { day: 'السبت', views: 1200, watch: 52000, subs: 40, revenue: 320 },
    { day: 'الأحد', views: 1500, watch: 61000, subs: 52, revenue: 390 },
    { day: 'الاثنين', views: 1100, watch: 48000, subs: 35, revenue: 290 },
    { day: 'الثلاثاء', views: 1800, watch: 78000, subs: 64, revenue: 480 },
    { day: 'الأربعاء', views: 1600, watch: 70000, subs: 58, revenue: 420 },
    { day: 'الخميس', views: 2400, watch: 112000, subs: 92, revenue: 690 },
    { day: 'الجمعة', views: 3100, watch: 145000, subs: 120, revenue: 860 },
  ],
  hours: { '12-2': 400, '2-4': 620, '4-6': 880, '6-8': 1300, '8-10': 1850, '10-12': 2100, '12-2am': 900 },
  regions: [
    { label: 'السعودية', value: 44, color: '#22c55e' },
    { label: 'مصر', value: 22, color: '#22d3ee' },
    { label: 'الإمارات', value: 16, color: '#8b5cf6' },
    { label: 'العراق', value: 10, color: '#f59e0b' },
    { label: 'أخرى', value: 8, color: '#ec4899' },
  ],
  retention: [
    { label: 'أول 5 دقائق', value: 78 },
    { label: '15 دقيقة', value: 62 },
    { label: '30 دقيقة', value: 48 },
    { label: '60 دقيقة', value: 34 },
    { label: '90 دقيقة', value: 22 },
  ],
  funnel: [
    { label: 'وصلوا للبثّ', v: 100 },
    { label: 'شاهدوا +1 دقيقة', v: 74 },
    { label: 'تفاعلوا', v: 51 },
    { label: 'تابعوا', v: 33 },
    { label: 'دعموا', v: 12 },
  ],
}

// ---- SHOP (creator + digital goods) ----------------------------
export const SHOP_ITEMS = [
  { id: 'sh1', name: 'قهوة بَحّة لصانعك المفضل', price: 12, kind: 'رفع', emoji: '☕', color: '#a16207' },
  { id: 'sh2', name: 'عطر "إشراقة" حصري', price: 45, kind: 'منتج', emoji: '🧴', color: '#db2777' },
  { id: 'sh3', name: 'قسيمة نسخة بثّ مُوقّعة', price: 30, kind: 'رقمي', emoji: '✍️', color: '#2563eb' },
  { id: 'sh4', name: 'شارة مساحات ذهبية', price: 25, kind: 'مستوى', emoji: '🥇', color: '#ca8a04' },
  { id: 'sh5', name: 'لوحة مفاتيح RGB', price: 120, kind: 'منتج', emoji: '⌨️', color: '#7c3aed' },
  { id: 'sh6', name: 'خطّة تجربة AI Pro', price: 99, kind: 'اشتراك', emoji: '🤖', color: '#0891b2' },
]

// ---- AI STUDIO ------------------------------------------------
export const AI_STUDIO = {
  templates: [
    { id: 'a1', name: 'كتابة منشور جذّاب', prompt: 'أنشئ منشوراً يحفّز التفاعل عن [الموضوع]', icon: '✍️' },
    { id: 'a2', name: 'اقتراح موضوع بثّ', prompt: 'اقترح 5 مواضيع بثّ مباشر رائجة عن [الموضوع]', icon: '📺' },
    { id: 'a3', name: 'إيجاد أفضل مقطع (Clip)', prompt: 'حلّل بثّي واقترح أفضل اللقطات لتكون مقاطع', icon: '🎬' },
    { id: 'a4', name: 'توليد ردود ذكية', prompt: 'اكتب ردوداً ودودة على تعليقات الجمهور', icon: '💬' },
    { id: 'a5', name: 'مساعد بثّ تفاعلي', prompt: 'شغّل مساعد يعلّق ويتفاعل تلقائياً في البثّ', icon: '🛰️' },
    { id: 'a6', name: 'عناوين إعلانية', prompt: 'ولّد 5 عناوين إعلانية لعلامة [المنتج]', icon: '📣' },
  ],
  // "generated" outputs used to simulate AI runtime
  samples: {
    'a1': '🚀 3 أشياء غيرت طريقة استهلاكي للمحتوى هذا العام…\n1️⃣ أداة العزل الصوتي\n2️⃣ مساحات NEXA\n3️⃣ شحن الطاقة مع المجتمع\nفما الشيء الذي غيّر تجربتك؟ شاركني بالتعليق 👇',
    'a2': '1. "ألعب أفضل 10 ألعاب هذا الأسبوع"\n2. "جلسة أسئلة وأجوبة مفتوحة مع الجمهور"\n3. "أصنع محتوى من أفكار متابعي" \n4. "أكشف عن أدواتي الحقيقية في البثّ"\n5. "تحدّي 24 ساعة مع المجتمع"',
    'a3': '🎬 اقتراحات أفضل المقاطع:\n• اللحظة 12:40 — تعليق الجمهور الأكثر تسلية\n• اللحظة 25:10 — هدف خارق\n• اللحظة 41:30 — ردّ مدهش من يوسف\nزرClip جاهز للنشر الآن.',
    'a4': '💬 اقتراحات ردود ودودة:\n• "ما شاء الله! فخور بانضمامك للبثّ 🎉"\n• "سؤال رائع — سأناقشه في أول 5 دقائق"\n• "شكراً لكلماتك الداعمة، أنتم مجتمع مذهل 💜"',
    'a5': '🛰️ مساعد البثّ يعمل الآن:\n• يتابع الدردشة ويعلّق تلقائياً\n• يلتقط الأسئلة المتكررة\n• يطابق الذكاء الاصطناعي اهتمامات الجمهور',
    'a6': '📣 عناوين إعلانية مقترحة:\n1. "عِش هاتفك بسرعة جديدة — NX-9"\n2. "أكثر من مجرد هاتف، إنها تجربة"\n3. "لا تفوّت الليلة — عرض حصري لمشتركي NEXA"',
  },
}

// ---- BADGES / ACHIEVEMENTS ------------------------------------
export const BADGES = [
  { id: 'g1', name: 'سيّد البثّ', icon: '📺', desc: 'شاهد 100 ساعة', done: true },
  { id: 'g2', name: 'قلب المجتمع', icon: '💜', desc: 'ادعم 5 صانعين', done: true },
  { id: 'g3', name: 'نجم المساحات', icon: '🎙️', desc: 'ادخل 20 مساحة', done: false },
  { id: 'g4', name: 'مولّد محتوى AI', icon: '🤖', desc: 'ولّد 10 أفكار بالذكاء', done: true },
  { id: 'g5', name: 'مُشغّل البطولات', icon: '🏆', desc: 'شارك في بطولة', done: false },
  { id: 'g6', name: 'بطل المقتطف', icon: '🎬', desc: 'انشر 5 مقاطع', done: false },
]

// ---- MULTI-VIEW scene notes (derived from STREAMS) ------------
export const MULTIVIEW_LAYOUTS = [
  { id: '2x2', name: 'شبكة 2×2', cols: 2 },
  { id: '3x1', name: 'ثلاث أفقية', cols: 3 },
  { id: '4x1', name: 'أربع أفقية', cols: 4 },
]
