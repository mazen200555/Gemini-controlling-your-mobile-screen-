import { useState } from 'react'
import { FEED, STREAMS, userById } from '../data'
import { Icon, Avatar, fmtNum, Toast } from '../components/ui'

export default function Home({ onNav }) {
  const [posts, setPosts] = useState(FEED)
  const [text, setText] = useState('')
  const [toast, setToast] = useState(null)

  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }

  const compose = () => {
    if (!text.trim()) return
    const newPost = {
      id: 'new-' + Date.now(), author: 'you', time: 'الآن', text: text.trim(),
      likes: 0, reposts: 0, replies: 0, comments: [], media: null
    }
    setPosts([newPost, ...posts])
    setText('')
    notify('تم نشر منشورك 💫')
  }

  const like = (id) => setPosts(p => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x))

  const Media = ({ post }) => {
    if (!post.media) return null
    const styles = {
      chart: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
      space: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      wave: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      live: 'linear-gradient(135deg, #ef4444, #ec4899)',
    }
    const icons = { chart: '📊', space: '🎙️', wave: '〰️', live: '🔴' }
    return (
      <div className="post-media" style={{ background: styles[post.media] }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .35, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.5), transparent 60%)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 6 }}>{icons[post.media]}</div>
          <div style={{ fontWeight: 800 }}>{post.mediaLabel}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <h1 className="page-title">الرئيسية</h1>
        <p className="page-sub">بثّ مباشر 🤝 تغريدات ⚡ مجتمع يتحرّك على مدار الساعة</p>
      </div>

      {/* Live strip */}
      <div className="strip">
        {STREAMS.map((s, i) => (
          <div className="live-card" key={s.id} onClick={() => onNav('live')}>
            <div className="live-thumb">
              <div className="glow" style={{ background: `linear-gradient(135deg, hsl(${170 + i * 40},70%,45%), hsl(${270 + i * 20},70%,50%))` }} />
              <div className="cover-icon">🎮</div>
              <span className="live-badge"><span className="pulse" /> LIVE</span>
              <span className="viewers-badge"><Icon name="user" size={12} /> {fmtNum(s.viewers)}</span>
            </div>
            <div className="live-body">
              <div className="live-title">{s.title}</div>
              <div className="tags">
                {s.tags.slice(0, 2).map(t => <span className="tag" key={t}>#{t}</span>)}
              </div>
              <div className="live-host">
                <Avatar user={userById(s.host)} size="sm" />
                <span>{userById(s.host).name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose */}
      <div className="compose">
        <div className="compose-row">
          <Avatar user={userById('you')} size="md" />
          <textarea
            placeholder="ماذا يحدث؟ شارك ما يفكر فيه... ✍️"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <div className="flex" style={{ alignItems: 'center', marginTop: 8 }}>
          <div className="compose-tools">
            <span className="compose-tool" title="وسائط"><Icon name="plus" /></span>
            <span className="compose-tool" title="صورة"><Icon name="play" /></span>
            <span className="compose-tool" title="بثّ"><Icon name="live" /></span>
            <span className="compose-tool" title="استطلاع"><Icon name="chart" /></span>
          </div>
          <button className="btn primary" style={{ marginRight: 'auto' }} onClick={compose} disabled={!text.trim()}>نشر</button>
        </div>
      </div>

      {/* Feed */}
      {posts.map(post => {
        const author = userById(post.author)
        return (
          <div className="post" key={post.id}>
            <div className="post-head">
              <Avatar user={author} size="md" />
              <div>
                <div className="post-name">{author.name} {author.isVerified && <Icon name="verify" size={14} />}</div>
                <div className="post-handle">@{author.handle} · {post.time}</div>
              </div>
            </div>
            <p className="post-text">{post.text}</p>
            {post.media && <Media post={post} />}
            <div className="post-actions">
              <span className={`post-action ${post.liked ? 'liked' : ''}`} onClick={() => like(post.id)}>
                <Icon name="heart" size={17} /> {fmtNum(post.likes)}
              </span>
              <span className="post-action"><Icon name="comment" size={17} /> {fmtNum(post.replies)}</span>
              <span className="post-action"><Icon name="retweet" size={17} /> {fmtNum(post.reposts)}</span>
              <span className="post-action" style={{ marginRight: 'auto' }} onClick={() => onNav('live')}><Icon name="share" size={17} /> مشاركة</span>
            </div>
            {post.comments.length > 0 && (
              <div className="comments">
                {post.comments.map(c => (
                  <div className="comment" key={c.id}>
                    <Avatar user={userById(c.author)} size="sm" />
                    <div className="comment-body">
                      <span className="comment-name">{userById(c.author).name}</span>
                      <p className="comment-text">{c.text}</p>
                      <div className="comment-meta"><span>❤️ {c.likes}</span><span>رد</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <Toast message={toast} />
    </div>
  )
}
