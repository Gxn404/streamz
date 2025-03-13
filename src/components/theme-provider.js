// Suggested code may be subject to a license. Learn more: ~LicenseLog:3553831217.
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props} enableSystem attribute="class">
    {children}
  </NextThemesProvider>
  )
}