"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ThumbsUp,
  MapPin,
  Calendar,
  Trash2,
  Bus,
  Droplets,
  Trees,
  Lightbulb,
  ArrowUpDown,
  Filter,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

type Complaint = {
  id: string
  title: string
  description: string
  location: string
  department: string
  departmentIcon: typeof Trash2
  date: string
  status: "submitted" | "assigned" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high" | "critical"
  upvotes: number
  citizen: string
}

const allComplaints: Complaint[] = [
  {
    id: "CMP-2026-0847",
    title: "Broken Streetlight on Oak Avenue",
    description: "The streetlight at 142 Oak Ave has been non-functional for over a week, creating a dark zone that poses safety risks for pedestrians and drivers at night.",
    location: "142 Oak Ave, Ward 3",
    department: "Street Lighting",
    departmentIcon: Lightbulb,
    date: "2026-02-28",
    status: "in-progress",
    priority: "medium",
    upvotes: 24,
    citizen: "John C.",
  },
  {
    id: "CMP-2026-0848",
    title: "Overflowing dumpster near school",
    description: "Large dumpster near Lincoln Elementary School has been overflowing for 3 days. Waste is spilling onto the sidewalk and causing a foul odor affecting students and nearby residents.",
    location: "300 School Rd, Ward 1",
    department: "Waste Management",
    departmentIcon: Trash2,
    date: "2026-02-28",
    status: "submitted",
    priority: "high",
    upvotes: 47,
    citizen: "Sarah M.",
  },
  {
    id: "CMP-2026-0849",
    title: "Dangerous pothole on Highway 9",
    description: "A large and deep pothole has formed on Highway 9 near the intersection with Elm St. Multiple vehicles have been damaged and it is a serious hazard especially at night.",
    location: "Highway 9, Ward 4",
    department: "Transportation",
    departmentIcon: Bus,
    date: "2026-02-28",
    status: "assigned",
    priority: "high",
    upvotes: 63,
    citizen: "Michael J.",
  },
  {
    id: "CMP-2026-0850",
    title: "Sewage overflow on Pine Street",
    description: "Raw sewage is overflowing from a manhole on Pine Street, flooding the road and nearby residential yards. The smell is unbearable and this is a health hazard.",
    location: "89 Pine St, Ward 2",
    department: "Water & Sewage",
    departmentIcon: Droplets,
    date: "2026-02-27",
    status: "in-progress",
    priority: "critical",
    upvotes: 91,
    citizen: "Emily C.",
  },
  {
    id: "CMP-2026-0851",
    title: "Broken playground equipment at Central Park",
    description: "The main swing set and slide at Central Park have broken chains and sharp exposed metal edges. Several children have gotten minor injuries. Needs immediate repair.",
    location: "Central Park, Ward 5",
    department: "Parks & Recreation",
    departmentIcon: Trees,
    date: "2026-02-27",
    status: "resolved",
    priority: "medium",
    upvotes: 35,
    citizen: "David B.",
  },
  {
    id: "CMP-2026-0852",
    title: "Dark zone near residential area",
    description: "Multiple streetlights on Sunset Blvd between #200-300 are out, creating a large dark zone. Residents feel unsafe walking at night and there have been reports of suspicious activity.",
    location: "250 Sunset Blvd, Ward 3",
    department: "Street Lighting",
    departmentIcon: Lightbulb,
    date: "2026-02-28",
    status: "submitted",
    priority: "low",
    upvotes: 12,
    citizen: "Priya P.",
  },
  {
    id: "CMP-2026-0853",
    title: "Illegal dumping near river bank",
    description: "Construction debris and household waste are being illegally dumped near the river bank on Mill Road. This is causing water contamination and environmental damage.",
    location: "Mill Road, Ward 2",
    department: "Waste Management",
    departmentIcon: Trash2,
    date: "2026-02-26",
    status: "assigned",
    priority: "high",
    upvotes: 56,
    citizen: "Robert K.",
  },
  {
    id: "CMP-2026-0854",
    title: "Bus stop shelter damaged",
    description: "The bus shelter at the corner of Main St and 5th Ave was hit by a vehicle. The glass panels are shattered and the bench is broken, leaving commuters exposed to weather.",
    location: "Main St & 5th Ave, Ward 1",
    department: "Transportation",
    departmentIcon: Bus,
    date: "2026-02-26",
    status: "in-progress",
    priority: "medium",
    upvotes: 29,
    citizen: "Linda T.",
  },
  {
    id: "CMP-2026-0855",
    title: "Burst water main on Cedar Lane",
    description: "A water main has burst on Cedar Lane causing flooding on the street and water pressure drops for nearby homes. The road has become impassable for vehicles.",
    location: "Cedar Lane, Ward 4",
    department: "Water & Sewage",
    departmentIcon: Droplets,
    date: "2026-02-27",
    status: "in-progress",
    priority: "critical",
    upvotes: 78,
    citizen: "James W.",
  },
  {
    id: "CMP-2026-0856",
    title: "Overgrown vegetation blocking pathway",
    description: "The walking pathway in Riverside Park is completely blocked by overgrown bushes and fallen branches. Joggers and walkers have to detour through the main road.",
    location: "Riverside Park, Ward 5",
    department: "Parks & Recreation",
    departmentIcon: Trees,
    date: "2026-02-25",
    status: "submitted",
    priority: "low",
    upvotes: 18,
    citizen: "Anna S.",
  },
]

const departments = [
  "All Departments",
  "Waste Management",
  "Transportation",
  "Water & Sewage",
  "Parks & Recreation",
  "Street Lighting",
]

const statusColors: Record<string, string> = {
  submitted: "bg-chart-5/10 text-chart-5",
  assigned: "bg-primary/10 text-primary",
  "in-progress": "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-5/10 text-chart-5",
  high: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
}

type SortOption = "upvotes" | "newest" | "priority"

const priorityOrder: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export default function ComplaintsPage() {
  const [department, setDepartment] = useState("All Departments")
  const [sortBy, setSortBy] = useState<SortOption>("upvotes")
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())
  const [complaints, setComplaints] = useState(allComplaints)

  const toggleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            upvotes: upvotedIds.has(id) ? c.upvotes - 1 : c.upvotes + 1,
          }
        }
        return c
      })
    )
  }

  const filtered = useMemo(() => {
    let result = complaints
    if (department !== "All Departments") {
      result = result.filter((c) => c.department === department)
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "upvotes") return b.upvotes - a.upvotes
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    return result
  }, [complaints, department, sortBy])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.15_200)] px-4 py-16">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
              Community{" "}
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Complaints
              </span>
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Browse all reported issues across departments and upvote to increase their priority
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Info banner */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Your vote matters</p>
              <p className="text-xs text-muted-foreground">
                Upvoting a complaint increases its priority, helping authorities address the most impactful issues first. Each citizen can upvote a complaint once.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1.5">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartment(dept)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      department === dept
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-44 bg-background">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="priority">Highest Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <p className="mb-4 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> complaints
            {department !== "All Departments" && (
              <> in <span className="font-semibold text-foreground">{department}</span></>
            )}
          </p>

          {/* Complaint Cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No complaints found for this department</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((complaint) => {
                const isUpvoted = upvotedIds.has(complaint.id)
                return (
                  <Card
                    key={complaint.id}
                    className="border-border transition-shadow hover:shadow-md"
                  >
                    <CardContent className="flex flex-col gap-3 pt-5">
                      {/* Header badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <complaint.departmentIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{complaint.department}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">{complaint.id}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold leading-snug text-card-foreground">
                        {complaint.title}
                      </h3>

                      {/* Description */}
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {complaint.description}
                      </p>

                      {/* Location & Date */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{complaint.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{new Date(complaint.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>

                      {/* Status & Priority */}
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${statusColors[complaint.status]}`}>
                          {complaint.status.replace("-", " ")}
                        </Badge>
                        <Badge className={`text-xs ${priorityColors[complaint.priority]}`}>
                          {complaint.priority}
                        </Badge>
                      </div>

                      {/* Upvote Row */}
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs text-muted-foreground">
                          Reported by {complaint.citizen}
                        </span>
                        <Button
                          variant={isUpvoted ? "default" : "outline"}
                          size="sm"
                          className={`gap-1.5 ${isUpvoted ? "" : "text-muted-foreground"}`}
                          onClick={() => toggleUpvote(complaint.id)}
                        >
                          <ThumbsUp className={`h-3.5 w-3.5 ${isUpvoted ? "fill-current" : ""}`} />
                          <span className="font-semibold">{complaint.upvotes}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
