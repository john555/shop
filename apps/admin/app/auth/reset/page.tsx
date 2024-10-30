import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "../(components)/logo";
import { SIGNUP_PAGE_LINK } from "../(helpers)/constants";

export default function ResetPasswordPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <Logo />
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
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
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href={SIGNUP_PAGE_LINK} className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
