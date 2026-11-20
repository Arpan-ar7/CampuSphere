// ─────────────────────────────────────────────────────────────
//  FAKE DATA used while there is no backend (see services/client.js → USE_MOCK).
//  The shapes here match what the backend should return — see API_CONTRACT.md.
//  Tip: in post text, ==words== are shown highlighted and #tags are bold.
// ─────────────────────────────────────────────────────────────
import type { ApplicationStatus, Message, PostType, User } from '@/types'
import { noteHref, postHref } from '@/utils/links'

// ── "Raw" records: how a database would store them (ids instead of full objects).
//    The services turn these into the full types in src/types (e.g. authorId → author).
export interface RawComment { id: string; authorId: string; text: string; createdAt: string }
export interface RawPost {
  id: string; authorId: string; type: PostType; content: string; createdAt: string
  noteId?: string | null; projectId?: string | null
  likes: number; comments: number; saves: number; liked: boolean; saved: boolean
  recentComments: RawComment[]
}
export interface RawNote {
  id: string; title: string; subject: string; semester: number; uploaderId: string; pages: number; fileType: string
  downloads: number; likes: number; saves: number; liked: boolean; saved: boolean; uploadedAt: string
  summary: string; tags: string[]; preview: string[]; fileUrl?: string
}
export interface RawConversation { id: string; withUserId: string; lastMessage: string; updatedAt: string; unread: number }
export interface RawProject {
  id: string; authorId: string; title: string; description: string; skillsNeeded: string[]; spots: number
  category: string; createdAt: string; saves: number; saved: boolean
}
export interface RawApplication {
  id: string; projectId: string; userId: string; note: string; status: ApplicationStatus
  response: string; appliedAt: string; respondedAt: string | null
}
export interface RawNotification { id: string; actorId: string; text: string; target: string; link: string; createdAt: string }

const minutesAgo = (m: number): string => new Date(Date.now() - m * 60_000).toISOString()

// ── People ─────────────────────────────────────────────────
export const currentUser: User = {
  id: 'u1',
  name: 'Arpan Panda',
  handle: 'arpan',
  email: 'arpan@marwadiuniversity.ac.in',
  department: 'Computer Science',
  year: 3,
  bio: 'Building CampuSphere. Into web dev, DSA and late-night chai.',
  skills: ['React', 'JavaScript', 'UI Design'],
  followers: 128,
  following: 96,
  online: true,
}

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'Priya Sharma', handle: 'priya', department: 'Computer Science', year: 3, bio: 'ML enthusiast. Topper notes dealer 📚', skills: ['Python', 'Machine Learning', 'PyTorch'], followers: 342, following: 120, online: true },
  { id: 'u3', name: 'Rahul Verma', handle: 'rahulv', department: 'Electronics', year: 2, bio: 'Embedded systems + robotics club.', skills: ['C', 'Arduino', 'PCB Design'], followers: 210, following: 180, online: false },
  { id: 'u4', name: 'Sneha Iyer', handle: 'sneha', department: 'Mechanical', year: 4, bio: 'CAD, SAE team lead, coffee.', skills: ['SolidWorks', 'ANSYS', 'Leadership'], followers: 189, following: 75, online: true },
  { id: 'u5', name: 'Aman Khan', handle: 'amank', department: 'Computer Science', year: 1, bio: 'Freshie learning to code. Ask me about memes.', skills: ['Java', 'HTML/CSS'], followers: 45, following: 160, online: false },
  { id: 'u6', name: 'Neha Gupta', handle: 'nehag', department: 'Mathematics', year: 3, bio: 'Linear algebra is life. Tutoring available.', skills: ['Statistics', 'R', 'LaTeX'], followers: 276, following: 90, online: true },
]

/** Find a user by id (falls back to a placeholder so the UI never crashes on missing data) */
export const userById = (id: string): User =>
  users.find((u) => u.id === id) ?? { id, name: 'Unknown student', handle: 'unknown', department: '', year: 0, bio: '', skills: [], followers: 0, following: 0 }
export const me = (): string => currentUser.id

/** Adds the full `author` object to a record that only has an author id */
export const withAuthor = <T extends object>(item: T, key: keyof T = 'authorId' as keyof T): T & { author: User } => ({
  ...item,
  author: userById(String(item[key])),
})

// ── Campus feed posts ──────────────────────────────────────
// type: 'update' | 'question'. noteId / projectId attach a note or team project.
export const posts: RawPost[] = [
  {
    id: 'p1', authorId: 'u2', type: 'update', createdAt: minutesAgo(12),
    content: 'Just uploaded my ==full DBMS unit 3 notes== (normalization + transactions). Free for everyone, go grab them! #DBMS #StudyBuddy',
    noteId: 'n1', likes: 48, comments: 9, saves: 30, liked: false, saved: false,
    recentComments: [
      { id: 'c1', authorId: 'u5', text: 'absolute legend, saving this right now', createdAt: minutesAgo(8) },
      { id: 'c2', authorId: 'u6', text: 'the transactions part is so clear, thank you!', createdAt: minutesAgo(5) },
    ],
  },
  {
    id: 'p2', authorId: 'u3', type: 'update', createdAt: minutesAgo(55),
    content: 'Robotics club needs ==2 people who know OpenCV== for the TechFest line-follower. We meet Tue/Thu evenings 🤖',
    projectId: 'cp1', likes: 21, comments: 4, saves: 6, liked: true, saved: false,
    recentComments: [{ id: 'c3', authorId: 'u1', text: 'applied! I know basic OpenCV', createdAt: minutesAgo(50) }],
  },
  {
    id: 'p3', authorId: 'u6', type: 'update', createdAt: minutesAgo(140),
    content: 'Hot take: eigenvalues are ==easy once you stop memorising== and start drawing them. Free doubt session in the library at 5pm. #Maths',
    noteId: 'n4', likes: 67, comments: 15, saves: 12, liked: false, saved: true,
    recentComments: [{ id: 'c4', authorId: 'u2', text: 'coming! saving a seat for Aman too', createdAt: minutesAgo(120) }],
  },
  {
    id: 'p4', authorId: 'u5', type: 'question', createdAt: minutesAgo(300),
    content: 'Does anyone have the ==previous year question papers== for Programming in C? Sem 1 is scaring me 😭',
    likes: 12, comments: 22, saves: 3, liked: false, saved: false,
    recentComments: [{ id: 'c5', authorId: 'u3', text: 'check the K-Maps PYQ note, I will upload C ones tonight', createdAt: minutesAgo(280) }],
  },
  {
    id: 'p5', authorId: 'u4', type: 'update', createdAt: minutesAgo(1440),
    content: 'SAE results are out — ==we placed 4th nationally!== Huge thanks to everyone who stayed back on weekends. 🏎️',
    likes: 154, comments: 31, saves: 8, liked: true, saved: false,
    recentComments: [{ id: 'c6', authorId: 'u6', text: 'so proud of you all!!', createdAt: minutesAgo(1400) }],
  },
  {
    id: 'p6', authorId: 'u1', type: 'update', createdAt: minutesAgo(400),
    content: 'Looking for a ==backend dev and a tester== for CampuSphere, the campus app you are using right now 👀',
    projectId: 'cp4', likes: 33, comments: 7, saves: 5, liked: false, saved: false,
    recentComments: [],
  },
]

// ── Notes library ──────────────────────────────────────────
export const subjects: string[] = ['All', 'DBMS', 'Operating Systems', 'Data Structures', 'Maths', 'Digital Electronics', 'Thermodynamics']

export const notes: RawNote[] = [
  {
    id: 'n1', title: 'DBMS Unit 3 – Normalization & Transactions', subject: 'DBMS', semester: 5, uploaderId: 'u2', pages: 24, fileType: 'PDF',
    downloads: 312, likes: 64, saves: 41, liked: false, saved: false, uploadedAt: minutesAgo(12),
    summary: 'Every normal form with one worked example each, plus ACID and concurrency control drawn as diagrams instead of walls of text.',
    tags: ['normalization', 'ACID', 'diagrams'],
    preview: ['1NF → BCNF with one table each', 'Functional dependencies, the easy way', 'ACID properties with real examples', 'Locks vs timestamps: when to use which'],
  },
  {
    id: 'n2', title: 'OS – Process Scheduling cheat sheet', subject: 'Operating Systems', semester: 5, uploaderId: 'u1', pages: 4, fileType: 'PDF',
    downloads: 198, likes: 37, saves: 22, liked: false, saved: false, uploadedAt: minutesAgo(600),
    summary: 'FCFS, SJF, Round Robin and Priority on one page, with Gantt charts you can copy.',
    tags: ['scheduling', 'gantt', 'one-pager'],
    preview: ['FCFS vs SJF in one table', 'Round Robin with time quantum 2', 'Waiting time formulas', 'Starvation and aging'],
  },
  {
    id: 'n3', title: 'Trees & Graphs – handwritten notes', subject: 'Data Structures', semester: 3, uploaderId: 'u2', pages: 38, fileType: 'PDF',
    downloads: 540, likes: 121, saves: 88, liked: true, saved: true, uploadedAt: minutesAgo(3000),
    summary: 'BST, AVL, heaps, BFS/DFS and shortest paths, colour-coded and drawn step by step.',
    tags: ['trees', 'graphs', 'colour-coded'],
    preview: ['AVL rotations, drawn', 'Heapify step by step', 'BFS vs DFS: when the queue becomes a stack', 'Dijkstra with a worked example'],
  },
  {
    id: 'n4', title: 'Linear Algebra – Eigenvalues explained', subject: 'Maths', semester: 2, uploaderId: 'u6', pages: 16, fileType: 'PDF',
    downloads: 220, likes: 45, saves: 19, liked: false, saved: false, uploadedAt: minutesAgo(1500),
    summary: 'What eigenvalues actually mean, with pictures first and formulas second.',
    tags: ['eigenvalues', 'visual', 'worked-examples'],
    preview: ['Eigenvectors as "directions that stay"', 'Characteristic equation, 3 examples', 'Diagonalisation shortcut', 'Common mistakes'],
  },
  {
    id: 'n5', title: 'K-Maps & Logic Gates PYQ solutions', subject: 'Digital Electronics', semester: 3, uploaderId: 'u3', pages: 12, fileType: 'DOCX',
    downloads: 145, likes: 28, saves: 15, liked: false, saved: false, uploadedAt: minutesAgo(5000),
    summary: 'Solved previous-year questions on K-maps and logic gates with every step shown.',
    tags: ['k-maps', 'PYQ', 'solutions'],
    preview: ['2, 3 and 4 variable K-maps', "Don't-care conditions", 'NAND/NOR-only circuits', '10 solved PYQs'],
  },
  {
    id: 'n6', title: 'Thermo Laws – formula sheet', subject: 'Thermodynamics', semester: 4, uploaderId: 'u4', pages: 2, fileType: 'Image',
    downloads: 89, likes: 14, saves: 6, liked: false, saved: false, uploadedAt: minutesAgo(8000),
    summary: 'All four laws and the formulas you actually use, on one image.',
    tags: ['formulas', 'one-pager'],
    preview: ['Zeroth to third law', 'Entropy formulas', 'Cycles: Carnot, Otto, Diesel', 'Units cheat sheet'],
  },
]

// ── Chat ───────────────────────────────────────────────────
export const conversations: RawConversation[] = [
  { id: 'c1', withUserId: 'u2', lastMessage: 'Sure, I will send the OS notes tonight', updatedAt: minutesAgo(3), unread: 2 },
  { id: 'c2', withUserId: 'u3', lastMessage: 'Are you free for the robotics meet?', updatedAt: minutesAgo(80), unread: 1 },
  { id: 'c3', withUserId: 'u6', lastMessage: 'Thanks for the help yesterday!', updatedAt: minutesAgo(1600), unread: 0 },
]

export const messages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', senderId: 'u1', text: 'Hey Priya! Do you have OS notes for unit 2?', createdAt: minutesAgo(20) },
    { id: 'm2', senderId: 'u2', text: 'Yes! Scheduling + deadlocks right?', createdAt: minutesAgo(18) },
    { id: 'm3', senderId: 'u1', text: 'Exactly, I missed those lectures 😅', createdAt: minutesAgo(10) },
    { id: 'm4', senderId: 'u2', text: 'Sure, I will send the OS notes tonight', createdAt: minutesAgo(3) },
  ],
  c2: [{ id: 'm5', senderId: 'u3', text: 'Are you free for the robotics meet?', createdAt: minutesAgo(80) }],
  c3: [
    { id: 'm6', senderId: 'u1', text: 'Your eigenvalue explanation finally made it click.', createdAt: minutesAgo(1700) },
    { id: 'm7', senderId: 'u6', text: 'Thanks for the help yesterday!', createdAt: minutesAgo(1600) },
  ],
}

// ── Teams: projects looking for collaborators ──────────────
// spots = how many people the project needs in total
export const collabPosts: RawProject[] = [
  { id: 'cp5', authorId: 'u6', title: 'Weekend coding club for juniors', description: 'Teaching 1st-years Python every Saturday. Need 2 more mentors who can explain things simply.', skillsNeeded: ['Python', 'Teaching'], spots: 2, category: 'Side project', createdAt: minutesAgo(25), saves: 4, saved: false },
  { id: 'cp1', authorId: 'u3', title: 'Line-follower robot for TechFest', description: 'Need people comfortable with OpenCV and basic electronics. We meet Tue/Thu evenings.', skillsNeeded: ['OpenCV', 'Python', 'Arduino'], spots: 2, category: 'Competition', createdAt: minutesAgo(55), saves: 14, saved: false },
  { id: 'cp4', authorId: 'u1', title: 'CampuSphere – app for our university', description: 'Building a campus social app (notes, chat, teams). Need a backend dev and someone for testing.', skillsNeeded: ['Node.js', 'MongoDB', 'Testing'], spots: 3, category: 'Side project', createdAt: minutesAgo(400), saves: 9, saved: false },
  { id: 'cp2', authorId: 'u2', title: 'Research paper on student-stress prediction', description: 'Looking for a stats person and a frontend dev to build a small survey dashboard.', skillsNeeded: ['Statistics', 'React'], spots: 2, category: 'Research', createdAt: minutesAgo(900), saves: 5, saved: true },
  { id: 'cp3', authorId: 'u4', title: 'Hackathon 2026 team', description: 'Mechanical + CS team for a sustainability hackathon. Ideas welcome!', skillsNeeded: ['UI Design', 'Node.js', 'Pitching'], spots: 3, category: 'Hackathon', createdAt: minutesAgo(2000), saves: 11, saved: false },
]

// Requests to join a project.
// status: 'pending' | 'accepted' | 'rejected'. `response` is the owner's reply the applicant sees.
export const applications: RawApplication[] = [
  // Requests to MY project (cp4) — shown in "Posted by you"
  { id: 'a1', projectId: 'cp4', userId: 'u2', note: 'I have built REST APIs with Express and MongoDB. Would love to help!', status: 'pending', response: '', appliedAt: minutesAgo(90), respondedAt: null },
  { id: 'a2', projectId: 'cp4', userId: 'u5', note: 'I can help with testing on different phones.', status: 'pending', response: '', appliedAt: minutesAgo(45), respondedAt: null },
  { id: 'a3', projectId: 'cp4', userId: 'u3', note: 'Happy to set up the server and deployment.', status: 'accepted', response: 'Welcome to the team! Message me and we will plan the first sprint.', appliedAt: minutesAgo(300), respondedAt: minutesAgo(250) },

  // MY requests to other projects — shown in "Applied"
  { id: 'a4', projectId: 'cp1', userId: 'u1', note: 'I know basic OpenCV and Python.', status: 'rejected', response: 'Sorry Arpan, we already found our team for TechFest. Thanks for applying, and all the best!', appliedAt: minutesAgo(50), respondedAt: minutesAgo(20) },
  { id: 'a5', projectId: 'cp2', userId: 'u1', note: 'I can build the survey dashboard in React.', status: 'accepted', response: 'Yes! Your React skills are exactly what we need. Let us meet in the library tomorrow.', appliedAt: minutesAgo(800), respondedAt: minutesAgo(600) },
  { id: 'a6', projectId: 'cp3', userId: 'u1', note: 'I can do the UI design and help with the pitch.', status: 'pending', response: '', appliedAt: minutesAgo(1200), respondedAt: null },
]

// ── Notifications that aren't generated from teams activity ──
export const extraNotifications: RawNotification[] = [
  { id: 'nt1', actorId: 'u6', text: 'liked your note', target: 'OS – Process Scheduling cheat sheet', link: noteHref('n2'), createdAt: minutesAgo(30) },
  { id: 'nt2', actorId: 'u2', text: 'commented on your post', target: 'Looking for a backend dev and a tester…', link: postHref('p6'), createdAt: minutesAgo(70) },
]
export const notificationState: { readAt: string | null } = { readAt: null }
