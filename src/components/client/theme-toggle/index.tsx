'use client'

import { MoonIcon, SunIcon } from '@/components/ui/native-icons'
import { NativeButton as Button } from '@/components/ui/native-button'

import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()

  const toggleTheme = (): void => {
    if (theme === 'dark') {
      setTheme('light')
    } else setTheme('dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">
        {locale === 'uk' ? 'Змінити тему' : 'Toggle theme'}
      </span>
    </Button>
  )
}
