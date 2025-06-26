"use client"

import { useOptionalAuth } from "@/lib/auth"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

interface PublicContentWrapperProps {
  children: ReactNode
  requireAuth?: boolean
  authMessage?: string
}

export function PublicContentWrapper({ 
  children, 
  requireAuth = false,
  authMessage = "この機能を利用するにはログインが必要です"
}: PublicContentWrapperProps) {
  const { isAuthenticated } = useOptionalAuth()

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <p className="text-gray-600">{authMessage}</p>
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              ログインする
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}