'use client'

import { useMemo } from 'react'

interface DynamicStylesProps {
  primaryColor: string
  accentColor: string
}

export function DynamicStyles({ primaryColor, accentColor }: DynamicStylesProps) {
  useMemo(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor)
    document.documentElement.style.setProperty('--accent-color', accentColor)
  }, [primaryColor, accentColor])

  return null
}

