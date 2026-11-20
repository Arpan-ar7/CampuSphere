'use client'

// ─────────────────────────────────────────────────────────────
//  One post in the feed: author, text, attached note or team project,
//  Like / Reply / Share / Save buttons, and the latest replies.
//  Used by: FeedView, ProfileView.
// ─────────────────────────────────────────────────────────────
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { CalendarDays, CircleQuestionMark, MessageCircle, Notebook, Share2, Users } from 'lucide-react'
import { api } from '@/services'
import { LIMITS } from '@/config'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { timeAgo } from '@/utils/time'
import { errorMessage } from '@/utils/errors'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import { Input } from '@/components/ui/FormFields'
import { LikeButton, SaveButton } from '@/components/ui/ReactionButtons'
import NotePreviewModal from '@/components/notes/NotePreviewModal'
import ApplyModal from '@/components/teams/ApplyModal'
import JoinButton from '@/components/teams/JoinButton'
import RichText from '@/components/feed/RichText'
import { postHref, profileHref, projectHref } from '@/utils/links'
import type { Post } from '@/types'

export default function PostCard({ post }: { post: Post }) {
  const { record } = useStreak()
  const toast = useToast()
  const [comments, setComments] = useState(post.recentComments)
  const [commentCount, setCommentCount] = useState(post.comments)
  const [showReply, setShowReply] = useState(false)
  const [reply, setReply] = useState('')
  const [openNote, setOpenNote] = useState(false)
  const [project, setProject] = useState(post.project)
  const [applying, setApplying] = useState(false)
  const author = post.author

  const sendReply = async (e: FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    try {
      const comment = await api.addComment(post.id, reply.trim())
      setComments([...comments, comment])
      setCommentCount(commentCount + 1)
      setReply('')
      toast('Reply posted', 'mint')
      record('comment') // counts for today's streak
    } catch (err) {
      toast(errorMessage(err), 'pink')
    }
  }

  const share = async () => {
    const url = window.location.origin + postHref(post.id)
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copied, paste it anywhere 🔗', 'blue')
    } catch {
      toast(url, 'blue')
    }
  }

  return (
    <Card as="article" id={`post-${post.id}`} className="relative scroll-mt-28 p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <Link href={profileHref(author.handle)}><Avatar user={author} size="lg" /></Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href={profileHref(author.handle)} className="font-display text-[15px] font-bold hover:underline">{author.name}</Link>
            <Chip color="blue" className="text-[10px]">{author.department}</Chip>
            {post.type === 'question' && <Chip color="peach" className="text-[10px]"><CircleQuestionMark className="h-3 w-3" /> Question</Chip>}
            <span className="text-xs text-ink/55">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="font-hand text-lg leading-none text-ink/60">@{author.handle}</p>
        </div>
      </header>

      <RichText text={post.content} className="mt-3" />

      {/* Attached note */}
      {post.note && (
        <button
          type="button"
          onClick={() => setOpenNote(true)}
          className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-ink bg-hl-yellow/70 p-3 text-left shadow-ink transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-ink bg-paper"><Notebook className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-bold">{post.note.title}</span>
            <span className="text-xs text-ink/65">Shared note · tap to open</span>
          </span>
          <Chip color="paper">{post.note.fileType}</Chip>
        </button>
      )}

      {/* Attached team project */}
      {project && (
        <div className="mt-3 rounded-xl border-2 border-ink bg-paper p-3">
          <Link href={projectHref(project.id)} className="font-display text-sm font-bold hover:underline">{project.title}</Link>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Chip color="mint"><Users className="h-3 w-3" /> {project.category}</Chip>
            {project.skillsNeeded.map((s) => <Chip key={s} color="peach">{s}</Chip>)}
            <Chip color="lilac"><CalendarDays className="h-3 w-3" /> {project.spotsLeft} spots left</Chip>
          </div>
          <div className="mt-3">
            <JoinButton project={project} onApply={() => setApplying(true)} />
          </div>
        </div>
      )}

      <footer className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-gridline pt-3">
        <LikeButton kind="posts" item={post} />
        <Button size="sm" onClick={() => setShowReply(!showReply)} aria-expanded={showReply} title="Reply">
          <MessageCircle className="h-4 w-4" /> {commentCount}
        </Button>
        <Button size="sm" onClick={share} title="Copy link">
          <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share</span>
        </Button>
        <SaveButton kind="posts" item={post} />
      </footer>

      {comments.length > 0 && (
        <div className="mt-3 space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar user={c.author} size="xs" />
              <p className="rounded-lg border-2 border-ink bg-paper px-2.5 py-1.5 text-[13px] leading-snug">
                <strong>{c.author.name.split(' ')[0]}</strong> {c.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {showReply && (
        <form onSubmit={sendReply} className="mt-3 flex gap-2">
          <Input autoFocus maxLength={LIMITS.comment} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" aria-label="Write a reply" />
          <Button size="sm" color="blue" className="shrink-0" disabled={!reply.trim()}>Send</Button>
        </form>
      )}

      {openNote && post.note && <NotePreviewModal note={post.note} onClose={() => setOpenNote(false)} />}
      {applying && project && (
        <ApplyModal
          project={project}
          onClose={() => setApplying(false)}
          onApplied={(application) => {
            setProject({ ...project, myApplication: application, applicantsCount: project.applicantsCount + 1 })
            setApplying(false)
          }}
        />
      )}
    </Card>
  )
}
