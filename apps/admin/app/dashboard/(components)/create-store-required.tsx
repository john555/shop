'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, ArrowRight, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { CREATE_STORE_PAGE_LINK } from '@/common/constants';

export function CreateStoreRequired() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleCreateStore = async () => {
    router.push(CREATE_STORE_PAGE_LINK); // Redirect to store creation page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 pb-16">
      <Card className="w-full max-w-lg overflow-hidden pb-8">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center w-32 h-32">
              <div
                className={`p-6 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200/50'
                } backdrop-blur-sm relative z-10`}
              >
                <Layers className="h-20 w-20 text-emerald-500" />
              </div>
            </div>
          </motion.div>
        </div>
        <CardContent className="pt-8 pb-8 px-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <Store className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Create Your Store</h1>
            <p className="text-muted-foreground mb-6">
              To access the dashboard and start managing your e-commerce
              business, you need to create a store first.
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={handleCreateStore}
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 text-lg py-6"
            >
              Create Your Store
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
