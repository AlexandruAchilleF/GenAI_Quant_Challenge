import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-300 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl tracking-tight mb-6 text-surface-900">
          Ready to turn ideas into
          <br />
          <em className="text-accent-serif not-italic" style={{ fontStyle: 'italic' }}>diagrams?</em>
        </h2>
        <p className="text-surface-500 text-lg mb-10 max-w-xl mx-auto">
          Start building beautiful, AI-generated diagrams right now. No sign-up required for the MVP.
        </p>
        <Link
          to="/editor"
          id="cta-bottom"
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-surface-900 text-white font-semibold text-lg hover:bg-surface-800 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          Open Editor for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
