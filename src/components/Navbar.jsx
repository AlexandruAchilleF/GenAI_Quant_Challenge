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
          ? 'glass shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="logo-link">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900">
            Diagram<span className="text-primary-500">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-surface-500 hover:text-surface-900 transition-colors text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-surface-500 hover:text-surface-900 transition-colors text-sm font-medium">
            How it works
          </a>
          <a href="#examples" className="text-surface-500 hover:text-surface-900 transition-colors text-sm font-medium">
            Examples
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/editor"
            id="nav-cta"
            className="px-5 py-2.5 rounded-full bg-surface-900 text-white text-sm font-semibold hover:bg-surface-800 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            Open Editor
            <span className="text-xs">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-surface-700 hover:text-surface-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-surface-700 hover:text-surface-900 transition-colors font-medium" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-surface-700 hover:text-surface-900 transition-colors font-medium" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#examples" className="text-surface-700 hover:text-surface-900 transition-colors font-medium" onClick={() => setMobileOpen(false)}>Examples</a>
            <hr className="border-surface-300" />
            <Link
              to="/editor"
              className="px-5 py-2.5 rounded-full bg-surface-900 text-white text-sm font-semibold text-center"
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
