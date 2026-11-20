// ─────────────────────────────────────────────────────────────
//  Every page talks to the backend through `api`, e.g. api.getFeed().
//  These are frontend calls TO the backend — the backend itself is a separate project.
//  Each feature lives in its own file in this folder; this file puts them together.
// ─────────────────────────────────────────────────────────────
import * as auth from '@/services/auth'
import * as chat from '@/services/chat'
import * as notes from '@/services/notes'
import * as notifications from '@/services/notifications'
import * as posts from '@/services/posts'
import * as reactions from '@/services/reactions'
import * as streak from '@/services/streak'
import * as teams from '@/services/teams'
import * as trending from '@/services/trending'
import * as users from '@/services/users'

export const api = {
  ...auth, // login, signup
  ...posts, // getFeed, createPost, addComment
  ...reactions, // toggleLike, toggleSave
  ...notes, // getNotes, getNote, uploadNote, getSubjects
  ...teams, // getProjects, getMyProjects, getMyApplications, createProject, applyToProject, respondToApplication
  ...chat, // getConversations, getMessages, sendMessage
  ...trending, // getTrending
  ...streak, // getStreak, recordActivity
  ...notifications, // getNotifications, markAllNotificationsRead
  ...users, // getUser, getSuggestedPeople
}
