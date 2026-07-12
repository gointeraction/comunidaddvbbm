"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { logoutFirebase } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutFirebase()
    router.push("/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Bienvenido, {profile?.displayName || user?.email}</h2>
        <p className="text-muted-foreground mb-4">
          Nivel actual: {profile?.level || "Cargando..."}
        </p>
        
        <Button onClick={handleLogout} variant="destructive">
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
