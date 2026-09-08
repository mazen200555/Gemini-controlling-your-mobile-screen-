import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { NOTIFICATIONS as NOTIF_SEED, STREAMS, SPACES, USERS, FEED, userById, XP_LEVELS, initialXp, initialStreak, WALLET, CURRENCIES, EXCHANGE_TICKS, WITHDRAW_METHODS, CONVERSION_HISTORY } from './data'
import { loadSettings, saveSettings, applySettings, DEFAULT_SETTINGS } from './settings'

const Ctx = createContext(null)

export function useApp() {
  return useContext(Ctx)
}

export function AppProvider({ children }) {
  const [page, setPage] = useState('home')
  const [navTarget, setNavTarget] = useState(null)         // { streamId?, spaceId? }
  const [profileId, setProfileId] = useState(null)          // open profile modal
  const [notifs, setNotifs] = useState(NOTIF_SEED)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)      // results dropdown
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [followed, setFollowed] = useState({})              // userId -> bool
  const [goLiveOpen, setGoLiveOpen] = useState(false)
  const [xp, setXp] = useState(initialXp)
  const [streak, setStreak] = useState(initialStreak)
  const [wallet, setWallet] = useState(WALLET.balance)
  const [balances, setBalances] = useState({ USD: 1250, SAR: 2400, USDT: 160, EUR: 90, AED: 140 })
  const [conversionHistory, setConversionHistory] = useState(CONVERSION_HISTORY)
  const [withdrawHistory, setWithdrawHistory] = useState([])

  // ---- rich settings (persisted + live-applied) ----
  const [settings, setSettingsState] = useState(() => loadSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const setSetting = useCallback((key, value) => {
    setSettingsState(prev => {
      const next = { ...prev, [key]: value }
      saveSettings(next)
      applySettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettingsState(() => {
      saveSettings(DEFAULT_SETTINGS)
      applySettings(DEFAULT_SETTINGS)
      return { ...DEFAULT_SETTINGS }
    })
  }, [])

  // apply once on mount
  useEffect(() => { applySettings(settings) }, [])

  const notify = useCallback((m) => {
    setToast(m)
    clearTimeout(notify._t)
    notify._t = setTimeout(() => setToast(null), 2300)
    // optional soft chime when sound is enabled
    if (settingsRef.current?.notifSound) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext
        if (AC) {
          const ctx = notify._ac || (notify._ac = new AC())
          if (ctx.state === 'suspended') ctx.resume()
          const o = ctx.createOscillator(), g = ctx.createGain()
          o.type = 'sine'; o.frequency.value = 880
          g.gain.setValueAtTime(0.001, ctx.currentTime)
          g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02)
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
          o.connect(g); g.connect(ctx.destination)
          o.start(); o.stop(ctx.currentTime + 0.36)
        }
      } catch (e) { /* ignore */ }
    }
  }, [])

  // navigate with optional target (stream/space/profile) for cross-linking
  const nav = useCallback((p, opts = {}) => {
    setPage(p)
    setNavTarget(opts)
    if (opts?.profile) setProfileId(opts.profile)
    if (opts?.spaceId) setNavTarget({ spaceId: opts.spaceId })
    if (opts?.streamId) setNavTarget({ streamId: opts.streamId })
    setShowSearch(false)
    setShowNotifs(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const openProfile = useCallback((id) => setProfileId(id), [])
  const closeProfile = useCallback(() => setProfileId(null), [])

  const markAllRead = useCallback(() => {
    setNotifs(n => n.map(x => ({ ...x, unread: false })))
    notify('تم تحديد الكل كمقروء ✅')
  }, [notify])

  const toggleFollow = useCallback((id) => {
    setFollowed(f => {
      const next = { ...f, [id]: !f[id] }
      const u = userById(id)
      const on = next[id]
      if (on) {
        notify(`تابعت ${u.name} 💜`)
        setNotifs(n => [{ id: 'fl' + Date.now(), icon: 'follow', text: `أنت الآن تتابع ${u.name}`, time: 'الآن', unread: true }, ...n])
      } else {
        notify('ألغيت المتابعة')
      }
      return next
    })
  }, [notify])

  const unread = notifs.filter(n => n.unread).length

  // ---- gamification: XP / level / streak / wallet ----
  const addXp = useCallback((amount, reason = 'تفاعل') => {
    setXp(p => {
      const next = p + amount
      const before = XP_LEVELS.filter(l => l.xp <= p).length
      const after = XP_LEVELS.filter(l => l.xp <= next).length
      if (after > before) {
        const lvl = XP_LEVELS[after - 1]
        setTimeout(() => notify(`🎉 ترقّيت إلى المستوى ${lvl.level} — ${lvl.name} ${lvl.icon}`), 10)
      } else {
        setTimeout(() => notify(`+${amount} XP — ${reason} ⚡`), 10)
      }
      return next
    })
  }, [notify])

  const addToWallet = useCallback((amount) => {
    setWallet(b => {
      const next = b + amount
      setTimeout(() => notify(amount > 0 ? `💜 حصلت على $${amount}` : `💸 أنفقت $${Math.abs(amount)}`), 10)
      return next
    })
  }, [notify])

  const spendFromWallet = useCallback((amount) => {
    setWallet(b => {
      const next = Math.max(0, b - amount)
      setTimeout(() => notify(`💸 أنفقت $${amount}`), 10)
      return next
    })
  }, [notify])

  const levelData = XP_LEVELS.filter(l => l.xp <= xp).pop() || XP_LEVELS[0]
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(levelData) + 1] || null
  const levelProgress = nextLevel ? Math.round(((xp - levelData.xp) / (nextLevel.xp - levelData.xp)) * 100) : 100

  // ---- real convertible currency ----
  const rateOf = (code) => (CURRENCIES.find(c => c.code === code) || { rate: 1 }).rate
  const priceTick = (code) => (EXCHANGE_TICKS.find(t => t.code === code) || { change: 0 }).change

  const convert = useCallback((amount, from, to) => {
    if (amount <= 0) { notify('⚠️ أدخل مبلغاً صالحاً'); return false }
    if (from === to) { notify('⚠️ اختر عملتين مختلفتين'); return false }
    if (balances[from] === undefined || balances[from] < amount) { notify('❌ رصيدك في هذه العملة غير كافٍ'); return false }
    const rf = rateOf(from), rt = rateOf(to)
    const got = +(amount / rf * rt).toFixed(2)
    setBalances(b => ({ ...b, [from]: +(b[from] - amount).toFixed(2), [to]: +(b[to] + got).toFixed(2) }))
    const cx = { id: 'cv' + Date.now(), from, fromAmt: amount, to, toAmt: got, rate: +((rt / rf)).toFixed(4), time: 'الآن' }
    setConversionHistory(h => [cx, ...h])
    addXp(20, 'تبديل عملة')
    notify(`💱 حوّلت ${amount} ${from} ← ${got} ${to}`)
    return true
  }, [balances, notify, addXp])

  const withdraw = useCallback((methodId, amount, currency = 'USDT') => {
    const method = WITHDRAW_METHODS.find(m => m.id === methodId)
    if (!method) return false
    if (amount <= 0) { notify('⚠️ أدخل مبلغاً صالحاً'); return false }
    if ((balances[currency] || 0) < amount) { notify('❌ الرصيد غير كافٍ'); return false }
    const fee = +(amount * method.fee / 100).toFixed(2)
    const net = +(amount - fee).toFixed(2)
    setBalances(b => ({ ...b, [currency]: +(b[currency] - amount).toFixed(2) }))
    setWithdrawHistory(h => [{ id: 'wd' + Date.now(), method, amount, fee, net, currency, time: 'الآن' }, ...h])
    notify(`🏦 سحب ${net} ${currency} عبر ${method.name}`)
    addXp(30, 'سحب من المحفظة')
    return true
  }, [balances, notify, addXp])

  const searchIndex = (q) => {
    if (!q.trim()) return { users: [], streams: [], spaces: [], posts: [], brands: [] }
    const t = q.trim().toLowerCase()
    const has = (s) => (s || '').toLowerCase().includes(t)
    return {
      users: USERS.filter(u => has(u.name) || has(u.handle) || has(u.tagline)),
      streams: STREAMS.filter(s => has(s.title) || has(s.category) || s.tags.some(has)),
      spaces: SPACES.filter(s => has(s.title) || has(s.description) || s.topics.some(has)),
      posts: FEED.filter(p => has(p.text)),
      brands: [{ id: 'b1', brand: 'TechGulf', name: 'إطلاق هاتف NX-9 برو' }, { id: 'b2', brand: 'CoffeeNation', name: 'مشروب الطاقة الجديد' }].filter(b => has(b.brand) || has(b.name)),
    }
  }

  return (
    <Ctx.Provider value={{
      page, nav, navTarget,
      profileId, openProfile, closeProfile,
      notifs, unread, markAllRead, showNotifs, setShowNotifs,
      showSearch, setShowSearch, search, setSearch, searchIndex,
      toast, notify,
      followed, toggleFollow,
      goLiveOpen, setGoLiveOpen,
      xp, streak, levelData, nextLevel, levelProgress, addXp,
      wallet, addToWallet, spendFromWallet,
      balances, convert, withdraw, rateOf, priceTick,
      conversionHistory, withdrawHistory,
      settings, setSetting, resetSettings, settingsOpen, setSettingsOpen,
    }}>
      {children}
    </Ctx.Provider>
  )
}
