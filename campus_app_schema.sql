-- =====================================================================
--  CAMPUS SOCIAL APP — DATABASE SCHEMA (PostgreSQL 14+)
--  Modules: Users & Profile · Posts (likes/comments/tags/mentions/shares)
--           Notes / PYQs · Chat · Blocking · Teams (apply/accept/reject)
--           Notifications · Reports (moderation)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS citext;   -- case-insensitive text (emails, usernames, tags)

-- ---------------------------------------------------------------------
--  ENUM TYPES  (fixed value sets — stops typos like 'Acepted' in status)
-- ---------------------------------------------------------------------
CREATE TYPE user_role          AS ENUM ('student', 'moderator', 'admin');
CREATE TYPE exam_type          AS ENUM ('mid_sem', 'end_sem', 'quiz', 'assignment', 'lab', 'other');
CREATE TYPE team_status        AS ENUM ('open', 'closed', 'filled', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE conversation_type  AS ENUM ('direct', 'team');
CREATE TYPE share_channel      AS ENUM ('in_app_chat', 'copy_link', 'external');
CREATE TYPE report_status      AS ENUM ('open', 'reviewing', 'action_taken', 'dismissed');
CREATE TYPE skill_level        AS ENUM ('beginner', 'intermediate', 'advanced');

-- =====================================================================
--  1. USERS & PROFILE
-- =====================================================================
CREATE TABLE departments (
    id    SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code  VARCHAR(10)  NOT NULL UNIQUE,          -- 'CSE', 'ECE'
    name  VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           CITEXT       NOT NULL UNIQUE,          -- A@x.com == a@x.com
    username        CITEXT       NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,                 -- bcrypt/argon2, NEVER plain text
    full_name       VARCHAR(100) NOT NULL,
    roll_number     VARCHAR(30)  UNIQUE,
    department_id   SMALLINT     REFERENCES departments(id),
    batch_year      SMALLINT     CHECK (batch_year BETWEEN 2000 AND 2100), -- graduation year (doesn't go stale like "3rd year")
    bio             VARCHAR(500),
    avatar_file_id  BIGINT,                                 -- FK added after files table
    role            user_role    NOT NULL DEFAULT 'student',
    is_verified     BOOLEAN      NOT NULL DEFAULT FALSE,    -- verified college email
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,                            -- soft delete
    CHECK (username ~ '^[A-Za-z0-9_.]{3,30}$'),
    CHECK (email ~ '@yourcollege\.edu$')                    -- only college emails (change domain)
);

CREATE TABLE skills (
    id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  CITEXT NOT NULL UNIQUE                            -- 'Python' == 'python'
);

CREATE TABLE user_skills (                                  -- M:N, no comma-separated strings
    user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id  INT    NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level     skill_level,
    PRIMARY KEY (user_id, skill_id)
);

-- =====================================================================
--  2. FILES  (metadata only — actual bytes live in S3 / Cloudinary / GCS)
-- =====================================================================
CREATE TABLE files (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uploader_id    BIGINT       NOT NULL REFERENCES users(id),
    storage_key    TEXT         NOT NULL UNIQUE,            -- path in bucket
    original_name  VARCHAR(255) NOT NULL,
    mime_type      VARCHAR(100) NOT NULL,
    size_bytes     BIGINT       NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 25 * 1024 * 1024), -- 25 MB cap
    sha256         CHAR(64)     NOT NULL,                   -- detect duplicate uploads
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CHECK (mime_type IN ('image/jpeg','image/png','image/webp','image/gif','application/pdf'))
);
CREATE INDEX idx_files_sha256 ON files(sha256);

ALTER TABLE users ADD CONSTRAINT fk_users_avatar
    FOREIGN KEY (avatar_file_id) REFERENCES files(id) ON DELETE SET NULL;

-- =====================================================================
--  3. POSTS  (home feed)
-- =====================================================================
CREATE TABLE posts (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id      BIGINT       NOT NULL REFERENCES users(id),
    body           TEXT         NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
    like_count     INT          NOT NULL DEFAULT 0 CHECK (like_count >= 0),     -- cached, kept by triggers
    comment_count  INT          NOT NULL DEFAULT 0 CHECK (comment_count >= 0),
    share_count    INT          NOT NULL DEFAULT 0 CHECK (share_count >= 0),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    edited_at      TIMESTAMPTZ,
    deleted_at     TIMESTAMPTZ
);
-- feed: newest first, keyset pagination on (created_at, id)
CREATE INDEX idx_posts_feed   ON posts (created_at DESC, id DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author ON posts (author_id, created_at DESC);

CREATE TABLE post_attachments (
    post_id   BIGINT   NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    file_id   BIGINT   NOT NULL REFERENCES files(id),
    position  SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 10),   -- max 10 attachments, ordered
    PRIMARY KEY (post_id, file_id),
    UNIQUE (post_id, position)
);

CREATE TABLE post_likes (
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     BIGINT      NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)                           -- one like per user per post
);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);

CREATE TABLE comments (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id            BIGINT      NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id          BIGINT      NOT NULL REFERENCES users(id),
    parent_comment_id  BIGINT,                                -- reply to a comment
    body               TEXT        NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at          TIMESTAMPTZ,
    deleted_at         TIMESTAMPTZ,
    UNIQUE (id, post_id),
    -- a reply must belong to the SAME post as its parent
    FOREIGN KEY (parent_comment_id, post_id) REFERENCES comments(id, post_id) ON DELETE CASCADE,
    CHECK (parent_comment_id IS NULL OR parent_comment_id <> id)
);
CREATE INDEX idx_comments_post ON comments (post_id, created_at);

-- Hashtags  (#dsa #placement)
CREATE TABLE tags (
    id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  CITEXT NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z0-9_]{1,50}$')
);
CREATE TABLE post_tags (
    post_id  BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id   INT    NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- Tagging people  (@rahul)
CREATE TABLE post_mentions (
    post_id            BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    mentioned_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, mentioned_user_id)
);
CREATE INDEX idx_post_mentions_user ON post_mentions(mentioned_user_id);

-- =====================================================================
--  4. NOTES / PYQs
-- =====================================================================
CREATE TABLE subjects (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code           VARCHAR(20)  NOT NULL UNIQUE,              -- 'CS301'
    name           VARCHAR(150) NOT NULL,
    department_id  SMALLINT     REFERENCES departments(id),
    semester       SMALLINT     CHECK (semester BETWEEN 1 AND 10)
);

CREATE TABLE notes (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uploader_id     BIGINT       NOT NULL REFERENCES users(id),
    file_id         BIGINT       NOT NULL REFERENCES files(id),
    subject_id      INT          NOT NULL REFERENCES subjects(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    is_pyq          BOOLEAN      NOT NULL DEFAULT TRUE,       -- PYQ vs normal notes
    exam            exam_type,
    exam_year       SMALLINT     CHECK (exam_year BETWEEN 1990 AND 2100),
    like_count      INT          NOT NULL DEFAULT 0 CHECK (like_count >= 0),
    download_count  INT          NOT NULL DEFAULT 0 CHECK (download_count >= 0),
    share_count     INT          NOT NULL DEFAULT 0 CHECK (share_count >= 0),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    CHECK (NOT is_pyq OR (exam IS NOT NULL AND exam_year IS NOT NULL))   -- a PYQ must say which exam/year
);
CREATE INDEX idx_notes_search ON notes (subject_id, exam_year DESC, exam) WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_popular ON notes (download_count DESC) WHERE deleted_at IS NULL;
-- same file can't be uploaded twice as a note
CREATE UNIQUE INDEX uq_notes_file ON notes(file_id) WHERE deleted_at IS NULL;

CREATE TABLE note_likes (
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id     BIGINT      NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, note_id)
);

-- One row per user per note: spamming the download button doesn't inflate the count.
CREATE TABLE note_downloads (
    user_id            BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id            BIGINT      NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    first_downloaded   TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_downloaded    TIMESTAMPTZ NOT NULL DEFAULT now(),
    times              INT         NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, note_id)
);

-- =====================================================================
--  5. SHARES  (for both posts and notes — exactly one target)
-- =====================================================================
CREATE TABLE shares (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     BIGINT        REFERENCES posts(id) ON DELETE CASCADE,
    note_id     BIGINT        REFERENCES notes(id) ON DELETE CASCADE,
    channel     share_channel NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(post_id, note_id) = 1)
);

-- =====================================================================
--  6. BLOCKING
-- =====================================================================
CREATE TABLE user_blocks (
    blocker_id  BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id  BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)                         -- can't block yourself
);
CREATE INDEX idx_blocks_blocked ON user_blocks(blocked_id);

-- helper: is there a block in EITHER direction?
CREATE FUNCTION is_blocked(a BIGINT, b BIGINT) RETURNS BOOLEAN
LANGUAGE sql STABLE AS $$
    SELECT EXISTS (SELECT 1 FROM user_blocks
                   WHERE (blocker_id = a AND blocked_id = b)
                      OR (blocker_id = b AND blocked_id = a));
$$;

-- =====================================================================
--  7. TEAMS  (find teammates: hackathons, projects)
-- =====================================================================
CREATE TABLE teams (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creator_id   BIGINT       NOT NULL REFERENCES users(id),
    title        VARCHAR(150) NOT NULL,
    description  TEXT         NOT NULL,
    max_members  SMALLINT     NOT NULL CHECK (max_members BETWEEN 2 AND 50),  -- includes creator
    status       team_status  NOT NULL DEFAULT 'open',
    deadline     TIMESTAMPTZ,                               -- applications close
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at   TIMESTAMPTZ
);
CREATE INDEX idx_teams_open ON teams (created_at DESC) WHERE status = 'open' AND deleted_at IS NULL;

CREATE TABLE team_required_skills (
    team_id   BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    skill_id  INT    NOT NULL REFERENCES skills(id),
    PRIMARY KEY (team_id, skill_id)
);
CREATE INDEX idx_team_skills_skill ON team_required_skills(skill_id);

CREATE TABLE team_applications (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id       BIGINT             NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    applicant_id  BIGINT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message       VARCHAR(1000),
    status        application_status NOT NULL DEFAULT 'pending',
    applied_at    TIMESTAMPTZ        NOT NULL DEFAULT now(),
    decided_at    TIMESTAMPTZ,
    UNIQUE (team_id, applicant_id),                           -- can't apply twice
    CHECK ((status IN ('accepted','rejected')) = (decided_at IS NOT NULL))
);
CREATE INDEX idx_apps_team ON team_applications(team_id, status);

CREATE TABLE team_members (
    team_id    BIGINT      NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_leader  BOOLEAN     NOT NULL DEFAULT FALSE,
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (team_id, user_id)
);

-- =====================================================================
--  8. CHAT  (1-to-1 from profile, plus optional team group chat)
-- =====================================================================
CREATE TABLE conversations (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type        conversation_type NOT NULL,
    user_low    BIGINT REFERENCES users(id),     -- direct chat: smaller user id
    user_high   BIGINT REFERENCES users(id),     -- direct chat: larger user id
    team_id     BIGINT UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_message_at TIMESTAMPTZ,
    UNIQUE (user_low, user_high),                -- only ONE DM thread per pair
    CHECK (
        (type = 'direct' AND user_low IS NOT NULL AND user_high IS NOT NULL
                         AND user_low < user_high AND team_id IS NULL)
     OR (type = 'team'   AND team_id IS NOT NULL AND user_low IS NULL AND user_high IS NULL)
    )
);

CREATE TABLE conversation_participants (
    conversation_id       BIGINT      NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id               BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_read_message_id  BIGINT,                            -- unread count = messages after this
    is_muted              BOOLEAN     NOT NULL DEFAULT FALSE,
    left_at               TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);

CREATE TABLE messages (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id  BIGINT      NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id        BIGINT      NOT NULL REFERENCES users(id),
    body             TEXT        CHECK (length(body) <= 4000),
    file_id          BIGINT      REFERENCES files(id),
    shared_post_id   BIGINT      REFERENCES posts(id) ON DELETE SET NULL,   -- "share" into chat
    shared_note_id   BIGINT      REFERENCES notes(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at        TIMESTAMPTZ,
    deleted_at       TIMESTAMPTZ,
    CHECK (num_nonnulls(body, file_id, shared_post_id, shared_note_id) >= 1)  -- no empty messages
);
CREATE INDEX idx_messages_conv ON messages (conversation_id, id DESC);

ALTER TABLE conversation_participants ADD CONSTRAINT fk_last_read
    FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- =====================================================================
--  9. NOTIFICATIONS & REPORTS
-- =====================================================================
CREATE TABLE notifications (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- receiver
    actor_id     BIGINT      REFERENCES users(id) ON DELETE CASCADE,           -- who did it
    kind         VARCHAR(40) NOT NULL,   -- 'post_like','comment','mention','team_application','application_accepted',...
    post_id      BIGINT      REFERENCES posts(id) ON DELETE CASCADE,
    note_id      BIGINT      REFERENCES notes(id) ON DELETE CASCADE,
    team_id      BIGINT      REFERENCES teams(id) ON DELETE CASCADE,
    comment_id   BIGINT      REFERENCES comments(id) ON DELETE CASCADE,
    is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON notifications (user_id, is_read, created_at DESC);

CREATE TABLE reports (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reporter_id       BIGINT        NOT NULL REFERENCES users(id),
    reported_user_id  BIGINT        REFERENCES users(id),
    post_id           BIGINT        REFERENCES posts(id),
    comment_id        BIGINT        REFERENCES comments(id),
    note_id           BIGINT        REFERENCES notes(id),
    message_id        BIGINT        REFERENCES messages(id),
    reason            VARCHAR(500)  NOT NULL,
    status            report_status NOT NULL DEFAULT 'open',
    reviewed_by       BIGINT        REFERENCES users(id),
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(reported_user_id, post_id, comment_id, note_id, message_id) = 1)
);

-- =====================================================================
--  10. TRIGGERS — keep counters correct & enforce business rules
-- =====================================================================

-- 10a. post like_count
CREATE FUNCTION trg_post_like_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSE
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER post_like_count AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION trg_post_like_count();

-- 10b. post comment_count (counts visible comments; soft-delete decrements)
CREATE FUNCTION trg_comment_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' AND OLD.deleted_at IS NULL THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER comment_count AFTER INSERT OR UPDATE OF deleted_at OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION trg_comment_count();

-- 10c. note like_count
CREATE FUNCTION trg_note_like_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE notes SET like_count = like_count + 1 WHERE id = NEW.note_id;
    ELSE
        UPDATE notes SET like_count = like_count - 1 WHERE id = OLD.note_id;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER note_like_count AFTER INSERT OR DELETE ON note_likes
    FOR EACH ROW EXECUTE FUNCTION trg_note_like_count();

-- 10d. note download_count (unique users only)
CREATE FUNCTION trg_note_download_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    UPDATE notes SET download_count = download_count + 1 WHERE id = NEW.note_id;
    RETURN NULL;
END $$;
CREATE TRIGGER note_download_count AFTER INSERT ON note_downloads
    FOR EACH ROW EXECUTE FUNCTION trg_note_download_count();

-- 10e. share_count on posts / notes
CREATE FUNCTION trg_share_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.post_id IS NOT NULL THEN
        UPDATE posts SET share_count = share_count + 1 WHERE id = NEW.post_id;
    ELSE
        UPDATE notes SET share_count = share_count + 1 WHERE id = NEW.note_id;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER share_count AFTER INSERT ON shares
    FOR EACH ROW EXECUTE FUNCTION trg_share_count();

-- 10f. Team application rules
CREATE FUNCTION trg_check_application() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE t teams%ROWTYPE;
BEGIN
    SELECT * INTO t FROM teams WHERE id = NEW.team_id;
    IF t.creator_id = NEW.applicant_id THEN
        RAISE EXCEPTION 'You cannot apply to your own team';
    END IF;
    IF t.status <> 'open' OR t.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'This team is not accepting applications';
    END IF;
    IF t.deadline IS NOT NULL AND now() > t.deadline THEN
        RAISE EXCEPTION 'Application deadline has passed';
    END IF;
    IF is_blocked(t.creator_id, NEW.applicant_id) THEN
        RAISE EXCEPTION 'Cannot apply to this team';
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER check_application BEFORE INSERT ON team_applications
    FOR EACH ROW EXECUTE FUNCTION trg_check_application();

-- 10g. Accepting an application → add member, respect capacity (race-safe)
CREATE FUNCTION trg_on_application_decision() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cap SMALLINT; cnt INT;
BEGIN
    IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
        -- lock the team row so two simultaneous accepts can't both squeeze in
        SELECT max_members INTO cap FROM teams WHERE id = NEW.team_id FOR UPDATE;
        SELECT count(*) INTO cnt FROM team_members WHERE team_id = NEW.team_id;
        IF cnt >= cap THEN
            RAISE EXCEPTION 'Team is already full';
        END IF;
        INSERT INTO team_members(team_id, user_id) VALUES (NEW.team_id, NEW.applicant_id);
        IF cnt + 1 >= cap THEN
            UPDATE teams SET status = 'filled' WHERE id = NEW.team_id;
        END IF;
        -- add to team chat if one exists
        INSERT INTO conversation_participants(conversation_id, user_id)
        SELECT c.id, NEW.applicant_id FROM conversations c WHERE c.team_id = NEW.team_id
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER on_application_decision AFTER UPDATE OF status ON team_applications
    FOR EACH ROW EXECUTE FUNCTION trg_on_application_decision();

-- 10h. creator automatically becomes team leader
CREATE FUNCTION trg_team_creator_member() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO team_members(team_id, user_id, is_leader) VALUES (NEW.id, NEW.creator_id, TRUE);
    RETURN NULL;
END $$;
CREATE TRIGGER team_creator_member AFTER INSERT ON teams
    FOR EACH ROW EXECUTE FUNCTION trg_team_creator_member();

-- 10i. Messages: sender must be a participant; blocked users can't DM
CREATE FUNCTION trg_check_message() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE c conversations%ROWTYPE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM conversation_participants
                   WHERE conversation_id = NEW.conversation_id
                     AND user_id = NEW.sender_id AND left_at IS NULL) THEN
        RAISE EXCEPTION 'Sender is not in this conversation';
    END IF;
    SELECT * INTO c FROM conversations WHERE id = NEW.conversation_id;
    IF c.type = 'direct' AND is_blocked(c.user_low, c.user_high) THEN
        RAISE EXCEPTION 'You cannot message this user';
    END IF;
    UPDATE conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
    RETURN NEW;
END $$;
CREATE TRIGGER check_message BEFORE INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION trg_check_message();

-- 10j. Comments blocked between post author and commenter
CREATE FUNCTION trg_check_comment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF is_blocked((SELECT author_id FROM posts WHERE id = NEW.post_id), NEW.author_id) THEN
        RAISE EXCEPTION 'You cannot comment on this post';
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER check_comment BEFORE INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION trg_check_comment();

-- =====================================================================
--  11. HELPER: get-or-create a DM (call from "Message" button on profile)
-- =====================================================================
CREATE FUNCTION get_or_create_dm(me BIGINT, other BIGINT) RETURNS BIGINT
LANGUAGE plpgsql AS $$
DECLARE lo BIGINT := LEAST(me, other); hi BIGINT := GREATEST(me, other); cid BIGINT;
BEGIN
    IF me = other THEN RAISE EXCEPTION 'Cannot message yourself'; END IF;
    IF is_blocked(me, other) THEN RAISE EXCEPTION 'You cannot message this user'; END IF;
    INSERT INTO conversations(type, user_low, user_high) VALUES ('direct', lo, hi)
        ON CONFLICT (user_low, user_high) DO NOTHING
        RETURNING id INTO cid;
    IF cid IS NULL THEN
        SELECT id INTO cid FROM conversations WHERE user_low = lo AND user_high = hi;
    ELSE
        INSERT INTO conversation_participants(conversation_id, user_id) VALUES (cid, lo), (cid, hi);
    END IF;
    RETURN cid;
END $$;

-- =====================================================================
--  12. PROFILE VIEW — everything a user does, in one place
-- =====================================================================
CREATE VIEW profile_stats AS
SELECT u.id AS user_id, u.username, u.full_name,
    (SELECT count(*) FROM posts p WHERE p.author_id = u.id AND p.deleted_at IS NULL)          AS posts,
    (SELECT count(*) FROM notes n WHERE n.uploader_id = u.id AND n.deleted_at IS NULL)        AS notes_shared,
    (SELECT coalesce(sum(n.download_count),0) FROM notes n WHERE n.uploader_id = u.id
                                                            AND n.deleted_at IS NULL)          AS total_note_downloads,
    (SELECT coalesce(sum(p.like_count),0) FROM posts p WHERE p.author_id = u.id
                                                         AND p.deleted_at IS NULL)             AS likes_received,
    (SELECT count(*) FROM teams t WHERE t.creator_id = u.id AND t.deleted_at IS NULL)         AS teams_created,
    (SELECT count(*) FROM team_members m WHERE m.user_id = u.id AND NOT m.is_leader)          AS teams_joined
FROM users u
WHERE u.deleted_at IS NULL;
