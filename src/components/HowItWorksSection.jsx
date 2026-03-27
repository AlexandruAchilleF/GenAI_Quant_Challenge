import { MessageSquareText, Cpu, PenTool } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: MessageSquareText,
    title: 'Describe Your Diagram',
    description: 'Write a natural language prompt describing the system or process you want to visualize. Be as detailed or concise as you like.',
    accent: 'primary',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Generates It',
    description: 'Our AI model parses your description, determines the best layout and diagram type, and generates a fully structured diagram.',
    accent: 'accent',
  },
  {
    num: '03',
    icon: PenTool,
    title: 'Refine & Export',
    description: 'Fine-tune on the interactive canvas — move nodes, edit labels, change colors. Then export as SVG, PNG, or share a link.',
    accent: 'success',
  },
]

const accentColors = {
  primary: {
    bg: 'bg-primary-600',
    text: 'text-primary-400',
    border: 'border-primary-600',
    glow: 'shadow-primary-600/20',
    line: 'from-primary-600',
  },
  accent: {
    bg: 'bg-accent-500',
    text: 'text-accent-400',
    border: 'border-accent-500',
    glow: 'shadow-accent-500/20',
    line: 'from-accent-500',
  },
  success: {
    bg: 'bg-success-500',
    text: 'text-success-400',
    border: 'border-success-500',
    glow: 'shadow-success-500/20',
    line: 'from-success-500',
  },
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Three steps to
            <br />
            <span className="text-gradient">any diagram</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            From idea to polished diagram in under a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, i) => {
            const Icon = step.icon
            const colors = accentColors[step.accent]
            const isEven = i % 2 === 1

            return (
              <div
                key={step.num}
                id={`step-${step.num}`}
                className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Number + icon */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-24 h-24 rounded-2xl ${colors.bg} bg-opacity-10 flex items-center justify-center relative z-10`}>
                    <Icon className={`w-10 h-10 ${colors.text}`} />
                  </div>
                  <div className={`absolute -top-3 -right-3 text-5xl font-black ${colors.text} opacity-20 select-none`}>
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className={`glass rounded-2xl p-8 flex-1 ${isEven ? 'text-right md:text-right' : ''}`}>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-surface-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
