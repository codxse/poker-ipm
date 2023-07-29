'use client'

import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DarkModeSwitcher(props: { className?: string }) {
  const [darkMode, setDarkMode] = useState<boolean>()

  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)

    if (isDark) {
      window.document.documentElement.classList.add('dark')
    } else {
      window.document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div className={props.className}>
      <button
        className={darkMode ? '' : 'text-yellow-500'}
        onClick={() => window.document.documentElement.classList.remove('dark')}
      >
        <Sun />
      </button>
      <button
        className={darkMode ? 'text-yellow-500' : ''}
        onClick={() => window.document.documentElement.classList.add('dark')}
      >
        <Moon />
      </button>
    </div>
  )
}
