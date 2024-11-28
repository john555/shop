'use client'

import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface CancelledOrderBannerProps {
  orderNumber: string
  cancelDate: string
}

export function CancelledOrderBanner({ orderNumber, cancelDate }: CancelledOrderBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-red-500 dark:bg-red-700 text-white rounded-lg shadow-lg mb-6 overflow-hidden"
    >
      <div className="px-4 py-3 flex items-center">
        <AlertCircle className="h-6 w-6 flex-shrink-0 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">Order Cancelled</h3>
          <p className="text-sm opacity-90">
            Order {orderNumber} was cancelled on {cancelDate}
          </p>
        </div>
      </div>
      <div className="px-4 py-2 bg-red-600 dark:bg-red-800">
        <p className="text-sm">
          If you believe this is an error, please contact our support team immediately.
        </p>
      </div>
    </motion.div>
  )
}

