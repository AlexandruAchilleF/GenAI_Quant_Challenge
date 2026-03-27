import { MessageSquareText, Cpu, PenTool } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: MessageSquareText,
    title: 'Describe Your Diagram',
    description: 'Write a natural language prompt describing the system or process you want to visualize. Be as detailed or concise as you like.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Generates It',
    description: 'Our AI model parses your description, determines the best layout and diagram type, and generates a fully structured diagram.',
  },
  {
    num: '03',
    icon: PenTool,
    title: 'Refine & Export',
    description: 'Ask for revisions in plain English, compare Mermaid variants, then export the rendered result as SVG.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-300 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight mb-4 text-surface-900">
            Three steps to
            <br />
            <em className="text-accent-serif not-italic" style={{ fontStyle: 'italic' }}>any diagram</em>
          </h2>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            From idea to polished diagram in under a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 1

            return (
              <div
                key={step.num}
                id={`step-${step.num}`}
                className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Number + icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center relative z-10">
                    <Icon className="w-10 h-10 text-primary-500" />
                  </div>
                  <div className="absolute -top-3 -right-3 text-5xl font-black text-primary-200 select-none">
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className={`rounded-2xl p-8 flex-1 bg-surface-100 border border-surface-200 ${isEven ? 'text-right md:text-right' : ''}`}>
                  <h3 className="text-2xl font-bold text-surface-900 mb-3">{step.title}</h3>
                  <p className="text-surface-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
