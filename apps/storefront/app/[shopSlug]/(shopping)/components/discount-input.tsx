'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DiscountInputProps {
  onApply: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>
}

export function DiscountInput({ onApply }: DiscountInputProps) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const result = await onApply(code)
      setStatus({
        type: result.success ? 'success' : 'error',
        message: result.message
      })
      if (result.success) {
        setCode('')
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 rounded-md">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          placeholder="Enter discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleApply} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {status.type && (
        <Alert variant={status.type === 'success' ? 'default' : 'destructive'} className="mt-2">
          {status.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className="text-sm font-semibold">{status.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription className="text-xs">{status.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

