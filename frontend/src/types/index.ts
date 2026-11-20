// ─────────────────────────────────────────────────────────────
//  DATA TYPES: the shape of everything the app works with.
//  These match API_CONTRACT.md exactly: if the backend changes a field,
//  change it here and TypeScript shows every place in the app that needs updating.
// ─────────────────────────────────────────────────────────────

/** ISO date text, e.g. "2026-11-20T10:30:00.000Z" */
export type ISODate = string

// ── People ──────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  handle: string
  email?: string
  department: string
  year: number
  bio: string
  skills: string[]
  followers: number
  following: number
  online?: boolean
}

/** What login / sign-up return */
export interface Session {
  token: string
  user: User
}

export interface SignupData {
  name: string
  email: string
  password: string
  department: string
  year: number | string
}

// ── Likes & saves (posts, notes and projects all have these) ─
export type ReactionKind = 'posts' | 'notes' | 'collabs'

export interface Likeable {
  id: string
  likes: number
  liked: boolean
}
export interface Saveable {
  id: string
  saves: number
  saved: boolean
}

// ── Notes ───────────────────────────────────────────────────
export interface Note extends Likeable, Saveable {
  title: string
  subject: string
  semester: number
  author: User
  pages: number
  fileType: string
  downloads: number
  uploadedAt: ISODate
  summary: string
  tags: string[]
  preview: string[]
  fileUrl?: string
}

export interface NoteUpload {
  title: string
  subject: string
  semester: number | string
  summary: string
  file: File | null
}

// ── Feed ────────────────────────────────────────────────────
export type PostType = 'update' | 'question'

export interface Comment {
  id: string
  author: User
  text: string
  createdAt: ISODate
}

export interface Post extends Likeable, Saveable {
  author: User
  type: PostType
  content: string
  createdAt: ISODate
  comments: number
  recentComments: Comment[]
  note?: Note | null
  project?: Project | null
}

export interface NewPost {
  content: string
  type?: PostType
  noteId?: string | null
}

// ── Teams ───────────────────────────────────────────────────
export type ProjectCategory = 'Competition' | 'Research' | 'Hackathon' | 'Side project'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface Application {
  id: string
  projectId: string
  applicant: User
  note: string
  status: ApplicationStatus
  /** The owner's message to the applicant (e.g. "Sorry, we found our team…") */
  response: string
  appliedAt: ISODate
  respondedAt: ISODate | null
}

export interface Project extends Saveable {
  author: User
  title: string
  description: string
  skillsNeeded: string[]
  category: ProjectCategory | string
  createdAt: ISODate
  /** People needed in total */
  spots: number
  /** spots minus accepted applicants */
  spotsLeft: number
  applicantsCount: number
  /** Owner + accepted applicants */
  members: User[]
  /** The logged-in user's request to this project, if any */
  myApplication: Application | null
}

/** "Posted by you" tab: my project + everyone who applied */
export interface MyProject extends Project {
  applications: Application[]
}

/** "Applied" tab: my request + the project it's for */
export interface MyApplication extends Application {
  project: Project
}

export interface NewProject {
  title: string
  description: string
  skillsNeeded: string[]
  spots: number
  category: string
}

// ── Chat ────────────────────────────────────────────────────
export interface Conversation {
  id: string
  withUser: User
  lastMessage: string
  updatedAt: ISODate
  unread: number
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: ISODate
}

// ── Trending ────────────────────────────────────────────────
export type TrendingType = 'post' | 'note' | 'project'

export interface TrendingItem {
  type: TrendingType
  id: string
  text: string
  author: User
  createdAt: ISODate
  likes?: number
  comments?: number
  saves?: number
  applicants?: number
  score: number
}

// ── Streak ──────────────────────────────────────────────────
export type StreakActivity =
  | 'active_5min'
  | 'post'
  | 'comment'
  | 'message'
  | 'upload_note'
  | 'open_note'
  | 'like'
  | 'save'
  | 'apply'
  | 'create_project'

export interface StreakDay {
  date: string // "YYYY-MM-DD"
  label: string // "M", "T"…
  active: boolean
  isToday: boolean
}

export interface Streak {
  current: number
  best: number
  todayCounted: boolean
  week: StreakDay[]
  /** Only on POST /streak/activity: true the first time today counts */
  justCounted?: boolean
  countedBy?: StreakActivity
}

// ── Notifications ───────────────────────────────────────────
export interface AppNotification {
  id: string
  author: User
  text: string
  target: string
  link: string
  createdAt: ISODate
  read: boolean
}

// ── Profile page ────────────────────────────────────────────
export interface UserProfile {
  user: User
  posts: Post[]
  notes: Note[]
  projects: Project[]
  /** Only filled for your own profile */
  savedNotes: Note[]
}

// ── Design ──────────────────────────────────────────────────
export type HighlightColor = 'yellow' | 'pink' | 'mint' | 'blue' | 'peach' | 'lilac'
export type SurfaceColor = HighlightColor | 'card' | 'paper' | 'ink'
