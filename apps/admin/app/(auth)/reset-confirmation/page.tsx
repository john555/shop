'use client'

import Link from 'next/link'
import { Layers, ArrowRight, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { RESET_CONFIRMATION_PAGE_LINK, RESET_PAGE_LINK } from '@/common/constants'

export default function ResetPasswordConfirmationPage() {
  const { theme } = useTheme()

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
        <CardContent className="pt-8 pb-6 px-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              Password Reset Email Sent
            </h1>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 text-lg py-6"
              asChild
            >
              <Link href="/signin">
                Return to Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href={RESET_PAGE_LINK} className="text-primary hover:text-primary/80 hover:underline hover:underline-offset-4 transition-colors duration-300">
              try again
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </div>
  )
}