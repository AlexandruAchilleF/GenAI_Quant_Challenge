import { useState } from 'react'

const examples = [
  {
    id: 'microservices',
    label: 'Microservices',
    prompt: 'A microservices architecture with API Gateway, Auth, User, Payment, and Notification services connected to PostgreSQL and Redis.',
    svg: (
      <svg viewBox="0 0 480 280" className="w-full h-full">
        <rect x="180" y="10" width="120" height="36" rx="8" fill="#4f46e5" />
        <text x="240" y="33" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="600">API Gateway</text>

        <line x1="210" y1="46" x2="80" y2="90" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
        <line x1="230" y1="46" x2="180" y2="90" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
        <line x1="250" y1="46" x2="300" y2="90" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
        <line x1="270" y1="46" x2="400" y2="90" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />

        <rect x="20" y="90" width="110" height="36" rx="8" fill="#0891b2" />
        <text x="75" y="113" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="500">Auth Service</text>

        <rect x="145" y="90" width="110" height="36" rx="8" fill="#0891b2" />
        <text x="200" y="113" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="500">User Service</text>

        <rect x="270" y="90" width="110" height="36" rx="8" fill="#0891b2" />
        <text x="325" y="113" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="500">Payment Svc</text>

        <rect x="395" y="90" width="110" height="36" rx="8" fill="#0891b2" />
        <text x="450" y="113" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="500">Notify Svc</text>

        <line x1="75" y1="126" x2="160" y2="180" stroke="#22d3ee" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
        <line x1="200" y1="126" x2="200" y2="180" stroke="#22d3ee" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
        <line x1="325" y1="126" x2="240" y2="180" stroke="#22d3ee" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />

        <ellipse cx="200" cy="190" rx="60" ry="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
        <rect x="140" y="190" width="120" height="22" fill="#1e293b" stroke="none" />
        <line x1="140" y1="190" x2="140" y2="212" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
        <line x1="260" y1="190" x2="260" y2="212" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="200" cy="212" rx="60" ry="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
        <text x="200" y="206" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="Inter" fontWeight="500">PostgreSQL</text>

        <line x1="450" y1="126" x2="400" y2="180" stroke="#f87171" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
        <rect x="360" y="185" width="80" height="30" rx="6" fill="#1e293b" stroke="#f87171" strokeWidth="1.5" opacity="0.7" />
        <text x="400" y="204" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="Inter" fontWeight="500">Redis</text>
      </svg>
    ),
  },
  {
    id: 'flowchart',
    label: 'Flowchart',
    prompt: 'User authentication flow: Login → Validate → 2FA Check → Success or Failure with retry loop.',
    svg: (
      <svg viewBox="0 0 480 280" className="w-full h-full">
        <rect x="185" y="10" width="110" height="36" rx="18" fill="#4f46e5" />
        <text x="240" y="33" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="600">Start</text>

        <line x1="240" y1="46" x2="240" y2="70" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)" />

        <rect x="175" y="70" width="130" height="36" rx="8" fill="#0891b2" />
        <text x="240" y="93" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="500">Enter Credentials</text>

        <line x1="240" y1="106" x2="240" y2="130" stroke="#6366f1" strokeWidth="1.5" />

        <polygon points="240,130 280,155 240,180 200,155" fill="#1e293b" stroke="#facc15" strokeWidth="1.5" />
        <text x="240" y="159" textAnchor="middle" fill="#facc15" fontSize="9" fontFamily="Inter" fontWeight="600">Valid?</text>

        <line x1="280" y1="155" x2="380" y2="155" stroke="#ef4444" strokeWidth="1.5" />
        <text x="330" y="148" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="Inter">No</text>
        <rect x="380" y="137" width="80" height="36" rx="8" fill="#ef4444" opacity="0.8" />
        <text x="420" y="160" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="500">Error</text>
        <path d="M420 173 L420 240 L240 240 L240 70" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" />

        <line x1="240" y1="180" x2="240" y2="205" stroke="#22c55e" strokeWidth="1.5" />
        <text x="254" y="196" fill="#22c55e" fontSize="9" fontFamily="Inter">Yes</text>

        <rect x="175" y="205" width="130" height="36" rx="8" fill="#0891b2" />
        <text x="240" y="228" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="500">2FA Verification</text>

        <line x1="240" y1="241" x2="240" y2="260" stroke="#22c55e" strokeWidth="1.5" />
        <rect x="185" y="258" width="110" height="32" rx="16" fill="#22c55e" />
        <text x="240" y="278" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="600">Success ✓</text>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    ),
  },
  {
    id: 'erd',
    label: 'ERD',
    prompt: 'E-commerce ERD: Users → Orders → OrderItems → Products, with Categories linked to Products.',
    svg: (
      <svg viewBox="0 0 480 280" className="w-full h-full">
        {/* Users table */}
        <rect x="20" y="30" width="130" height="100" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="20" y="30" width="130" height="28" rx="8" fill="#4f46e5" />
        <rect x="20" y="50" width="130" height="8" fill="#4f46e5" />
        <text x="85" y="49" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">Users</text>
        <text x="32" y="75" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔑 id</text>
        <text x="32" y="91" fill="#94a3b8" fontSize="9" fontFamily="Inter">   name</text>
        <text x="32" y="107" fill="#94a3b8" fontSize="9" fontFamily="Inter">   email</text>
        <text x="32" y="123" fill="#94a3b8" fontSize="9" fontFamily="Inter">   created_at</text>

        {/* Orders table */}
        <rect x="200" y="30" width="130" height="100" rx="8" fill="#1e293b" stroke="#0891b2" strokeWidth="1.5" />
        <rect x="200" y="30" width="130" height="28" rx="8" fill="#0891b2" />
        <rect x="200" y="50" width="130" height="8" fill="#0891b2" />
        <text x="265" y="49" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">Orders</text>
        <text x="212" y="75" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔑 id</text>
        <text x="212" y="91" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔗 user_id</text>
        <text x="212" y="107" fill="#94a3b8" fontSize="9" fontFamily="Inter">   total</text>
        <text x="212" y="123" fill="#94a3b8" fontSize="9" fontFamily="Inter">   status</text>

        {/* OrderItems table */}
        <rect x="200" y="170" width="130" height="90" rx="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5" />
        <rect x="200" y="170" width="130" height="28" rx="8" fill="#0e7490" />
        <rect x="200" y="190" width="130" height="8" fill="#0e7490" />
        <text x="265" y="189" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">OrderItems</text>
        <text x="212" y="215" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔑 id</text>
        <text x="212" y="231" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔗 order_id</text>
        <text x="212" y="247" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔗 product_id</text>

        {/* Products table */}
        <rect x="390" y="100" width="130" height="100" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="390" y="100" width="130" height="28" rx="8" fill="#7c3aed" />
        <rect x="390" y="120" width="130" height="8" fill="#7c3aed" />
        <text x="455" y="119" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">Products</text>
        <text x="402" y="145" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔑 id</text>
        <text x="402" y="161" fill="#94a3b8" fontSize="9" fontFamily="Inter">   name, price</text>
        <text x="402" y="177" fill="#94a3b8" fontSize="9" fontFamily="Inter">🔗 category_id</text>
        <text x="402" y="193" fill="#94a3b8" fontSize="9" fontFamily="Inter">   stock</text>

        {/* Relations */}
        <line x1="150" y1="80" x2="200" y2="80" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
        <text x="175" y="74" textAnchor="middle" fill="#6366f1" fontSize="8" fontFamily="Inter">1:N</text>

        <line x1="265" y1="130" x2="265" y2="170" stroke="#0891b2" strokeWidth="1.5" opacity="0.6" />
        <text x="277" y="155" fill="#0891b2" fontSize="8" fontFamily="Inter">1:N</text>

        <line x1="330" y1="215" x2="390" y2="160" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
        <text x="367" y="183" fill="#a855f7" fontSize="8" fontFamily="Inter">N:1</text>
      </svg>
    ),
  },
]

export default function ExamplesSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="examples" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-[350px] h-[350px] bg-accent-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            Real prompts, real diagrams. Click to explore different types.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              id={`example-tab-${ex.id}`}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active === i
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'glass-light text-surface-400 hover:text-white hover:bg-surface-800/60'
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Example display */}
        <div className="glass rounded-2xl overflow-hidden glow-primary">
          <div className="flex flex-col lg:flex-row">
            {/* Prompt */}
            <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-surface-800 p-8">
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4">Prompt</div>
              <p className="text-surface-300 font-mono text-sm leading-relaxed">
                <span className="text-primary-400 mr-2">{">"}</span>
                {examples[active].prompt}
              </p>
            </div>

            {/* Diagram */}
            <div className="flex-1 p-8 flex items-center justify-center bg-surface-900/50 min-h-[320px]">
              <div className="w-full max-w-lg animate-fade-in" key={active}>
                {examples[active].svg}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
