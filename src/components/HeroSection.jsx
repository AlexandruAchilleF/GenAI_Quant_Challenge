import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Heading — serif style */}
        <h1
          className="font-serif text-5xl sm:text-6xl lg:text-8xl tracking-tight leading-[1.1] mb-6 animate-slide-up text-surface-900 font-normal"
          style={{ animationDelay: '0.1s' }}
        >
          welcome to
          <br />
          a <em className="text-accent-serif not-italic" style={{ fontStyle: 'italic' }}>smarter</em> way
          <br />
          to diagram
        </h1>

        {/* Subtext */}
        <p
          className="text-base sm:text-lg text-surface-500 max-w-xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          Beautifully designed, AI-powered, and packed with features.
          <br />
          We care about your experience, not complexity.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/editor"
            id="hero-cta-primary"
            className="group px-8 py-4 rounded-full bg-surface-900 text-white font-semibold text-base hover:bg-surface-800 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3"
          >
            Start Creating
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            id="hero-cta-secondary"
            className="group px-8 py-4 rounded-full border border-surface-300 text-surface-700 font-semibold text-base hover:bg-surface-100 transition-all flex items-center gap-3"
          >
            <Play className="w-5 h-5 text-primary-500" />
            See how it works
          </a>
        </div>

        {/* Preview mockup */}
        <div
          className="mt-16 relative animate-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="rounded-2xl p-1 border border-surface-300 shadow-lg shadow-surface-400/10">
            <div className="bg-surface-100 rounded-xl overflow-hidden">
              {/* Editor mockup header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-300">
                <div className="w-3 h-3 rounded-full bg-error-400/80" />
                <div className="w-3 h-3 rounded-full bg-warning-400/80" />
                <div className="w-3 h-3 rounded-full bg-success-400/80" />
                <span className="ml-3 text-xs text-surface-500 font-mono">DiagramAI Editor</span>
              </div>
              {/* Editor mockup content */}
              <div className="flex min-h-[340px]">
                {/* Left panel — prompt */}
                <div className="w-2/5 border-r border-surface-300 p-6 flex flex-col">
                  <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Prompt</div>
                  <div className="space-y-2 text-sm text-surface-600 font-mono">
                    <div className="flex gap-2">
                      <span className="text-primary-500">{">"}</span>
                      <span className="text-surface-700">Create a microservices</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-500 opacity-0">{">"}</span>
                      <span className="text-surface-700">architecture with API Gateway,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-500 opacity-0">{">"}</span>
                      <span className="text-surface-700">Auth Service, User Service,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-500 opacity-0">{">"}</span>
                      <span className="text-surface-700">and a PostgreSQL database</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="h-10 rounded-full bg-surface-900 flex items-center justify-center text-white text-sm font-semibold">
                      Generate Diagram
                    </div>
                  </div>
                </div>

                {/* Right panel — diagram preview */}
                <div className="flex-1 p-6 flex items-center justify-center relative bg-surface-50">
                  <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[280px] opacity-80">
                    {/* Gateway node */}
                    <rect x="140" y="10" width="120" height="40" rx="12" fill="#c85a3a" opacity="0.9" />
                    <text x="200" y="35" textAnchor="middle" fill="white" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">API Gateway</text>

                    {/* Lines from gateway */}
                    <line x1="170" y1="50" x2="80" y2="100" stroke="#c85a3a" strokeWidth="2" opacity="0.4" />
                    <line x1="200" y1="50" x2="200" y2="100" stroke="#c85a3a" strokeWidth="2" opacity="0.4" />
                    <line x1="230" y1="50" x2="320" y2="100" stroke="#c85a3a" strokeWidth="2" opacity="0.4" />

                    {/* Service nodes */}
                    <rect x="20" y="100" width="120" height="40" rx="12" fill="#3d3a36" opacity="0.9" />
                    <text x="80" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">Auth Service</text>

                    <rect x="155" y="100" width="90" height="40" rx="12" fill="#3d3a36" opacity="0.9" />
                    <text x="200" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">User Svc</text>

                    <rect x="260" y="100" width="120" height="40" rx="12" fill="#3d3a36" opacity="0.9" />
                    <text x="320" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">Order Service</text>

                    {/* Lines to DB */}
                    <line x1="80" y1="140" x2="200" y2="190" stroke="#a9a298" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />
                    <line x1="200" y1="140" x2="200" y2="190" stroke="#a9a298" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />
                    <line x1="320" y1="140" x2="200" y2="190" stroke="#a9a298" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />

                    {/* Database */}
                    <ellipse cx="200" cy="195" rx="55" ry="10" fill="#ebe5db" stroke="#c85a3a" strokeWidth="1.5" opacity="0.8" />
                    <rect x="145" y="195" width="110" height="25" fill="#ebe5db" stroke="none" />
                    <line x1="145" y1="195" x2="145" y2="220" stroke="#c85a3a" strokeWidth="1.5" opacity="0.8" />
                    <line x1="255" y1="195" x2="255" y2="220" stroke="#c85a3a" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="200" cy="220" rx="55" ry="10" fill="#ebe5db" stroke="#c85a3a" strokeWidth="1.5" opacity="0.8" />
                    <text x="200" y="213" textAnchor="middle" fill="#c85a3a" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">PostgreSQL</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
