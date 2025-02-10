"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle, X, Mail } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewsletterProps {
  buttonColor: string
}

export function Newsletter({ buttonColor }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter a valid email address.')
      return
    }
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email)
    setSubscribed(true)
    setError('')
  }

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-primary/20 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Mail className="w-12 h-12 mx-auto text-primary" />
            </motion.div>
          </div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Stay Connected, Stay Informed
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl mb-8 text-muted-foreground"
          >
            Join our newsletter and be the first to know about our latest products, exclusive offers, and insider tips.
          </motion.p>
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                ref={formRef}
                key="subscribe-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <div className="relative w-full sm:w-96">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background w-full h-14 pl-6 pr-12 rounded-full text-lg"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="group w-full sm:w-auto rounded-full transition-all duration-300 hover:shadow-lg text-lg h-14 px-8" 
                  style={{ backgroundColor: buttonColor, color: 'white' }}
                >
                  Subscribe
                  <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-primary p-8 rounded-lg shadow-lg"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary-foreground" />
                <h3 className="text-3xl font-semibold mb-2 text-primary-foreground">Thank you for subscribing!</h3>
                <p className="text-xl text-primary-foreground">We're excited to share our journey with you. Welcome to our community!</p>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
    </section>
  )
}

