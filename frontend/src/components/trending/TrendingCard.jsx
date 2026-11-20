// Top 5 most liked / replied / saved posts, notes and team projects on campus.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Heart, MessageCircle, TrendingUp, UserPlus } from 'lucide-react'
import { api } from '../../api/index.js'
import { timeAgo } from '../../utils/time.js'
import Card from '../ui/Card.jsx'
import Chip from '../ui/Chip.jsx'

// What each kind looks like and where clicking it goes
const TYPES = {
  post: { label: 'Post', color: 'yellow', link: (id) => `/#post-${id}` },
  note: { label: 'Note', color: 'mint', link: (id) => `/notes#note-${id}` },
  project: { label: 'Team', color: 'blue', link: (id) => `/teams#project-${id}` },
}

function Stat({ icon: Icon, value, label }) {
  if (!value) return null
  return (
    <span className="inline-flex items-center gap-0.5" title={label}>
      <Icon className="h-3 w-3" /> {value}
    </span>
  )
}

export default function TrendingCard() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    api.getTrending().then(setItems)
  }, [])

  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-1.5 font-display text-base font-bold">
        <TrendingUp className="h-4 w-4" /> Trending on campus
      </h2>
      <p className="mb-3 text-xs text-ink/60">Top 5 most liked, replied and saved</p>

      <ol className="space-y-1.5">
        {(items || []).map((item, i) => {
          const type = TYPES[item.type]
          return (
            <li key={`${item.type}-${item.id}`}>
              <Link to={type.link(item.id)} className="flex gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-hl-yellow/50">
                <span className="w-4 shrink-0 font-display text-lg leading-tight font-extrabold">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <Chip color={type.color} className="text-[10px]">{type.label}</Chip>
                    <span className="truncate text-[11px] text-ink/60">{item.author.name.split(' ')[0]} · {timeAgo(item.createdAt)}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-sm leading-snug font-bold">{item.text}</span>
                  <span className="mt-0.5 flex gap-2 text-[11px] font-bold text-ink/70">
                    <Stat icon={Heart} value={item.likes} label="Likes" />
                    <Stat icon={MessageCircle} value={item.comments} label="Replies" />
                    <Stat icon={Bookmark} value={item.saves} label="Saves" />
                    <Stat icon={UserPlus} value={item.applicants} label="Applied" />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
