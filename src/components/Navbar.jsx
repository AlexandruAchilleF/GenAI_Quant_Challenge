import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="logo-link">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Diagram<span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">
            How it works
          </a>
          <a href="#examples" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">
            Examples
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/editor"
            id="nav-cta"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Open Editor
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-surface-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-surface-300 hover:text-white transition-colors font-medium" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-surface-300 hover:text-white transition-colors font-medium" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#examples" className="text-surface-300 hover:text-white transition-colors font-medium" onClick={() => setMobileOpen(false)}>Examples</a>
            <hr className="border-surface-800" />
            <Link
              to="/editor"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold text-center"
              onClick={() => setMobileOpen(false)}
            >
              Open Editor
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
