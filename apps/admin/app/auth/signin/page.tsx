"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gql } from '@apollo/client';
import { client } from "@/utils/apollo";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Logo } from "../(components)/logo";

// Define the validation schema using zod
const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});

// Define the SIGNIN_MUTATION
const SIGNIN_MUTATION = gql`
  mutation signin($input: AuthSigninInput!) {
    signin(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

// Define the RESET_PAGE_LINK
const RESET_PAGE_LINK = "/auth/reset";

export default function SigninPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema), // Use zod for validation
  });

  const onSubmit = async (data) => { // Update submit handler
    try {
      await client.mutate({
        mutation: SIGNIN_MUTATION, // Use the SIGNIN_MUTATION
        variables: { input: data }, // Pass the input data
      });
      // Redirect to dashboard
      window.location.href = "/dashboard"; // Redirect to /dashboard
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}> {/* Use handleSubmit */}
        <CardHeader>
          <Logo />
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")} // Register email input
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>} {/* Show error message */}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href={RESET_PAGE_LINK} className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")} // Register password input
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>} {/* Show error message */}
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
