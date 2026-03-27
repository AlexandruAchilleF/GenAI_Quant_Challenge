-- ╔══════════════════════════════════════════════════════════╗
-- ║  DiagramAI — Users Table                                ║
-- ║  Supabase / PostgreSQL                                  ║
-- ╚══════════════════════════════════════════════════════════╝

-- Enable UUID generation (Supabase enables this by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL,
  password_hash TEXT      NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'normal'
                          CHECK (role IN ('work', 'normal')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT users_email_unique UNIQUE (email)
);

-- Index for fast email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Index for role-based queries (e.g. admin dashboards)
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  Notes                                                  ║
-- ╠══════════════════════════════════════════════════════════╣
-- ║  • 'guest' role is NOT stored in DB — it is handled     ║
-- ║    entirely in client-side state.                       ║
-- ║                                                         ║
-- ║  • password_hash should store bcrypt/argon2 hashes.     ║
-- ║    If using Supabase Auth, this column can be removed   ║
-- ║    since Supabase manages auth internally.              ║
-- ║                                                         ║
-- ║  • 'work' role grants access to specialized chatbot     ║
-- ║    APIs (Finance, Math, Stats).                         ║
-- ║  • 'normal' role grants access to the standard chatbot. ║
-- ╚══════════════════════════════════════════════════════════╝
