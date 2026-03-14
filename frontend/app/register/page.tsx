"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Eye, EyeOff, ArrowRight, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ward, setWard] = useState<string>("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      // Supabase anon keys are JWT tokens that start with "eyJ"
      const isValidSupabaseKey = supabaseKey && supabaseKey.startsWith("eyJ")
      const isSupabaseConfigured =
        supabaseUrl && isValidSupabaseKey && !supabaseUrl.includes("your-project-ref")

      if (isSupabaseConfigured) {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(supabaseUrl!, supabaseKey!)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              district: ward,
            }
          }
        })
        if (authError) throw authError
        if (!authData.user) throw new Error("Registration failed. Please try again.")
      } else {
        if (email === "user@demo.com") {
          throw new Error("User with this email already exists")
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "An error occurred during registration")
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
            Join Your Community&apos;s <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Civic Platform</span>
          </h1>
          <p className="max-w-md text-primary-foreground/70 leading-relaxed">
            Register to submit complaints, access public services, track your requests, and be part of transparent governance.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
              Submit and track complaints in real-time
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
              AI-powered image verification for authentic reporting
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
              Direct communication with local authorities
            </div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/50">
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
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Register as a citizen to start using civic services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Account created successfully! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="Rahul" required className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Sharma" required className="bg-background" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="citizen@example.com" required className="bg-background" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="bg-background" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ward" className="text-foreground">Ward / District</Label>
                <Select value={ward} onValueChange={setWard}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ward-1">Ward 1 - Downtown</SelectItem>
                    <SelectItem value="ward-2">Ward 2 - Northside</SelectItem>
                    <SelectItem value="ward-3">Ward 3 - Eastside</SelectItem>
                    <SelectItem value="ward-4">Ward 4 - Westside</SelectItem>
                    <SelectItem value="ward-5">Ward 5 - Southside</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
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
              <Button type="submit" className="w-full gap-2" disabled={isLoading || success}>
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
