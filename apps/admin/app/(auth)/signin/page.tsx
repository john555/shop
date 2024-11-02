'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gql } from '@apollo/client';
import { client } from '@/common/apollo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Eye, EyeOff, Layers } from 'lucide-react';
import { DASHBOARD_PAGE_LINK, RESET_PAGE_LINK } from '@/common/constants';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useRouter } from 'next/router';

const schema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const SIGNIN_MUTATION = gql`
  mutation signin($input: AuthSigninInput!) {
    signin(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export default function SigninPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await client.mutate({
        mutation: SIGNIN_MUTATION,
        variables: { input: data },
      });
      setIsLoading(true);
      window.location.href = DASHBOARD_PAGE_LINK;
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

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
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-center mb-6"
          >
            Sign In to Your Shop
          </motion.h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/reset" className="text-sm text-primary hover:text-primary/80 transition-colors duration-300">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing In...</span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full flex justify-center mt-2 text-sm"
          >
            <Link href="/signup" className="text-primary hover:text-primary/80 hover:underline hover:underline-offset-4 transition-colors duration-300">
              Create an Account
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}
