import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-surface-800/50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Diagram<span className="text-gradient">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-surface-500">
            <a href="#features" className="hover:text-surface-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-surface-300 transition-colors">How it works</a>
            <a href="#examples" className="hover:text-surface-300 transition-colors">Examples</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-surface-600">
            © {new Date().getFullYear()} DiagramAI. Built with AI.
          </p>
        </div>
      </div>
    </footer>
  )
}
