'use client'

import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DarkModeSwitcher(props: { className?: string }) {
  const [darkMode, setDarkMode] = useState<boolean>()
  const handleClickMoon = () => {
    window.document.documentElement.classList.add('dark')
    setDarkMode(true)
  }
  const handleClickSun = () => {
    window.document.documentElement.classList.remove('dark')
    setDarkMode(false)
  }

  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)

    if (isDark) {
      handleClickMoon()
    } else {
      handleClickSun()
    }
  }, [])

  return (
    <div className={props.className}>
      <button
        className={darkMode ? '' : 'text-yellow-500'}
        onClick={handleClickSun}
      >
        <Sun />
      </button>
      <button
        className={darkMode ? 'text-yellow-500' : ''}
        onClick={handleClickMoon}
      >
        <Moon />
      </button>
    </div>
  )
}
