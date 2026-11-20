// Every page talks to the backend through `api`, e.g. api.getFeed().
// Each feature lives in its own file in this folder.
import * as auth from './auth.js'
import * as chat from './chat.js'
import * as notes from './notes.js'
import * as notifications from './notifications.js'
import * as posts from './posts.js'
import * as reactions from './reactions.js'
import * as streak from './streak.js'
import * as teams from './teams.js'
import * as trending from './trending.js'
import * as users from './users.js'

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
