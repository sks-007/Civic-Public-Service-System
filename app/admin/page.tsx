"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  FileText,
  ImageIcon,
  Shield,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  Bus,
  Droplets,
  Trees,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  PlusCircle,
} from "lucide-react"

const statsCards = [
  {
    title: "Total Complaints Today",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: FileText,
    description: "vs yesterday",
  },
  {
    title: "Resolved Today",
    value: "31",
    change: "+8%",
    trend: "up",
    icon: CheckCircle2,
    description: "vs yesterday",
  },
  {
    title: "Pending Review",
    value: "16",
    change: "-4%",
    trend: "down",
    icon: Clock,
    description: "vs yesterday",
  },
  {
    title: "Active Officers",
    value: "23",
    change: "0%",
    trend: "up",
    icon: Users,
    description: "on duty now",
  },
]


const categoryStats = [
  { name: "Waste Management", icon: Trash2, count: 12, resolved: 8, color: "text-chart-1" },
  { name: "Transportation", icon: Bus, count: 9, resolved: 5, color: "text-chart-2" },
  { name: "Water & Sewage", icon: Droplets, count: 7, resolved: 6, color: "text-primary" },
  { name: "Parks & Rec", icon: Trees, count: 5, resolved: 4, color: "text-chart-3" },
  { name: "Street Lighting", icon: Lightbulb, count: 14, resolved: 8, color: "text-chart-5" },
]

const statusColors: Record<string, string> = {
  submitted: "bg-chart-5/10 text-chart-5", // Fallback for old data
  Pending: "bg-chart-5/10 text-chart-5",
  "in-progress": "bg-warning/10 text-warning", // Fallback
  "In Progress": "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success", // Fallback
  Resolved: "bg-success/10 text-success",
  assigned: "bg-primary/10 text-primary", // Fallback
  Assigned: "bg-primary/10 text-primary",
  Escalated: "bg-destructive/10 text-destructive",
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground", // Fallback
  Low: "bg-muted text-muted-foreground",
  medium: "bg-chart-5/10 text-chart-5", // Fallback
  Medium: "bg-chart-5/10 text-chart-5",
  high: "bg-warning/10 text-warning", // Fallback
  High: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive", // Fallback
  Critical: "bg-destructive/10 text-destructive",
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false)
  const [newOfficer, setNewOfficer] = useState({ name: "", email: "", phone: "", address: "" })
  const [isAddingOfficer, setIsAddingOfficer] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "" })
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState({ fullname: "", email: "", phone: "", department: "" })
  const [isAddingContact, setIsAddingContact] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/complaints")
      const data = await response.json()
      if (data.success) {
        setComplaints(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem("cpss-admin-auth")
    if (auth !== "true") {
      router.replace("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("cpss-admin-auth")
    router.push("/admin/login")
  }

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingOfficer(true)
    try {
      const response = await fetch("/api/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newOfficer, is_active: true }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || "Failed to add officer")

      setNewOfficer({ name: "", email: "", phone: "", address: "" })
      setIsAddOfficerOpen(false)
      alert("Officer added successfully!")
    } catch (error: any) {
      console.error("Error adding officer:", error)
      alert(error.message || "Failed to add officer")
    } finally {
      setIsAddingOfficer(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingCategory(true)
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.name }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || "Failed to add category")

      setNewCategory({ name: "" })
      setIsAddCategoryOpen(false)
      alert("Category added successfully!")
    } catch (error: any) {
      console.error("Error adding category:", error)
      alert(error.message || "Failed to add category")
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingContact(true)
    try {
      const response = await fetch("/api/authority-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newContact }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || "Failed to add contact")

      setNewContact({ fullname: "", email: "", phone: "", department: "" })
      setIsAddContactOpen(false)
      alert("Contact added successfully!")
    } catch (error: any) {
      console.error("Error adding contact:", error)
      alert(error.message || "Failed to add contact")
    } finally {
      setIsAddingContact(false)
    }
  }

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  const filteredComplaints = statusFilter === "all"
    ? complaints
    : complaints.filter((c) => c.status === statusFilter)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-primary px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Admin Dashboard</h1>
                <p className="mt-1 text-primary-foreground/70">Complaint management and analytics overview</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
                  <div className="mr-1.5 h-2 w-2 rounded-full bg-success animate-pulse" />
                  Live
                </Badge>

                <Dialog open={isAddOfficerOpen} onOpenChange={setIsAddOfficerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Officer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddOfficer}>
                      <DialogHeader>
                        <DialogTitle>Add New Officer</DialogTitle>
                        <DialogDescription>
                          Enter the details of the new officer. They will be immediately available for assignment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input
                            id="name"
                            required
                            value={newOfficer.name}
                            onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={newOfficer.email}
                            onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">Phone</Label>
                          <Input
                            id="phone"
                            required
                            value={newOfficer.phone}
                            onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">Address</Label>
                          <Input
                            id="address"
                            required
                            value={newOfficer.address}
                            onChange={(e) => setNewOfficer({ ...newOfficer, address: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isAddingOfficer}>
                          {isAddingOfficer ? "Adding..." : "Save Officer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddContact}>
                      <DialogHeader>
                        <DialogTitle>Add Authority Contact</DialogTitle>
                        <DialogDescription>
                          Enter the details for a new authority contact.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-name" className="text-right">Name</Label>
                          <Input
                            id="contact-name"
                            required
                            value={newContact.fullname}
                            onChange={(e) => setNewContact({ ...newContact, fullname: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-email" className="text-right">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            required
                            value={newContact.email}
                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-phone" className="text-right">Phone</Label>
                          <Input
                            id="contact-phone"
                            required
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-dept" className="text-right">Dept.</Label>
                          <Input
                            id="contact-dept"
                            required
                            value={newContact.department}
                            onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isAddingContact}>
                          {isAddingContact ? "Adding..." : "Save Contact"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddContact}>
                      <DialogHeader>
                        <DialogTitle>Add Authority Contact</DialogTitle>
                        <DialogDescription>
                          Enter the details for a new authority contact.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-name" className="text-right">Name</Label>
                          <Input
                            id="contact-name"
                            required
                            value={newContact.fullname}
                            onChange={(e) => setNewContact({ ...newContact, fullname: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-email" className="text-right">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            required
                            value={newContact.email}
                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-phone" className="text-right">Phone</Label>
                          <Input
                            id="contact-phone"
                            required
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact-dept" className="text-right">Dept.</Label>
                          <Input
                            id="contact-dept"
                            required
                            value={newContact.department}
                            onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isAddingContact}>
                          {isAddingContact ? "Adding..." : "Save Contact"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <Card key={stat.title} className="border-border">
                <CardContent className="flex items-start justify-between pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                      <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.description}</span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Breakdown & Quick Actions */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Complaints by Category
                </CardTitle>
                <CardDescription className="text-muted-foreground">{"Today's breakdown across service departments"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {categoryStats.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <cat.icon className={`h-4 w-4 ${cat.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{cat.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {cat.resolved}/{cat.count} resolved
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(cat.resolved / cat.count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                  <span className="font-bold text-foreground">2.3 days</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Total Funds Allocated</span>
                  <span className="font-mono font-bold text-foreground">$47,200</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Images Verified</span>
                  <span className="font-bold text-foreground">41/47</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Deepfakes Detected</span>
                  <span className="font-bold text-destructive">3</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <span className="text-sm text-muted-foreground">Citizen Satisfaction</span>
                  <span className="font-bold text-success">96.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complaints Table */}
          <Card className="mt-8 border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    All Complaints
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Manage and review all submitted complaints</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Complaint</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          #{complaint.id.toString().slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="truncate text-sm font-medium text-foreground">{complaint.description}</p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {complaint.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const cat = categoryStats.find(c => c.name === complaint.category);
                              const Icon = cat ? cat.icon : FileText;
                              return <Icon className="h-3.5 w-3.5 text-muted-foreground" />;
                            })()}
                            <span className="text-xs text-foreground">{complaint.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${priorityColors[complaint.priority]}`}>
                            {complaint.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${statusColors[complaint.status]}`}>
                            {complaint.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {complaint.has_image ? (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              {complaint.image_verified ? (
                                <Shield className="h-3.5 w-3.5 text-success" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-warning" />
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs ${!complaint.officer ? "text-destructive" : "text-foreground"}`}>
                            {complaint.officer || "Unassigned"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={complaint.progress} className="h-1.5 w-16" />
                            <span className="text-xs text-muted-foreground">{complaint.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
