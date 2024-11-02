'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Layers, ArrowRight, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { SIGNIN_PAGE_LINK, SIGNUP_PAGE_LINK } from '@/common/constants'

interface SignInRequiredProps {
  signInPath?: string
  signUpPath?: string
}

export function SignInRequired({ 
  signInPath = SIGNIN_PAGE_LINK,
  signUpPath = SIGNUP_PAGE_LINK,
}: SignInRequiredProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = () => {
    setIsLoading(true)
    router.push(signInPath)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg overflow-hidden">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center w-32 h-32">
              <div className={`p-6 rounded-full ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200/50'} backdrop-blur-sm relative z-10`}>
                <Layers className="h-20 w-20 text-emerald-500" />
              </div>
            </div>
          </motion.div>
        </div>
        <CardContent className="pt-8 pb-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-center mb-4"
          >
            Welcome Back, Shop Owner
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center text-muted-foreground"
          >
            Sign in to access your exclusive shop management dashboard. Monitor sales, manage inventory, and grow your business with powerful e-commerce tools.
          </motion.p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full"
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 text-lg py-6"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Signing you in...</span>
              ) : (
                <>
                  Sign In to Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full flex justify-center mt-2"
          >
            <Button variant="link" asChild className="text-primary hover:text-primary/80 transition-colors duration-300">
              <Link href={signUpPath} className="flex items-center">
                <ShoppingBag className="mr-1 h-4 w-4" />
                Create Your Own Store
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}