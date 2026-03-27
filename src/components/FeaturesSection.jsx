import { Wand2, GitBranch, Layers, Share2, FileCode2, Palette } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered Generation',
    description: 'Describe your diagram in natural language and watch it come to life. Supports complex architectures and relationships.',
    gradient: 'from-primary-500 to-primary-600',
    glow: 'group-hover:shadow-primary-500/20',
  },
  {
    icon: GitBranch,
    title: 'Multiple Diagram Types',
    description: 'Architecture diagrams, flowcharts, ERDs, sequence diagrams, and mind maps — all from a single interface.',
    gradient: 'from-accent-500 to-accent-600',
    glow: 'group-hover:shadow-accent-500/20',
  },
  {
    icon: Layers,
    title: 'Interactive Canvas',
    description: 'Drag, resize, and connect nodes on an infinite canvas. Fine-tune AI outputs with visual precision.',
    gradient: 'from-success-400 to-success-500',
    glow: 'group-hover:shadow-success-400/20',
  },
  {
    icon: Share2,
    title: 'Export & Share',
    description: 'Export as SVG, PNG, or share a live link. Embed diagrams in docs, presentations, or wikis.',
    gradient: 'from-warning-400 to-warning-500',
    glow: 'group-hover:shadow-warning-400/20',
  },
  {
    icon: FileCode2,
    title: 'Code-First Option',
    description: 'Switch between visual and code mode. Edit diagrams using Mermaid or custom DSL syntax.',
    gradient: 'from-error-400 to-error-500',
    glow: 'group-hover:shadow-error-400/20',
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Choose from curated color themes or create your own. Every diagram looks presentation-ready.',
    gradient: 'from-primary-400 to-accent-400',
    glow: 'group-hover:shadow-primary-400/20',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="text-gradient">design with AI</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            A complete toolkit for generating, editing, and sharing professional diagrams — powered by state-of-the-art AI.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                id={`feature-card-${i}`}
                className={`group glass rounded-2xl p-7 hover:bg-surface-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feat.glow}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
