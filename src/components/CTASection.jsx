import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
          Ready to turn ideas into
          <br />
          <span className="text-gradient">diagrams?</span>
        </h2>
        <p className="text-surface-400 text-lg mb-10 max-w-xl mx-auto">
          Start building beautiful, AI-generated diagrams right now. No sign-up required for the MVP.
        </p>
        <Link
          to="/editor"
          id="cta-bottom"
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-lg hover:from-primary-500 hover:to-primary-400 transition-all shadow-2xl shadow-primary-600/30 hover:shadow-primary-500/50 hover:-translate-y-1 active:translate-y-0"
        >
          Open Editor for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
