import { useState, useEffect, useRef } from 'react'
import { X, Mail, Lock, UserPlus, LogIn, ArrowRight, Briefcase, User } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('normal') // 'work' | 'normal'
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef(null)

  const loginWithEmail = useAuthStore((s) => s.loginWithEmail)
  const signUp = useAuthStore((s) => s.signUp)
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setPassword('')
      setRole('normal')
      setError('')
      setTab('login')
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 600))

    const result = loginWithEmail(email, password)
    setIsLoading(false)

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    const result = signUp(email, password, role)
    setIsLoading(false)

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  const handleGuest = () => {
    continueAsGuest()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md glass rounded-2xl shadow-xl glow-primary animate-slide-up overflow-hidden"
      >
        {/* Close button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
            {tab === 'login'
              ? <LogIn className="w-6 h-6 text-white" />
              : <UserPlus className="w-6 h-6 text-white" />
            }
          </div>
          <h2 className="text-xl font-bold text-surface-900">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            {tab === 'login'
              ? 'Sign in to access your diagrams'
              : 'Choose your account type to get started'
            }
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-8 mb-6 rounded-xl bg-surface-200/60 p-1">
          <button
            id="auth-tab-login"
            onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'login'
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            Login
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => { setTab('signup'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'signup'
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={tab === 'login' ? handleLogin : handleSignUp} className="px-8">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-surface-300 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-surface-300 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {/* Role selector — only on Sign Up */}
          {tab === 'signup' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="auth-role-normal"
                  onClick={() => setRole('normal')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    role === 'normal'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-surface-300 bg-white hover:border-surface-400'
                  }`}
                >
                  <User className={`w-5 h-5 ${role === 'normal' ? 'text-primary-500' : 'text-surface-400'}`} />
                  <span className={`text-xs font-semibold ${role === 'normal' ? 'text-primary-600' : 'text-surface-600'}`}>
                    Normal
                  </span>
                  <span className="text-[10px] text-surface-400 leading-tight text-center">
                    Standard chatbot
                  </span>
                </button>
                <button
                  type="button"
                  id="auth-role-work"
                  onClick={() => setRole('work')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    role === 'work'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-surface-300 bg-white hover:border-surface-400'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 ${role === 'work' ? 'text-primary-500' : 'text-surface-400'}`} />
                  <span className={`text-xs font-semibold ${role === 'work' ? 'text-primary-600' : 'text-surface-600'}`}>
                    Work
                  </span>
                  <span className="text-[10px] text-surface-400 leading-tight text-center">
                    Finance, Math, Stats
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-error-400/10 border border-error-400/20 text-error-500 text-xs font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="auth-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-md shadow-primary-600/20 hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {tab === 'login' ? 'Login with Email' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mx-8 my-5">
          <div className="flex-1 h-px bg-surface-300" />
          <span className="text-xs text-surface-400 font-medium">or</span>
          <div className="flex-1 h-px bg-surface-300" />
        </div>

        {/* Continue as Guest */}
        <div className="px-8 pb-8">
          <button
            id="auth-guest"
            onClick={handleGuest}
            className="w-full py-3 rounded-xl border-2 border-surface-300 bg-white text-surface-700 font-semibold text-sm hover:border-surface-400 hover:bg-surface-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continue as Guest
            <ArrowRight className="w-4 h-4 text-surface-400" />
          </button>
          <p className="text-[10px] text-surface-400 text-center mt-2">
            No account needed — access the standard chatbot temporarily
          </p>
        </div>

        {/* Mock credentials hint */}
        {tab === 'login' && (
          <div className="px-8 pb-6">
            <div className="px-3 py-2.5 rounded-lg bg-surface-200/60 border border-surface-300/50">
              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1">Demo credentials</p>
              <div className="space-y-0.5 text-[11px] text-surface-600 font-mono">
                <p><span className="text-primary-500">Work:</span> work@diagramai.com / work123</p>
                <p><span className="text-primary-500">Normal:</span> user@diagramai.com / user123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
