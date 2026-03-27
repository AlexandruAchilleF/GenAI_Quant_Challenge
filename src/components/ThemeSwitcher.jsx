import { useState, useEffect } from 'react'

const THEMES = [
  { id: 'orange', label: 'Orange', class: '', color: '#c85a3a' },
  { id: 'blue', label: 'Blue', class: 'theme-blue', color: '#3b82f6' },
  { id: 'emerald', label: 'Emerald', class: 'theme-emerald', color: '#10b981' },
]

const STORAGE_KEY = 'diagramai_theme'

export default function ThemeSwitcher() {
  const [active, setActive] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'orange'
    } catch {
      return 'orange'
    }
  })

  // Apply theme class on mount and on change
  useEffect(() => {
    const root = document.documentElement
    // Remove all theme classes
    THEMES.forEach((t) => {
      if (t.class) root.classList.remove(t.class)
    })
    // Add the active one
    const theme = THEMES.find((t) => t.id === active)
    if (theme?.class) root.classList.add(theme.class)
    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, active)
    } catch { /* ignore */ }
  }, [active])

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Theme color">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          title={t.label}
          aria-label={`${t.label} theme`}
          aria-checked={active === t.id}
          role="radio"
          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
            active === t.id
              ? 'border-surface-900 scale-110 shadow-sm'
              : 'border-surface-300 hover:border-surface-400'
          }`}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  )
}
