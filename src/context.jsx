import { createContext, useContext, useState, useCallback } from 'react'
import { NOTIFICATIONS as NOTIF_SEED, STREAMS, SPACES, USERS, FEED, userById } from './data'

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

  const notify = useCallback((m) => {
    setToast(m)
    clearTimeout(notify._t)
    notify._t = setTimeout(() => setToast(null), 2300)
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
    }}>
      {children}
    </Ctx.Provider>
  )
}
