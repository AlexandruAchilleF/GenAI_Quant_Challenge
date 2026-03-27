import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-surface-300 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-surface-900">
              Diagram<span className="text-primary-500">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-surface-500">
            <a href="#features" className="hover:text-surface-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-surface-900 transition-colors">How it works</a>
            <a href="#examples" className="hover:text-surface-900 transition-colors">Examples</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-surface-400">
            © {new Date().getFullYear()} DiagramAI. Built with AI.
          </p>
        </div>
      </div>
    </footer>
  )
}
