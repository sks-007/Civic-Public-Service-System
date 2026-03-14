"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  CheckCircle2,
  Clock,
  User,
  DollarSign,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  ArrowRight,
  Truck,
  Wrench,
} from "lucide-react"

type ComplaintData = {
  id: string
  title: string
  category: string
  status: "submitted" | "assigned" | "in-progress" | "resolved"
  progress: number
  submittedDate: string
  location: string
  description: string
  officer: {
    name: string
    designation: string
    phone: string
  }
  funds: {
    allocated: number
    spent: number
  }
  timeline: {
    date: string
    event: string
    status: "completed" | "current" | "pending"
  }[]
}


const statusColors = {
  submitted: "bg-chart-5/10 text-chart-5",
  Pending: "bg-chart-5/10 text-chart-5",
  assigned: "bg-primary/10 text-primary",
  Assigned: "bg-primary/10 text-primary",
  "in-progress": "bg-warning/10 text-warning",
  "In Progress": "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  Resolved: "bg-success/10 text-success",
}

export default function TrackPage() {
  const [searchId, setSearchId] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [complaints, setComplaints] = useState<any[]>([])

  useEffect(() => {
    // Optionally fetch all user complaints if they are logged in
    // For now, we only show search results
  }, [])

  const handleSearch = async () => {
    if (!searchId) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .or(`id.eq.${searchId},id.ilike.%${searchId}%`)
        .single()

      if (error) {
        console.error("Error finding complaint:", error)
        setSelectedComplaint(null)
      } else {
        setSelectedComplaint(data)
        setShowAll(false)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-primary px-4 py-16">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
              Track Your Complaints
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Monitor complaint progress, assigned officers, and fund allocation
            </p>
            {/* Search Bar */}
            <div className="mx-auto mt-8 flex max-w-md gap-2">
              <Input
                placeholder="Enter complaint ID (e.g. CMP-2026-0847)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border-primary-foreground/20"
              />
              <Button variant="secondary" onClick={handleSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Track
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Selected Complaint Detail */}
          {selectedComplaint && !showAll && (
            <div className="mb-8">
              <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => {
                  setShowAll(true)
                  setSelectedComplaint(null)
                }}
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to all complaints
              </Button>
              <ComplaintDetail complaint={selectedComplaint} />
            </div>
          )}

          {/* All Complaints */}
          {showAll && (
            <>
              <h2 className="mb-6 text-xl font-bold text-foreground">Your Recent Complaints</h2>
              <div className="flex flex-col gap-4">
                {complaints.length > 0 ? complaints.map((complaint) => (
                  <Card
                    key={complaint.id}
                    className="cursor-pointer border-border transition-all hover:border-primary/30 hover:shadow-md"
                    onClick={() => {
                      setSelectedComplaint(complaint)
                      setShowAll(false)
                    }}
                  >
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-primary">#{complaint.id.toString().slice(0, 8)}</span>
                          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                            {complaint.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-card-foreground">{complaint.category}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {complaint.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-foreground">{complaint.progress}%</span>
                        <Progress value={complaint.progress} className="h-2 w-32" />
                        <span className="text-xs text-muted-foreground">{complaint.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-center text-muted-foreground py-12">Search for a complaint by ID to see its status</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ComplaintDetail({ complaint }: { complaint: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Info */}
      <Card className="border-border lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-bold text-primary">#{complaint.id.toString().slice(0, 8)}</span>
                <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                  {complaint.status.replace("-", " ")}
                </Badge>
              </div>
              <CardTitle className="text-xl text-card-foreground">{complaint.category}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">{complaint.location}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-bold text-foreground">{complaint.progress}%</span>
            </div>
            <Progress value={complaint.progress} className="h-3" />
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{complaint.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium text-foreground">{new Date(complaint.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Description</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{complaint.description}</p>
          </div>

          {/* Timeline */}
          {/* Timeline (Simplified for now) */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Progress Timeline</h4>
            <div className="flex flex-col gap-0">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <div className="h-8 w-0.5 bg-success/30" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-foreground">Complaint submitted</p>
                  <p className="text-xs text-muted-foreground">{new Date(complaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${complaint.progress > 0 ? "bg-primary/10" : "bg-secondary"}`}>
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-foreground">{complaint.status.replace("-", " ")}</p>
                  <p className="text-xs text-muted-foreground">Current status</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        {/* Officer */}
        <Card className="border-border">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Assigned Officer</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {complaint.officer ? complaint.officer[0] : "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{complaint.officer || "Unassigned"}</p>
                <p className="text-xs text-muted-foreground">{complaint.officer_designation || "Pending Assignment"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funds */}
        <Card className="border-border">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Fund Allocation</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Allocated</span>
                <span className="font-mono text-sm font-bold text-foreground">
                  ${(complaint.funds_allocated || 0).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Spending Progress</span>
              </div>
              <Progress
                value={complaint.progress}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="border-border bg-primary/5">
          <CardContent className="flex flex-col gap-2 pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Need Help?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If your complaint is not progressing, contact the assigned officer directly or use our AI Assistant for guidance.
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <a href="/ai-chatbot">AI Assistant</a>
              </Button>
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <a href="/contact">Contact</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
