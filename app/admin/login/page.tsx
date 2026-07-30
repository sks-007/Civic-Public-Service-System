"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, EyeOff, ArrowRight, Shield, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (email === "admin@cpss.gov" && password === "admin123") {
        localStorage.setItem("cpss-admin-auth", "true")
        router.push("/admin")
      } else {
        setError("Invalid credentials. Please check your email and password.")
        setIsLoading(false)
      }
    }, 1000)
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
          <Badge className="w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
            <Lock className="mr-1.5 h-3 w-3" />
            Admin Portal
          </Badge>
          <h1 className="text-balance text-4xl font-bold leading-tight text-primary-foreground">
            Administrative{" "}
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Control Center
            </span>
          </h1>
          <p className="max-w-md text-primary-foreground/70 leading-relaxed">
            Manage complaints, monitor department performance, allocate resources, and oversee the civic service operations from a centralized dashboard.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/50">
          2026 Civic Public Service System - Authorized Personnel Only
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
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cpss.gov"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
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
                {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-semibold text-foreground">Demo credentials:</span>{" "}
                admin@cpss.gov / admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to citizen login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
