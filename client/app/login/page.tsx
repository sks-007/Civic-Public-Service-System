"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Demo users for when Supabase is not configured
const demoUsers = [
  { id: 1, email: "user@demo.com", password: "demo123", firstName: "John", lastName: "Doe", phone: "+1234567890", ward: "Ward 1" },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const demoUser = demoUsers.find((u) => u.email === email && u.password === password)
      if (demoUser) {
        const { password: _, ...userResponse } = demoUser
        localStorage.setItem("cpss-user", JSON.stringify(userResponse))
        router.push("/")
        return
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const isSupabaseConfigured =
        supabaseUrl &&
        supabaseKey &&
        !supabaseUrl.includes("your-project-ref")

      if (isSupabaseConfigured) {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(supabaseUrl!, supabaseKey!)
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw new Error(authError.message)
        localStorage.setItem("cpss-user", JSON.stringify(data.user))
        router.push("/")
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.15_200)] p-10 lg:flex relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-foreground/30 to-primary-foreground/10">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary-foreground">CPSS</span>
        </div>
        <div className="relative flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-bold leading-tight text-primary-foreground">
            Empowering Communities Through <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Transparent Governance</span>
          </h1>
          <p className="max-w-md text-primary-foreground/70 leading-relaxed">
            Access public services, submit complaints, track progress, and engage with your local government through our comprehensive civic platform.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/50">
          2026 Civic Public Service System
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CPSS</span>
        </div>

        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your civic services account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="citizen@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
