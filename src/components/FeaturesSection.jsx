import { Wand2, GitBranch, Layers, Share2, FileCode2, Palette } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered Generation',
    description: 'Describe your diagram in natural language and watch it come to life. Supports complex architectures and relationships.',
    iconBg: 'bg-primary-100 text-primary-600',
  },
  {
    icon: GitBranch,
    title: 'Multiple Diagram Types',
    description: 'Architecture diagrams, flowcharts, ERDs, sequence diagrams, and mind maps — all from a single interface.',
    iconBg: 'bg-surface-200 text-surface-700',
  },
  {
    icon: Layers,
    title: 'Interactive Canvas',
    description: 'Drag, resize, and connect nodes on an infinite canvas. Fine-tune AI outputs with visual precision.',
    iconBg: 'bg-success-400/20 text-success-500',
  },
  {
    icon: Share2,
    title: 'Export & Share',
    description: 'Export as SVG, PNG, or share a live link. Embed diagrams in docs, presentations, or wikis.',
    iconBg: 'bg-warning-400/20 text-warning-500',
  },
  {
    icon: FileCode2,
    title: 'Code-First Option',
    description: 'Switch between visual and code mode. Edit diagrams using Mermaid or custom DSL syntax.',
    iconBg: 'bg-error-400/20 text-error-500',
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Choose from curated color themes or create your own. Every diagram looks presentation-ready.',
    iconBg: 'bg-primary-100 text-primary-500',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-300 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight mb-4 text-surface-900">
            Everything you need to
            <br />
            <em className="text-accent-serif not-italic" style={{ fontStyle: 'italic' }}>design with AI</em>
          </h2>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto">
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
                className="group rounded-2xl p-7 bg-surface-100 border border-surface-200 hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-surface-400/10"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feat.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
