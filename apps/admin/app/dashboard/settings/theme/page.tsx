'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>Customize your app appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Color Theme</Label>
          <div className="flex space-x-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setTheme('light')}
            >
              <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setTheme('dark')}
            >
              <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}