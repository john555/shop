'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Layers, LogOut, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from '@/common/hooks/auth';

export function AlreadySignedIn() {
  const { user, signOut } = useCurrentUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/signin")
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-3 text-center pb-2">
        <div className="flex justify-center">
          <Layers className="h-12 w-12 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Already Signed In</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-3 pb-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.imageUrl || ""} alt={`${user?.firstName}${user?.lastName}`} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button className="w-full flex items-center justify-center" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}