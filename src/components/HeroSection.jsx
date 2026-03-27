import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Play } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/10 rounded-full blur-[140px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-slide-up">
          <Zap className="w-4 h-4 text-warning-400" />
          <span className="text-sm font-medium text-surface-300">
            Powered by AI — generate diagrams in seconds
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          Turn your ideas into
          <br />
          <span className="text-gradient">beautiful diagrams</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          Describe what you need in plain language and let AI generate architecture diagrams,
          flowcharts, ERDs, and more — instantly.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/editor"
            id="hero-cta-primary"
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-lg hover:from-primary-500 hover:to-primary-400 transition-all shadow-xl shadow-primary-600/30 hover:shadow-primary-500/50 hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
          >
            Start Creating
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            id="hero-cta-secondary"
            className="group px-8 py-4 rounded-2xl glass-light text-surface-200 font-semibold text-lg hover:bg-surface-800/60 transition-all flex items-center gap-3"
          >
            <Play className="w-5 h-5 text-primary-400" />
            See how it works
          </a>
        </div>

        {/* Preview mockup */}
        <div
          className="mt-16 relative animate-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="glass rounded-2xl p-1 glow-primary">
            <div className="bg-surface-900 rounded-xl overflow-hidden">
              {/* Editor mockup header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800">
                <div className="w-3 h-3 rounded-full bg-error-400/80" />
                <div className="w-3 h-3 rounded-full bg-warning-400/80" />
                <div className="w-3 h-3 rounded-full bg-success-400/80" />
                <span className="ml-3 text-xs text-surface-500 font-mono">DiagramAI Editor</span>
              </div>
              {/* Editor mockup content */}
              <div className="flex min-h-[340px]">
                {/* Left panel — prompt */}
                <div className="w-2/5 border-r border-surface-800 p-6 flex flex-col">
                  <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Prompt</div>
                  <div className="space-y-2 text-sm text-surface-400 font-mono">
                    <div className="flex gap-2">
                      <span className="text-primary-400">{">"}</span>
                      <span className="text-surface-300">Create a microservices</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-400 opacity-0">{">"}</span>
                      <span className="text-surface-300">architecture with API Gateway,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-400 opacity-0">{">"}</span>
                      <span className="text-surface-300">Auth Service, User Service,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary-400 opacity-0">{">"}</span>
                      <span className="text-surface-300">and a PostgreSQL database</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="h-10 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                      Generate Diagram
                    </div>
                  </div>
                </div>

                {/* Right panel — diagram preview */}
                <div className="flex-1 p-6 flex items-center justify-center relative">
                  <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[280px] opacity-80">
                    {/* Gateway node */}
                    <rect x="140" y="10" width="120" height="40" rx="8" fill="#4f46e5" opacity="0.9" />
                    <text x="200" y="35" textAnchor="middle" fill="white" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">API Gateway</text>

                    {/* Lines from gateway */}
                    <line x1="170" y1="50" x2="80" y2="100" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
                    <line x1="200" y1="50" x2="200" y2="100" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
                    <line x1="230" y1="50" x2="320" y2="100" stroke="#6366f1" strokeWidth="2" opacity="0.6" />

                    {/* Service nodes */}
                    <rect x="20" y="100" width="120" height="40" rx="8" fill="#0891b2" opacity="0.9" />
                    <text x="80" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">Auth Service</text>

                    <rect x="155" y="100" width="90" height="40" rx="8" fill="#0891b2" opacity="0.9" />
                    <text x="200" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">User Svc</text>

                    <rect x="260" y="100" width="120" height="40" rx="8" fill="#0891b2" opacity="0.9" />
                    <text x="320" y="125" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">Order Service</text>

                    {/* Lines to DB */}
                    <line x1="80" y1="140" x2="200" y2="190" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />
                    <line x1="200" y1="140" x2="200" y2="190" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />
                    <line x1="320" y1="140" x2="200" y2="190" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" />

                    {/* Database */}
                    <ellipse cx="200" cy="195" rx="55" ry="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
                    <rect x="145" y="195" width="110" height="25" fill="#1e293b" stroke="none" />
                    <line x1="145" y1="195" x2="145" y2="220" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
                    <line x1="255" y1="195" x2="255" y2="220" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="200" cy="220" rx="55" ry="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
                    <text x="200" y="213" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">PostgreSQL</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative glow under preview */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-600/20 blur-[60px]" />
        </div>
      </div>
    </section>
  )
}
