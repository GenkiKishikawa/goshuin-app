import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRequireAuth(redirectUrl = "/login") {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push(redirectUrl)
  }, [session, status, router, redirectUrl])

  return { session, status }
}

export function useOptionalAuth() {
  const { data: session, status } = useSession()
  return { session, status, isAuthenticated: !!session }
}