import { create } from 'zustand'

/* ── Mock user database (simulates Supabase) ── */
const MOCK_USERS = [
  {
    id: 'usr-001',
    email: 'work@diagramai.com',
    password: 'work123',
    role: 'work',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'user@diagramai.com',
    password: 'user123',
    role: 'normal',
    created_at: '2026-02-20T10:30:00Z',
  },
]

/* ── Persist helpers ── */
const STORAGE_KEY = 'diagramai_auth'

function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Never persist guest sessions
    if (data?.userRole === 'guest') return null
    return data
  } catch {
    return null
  }
}

function persistAuth(state) {
  if (!state.currentUser || state.userRole === 'guest') {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentUser: state.currentUser,
      userRole: state.userRole,
      isAuthenticated: true,
    })
  )
}

/* ── Initial state ── */
const persisted = loadPersistedAuth()

const initialState = persisted
  ? {
      currentUser: persisted.currentUser,
      userRole: persisted.userRole,
      isAuthenticated: true,
    }
  : {
      currentUser: null,
      userRole: null,
      isAuthenticated: false,
    }

/* ── Store ── */
const useAuthStore = create((set, get) => ({
  ...initialState,

  /**
   * Mock login — looks up user in MOCK_USERS by email & password.
   * Returns { success, error? }
   */
  loginWithEmail: (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      return { success: false, error: 'Invalid email or password.' }
    }

    const user = {
      id: found.id,
      email: found.email,
      role: found.role,
      created_at: found.created_at,
    }

    const newState = { currentUser: user, userRole: found.role, isAuthenticated: true }
    set(newState)
    persistAuth(newState)
    return { success: true }
  },

  /**
   * Mock sign-up — creates a new user locally and adds to MOCK_USERS.
   * Returns { success, error? }
   */
  signUp: (email, password, role = 'normal') => {
    const exists = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (exists) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const validRoles = ['work', 'normal']
    if (!validRoles.includes(role)) {
      return { success: false, error: 'Invalid role selected.' }
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      password,
      role,
      created_at: new Date().toISOString(),
    }

    // Add to the in-memory mock DB
    MOCK_USERS.push(newUser)

    const user = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at,
    }

    const newState = { currentUser: user, userRole: role, isAuthenticated: true }
    set(newState)
    persistAuth(newState)
    return { success: true }
  },

  /**
   * Guest login — no DB interaction, purely client-side.
   */
  continueAsGuest: () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      email: null,
      role: 'guest',
      created_at: new Date().toISOString(),
    }
    set({ currentUser: guestUser, userRole: 'guest', isAuthenticated: true })
    // Guests are NOT persisted
  },

  /**
   * Logout — clears all auth state and localStorage.
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ currentUser: null, userRole: null, isAuthenticated: false })
  },

  /**
   * Helper — check if the user has the 'work' role.
   */
  isWorkUser: () => get().userRole === 'work',
}))

export default useAuthStore
