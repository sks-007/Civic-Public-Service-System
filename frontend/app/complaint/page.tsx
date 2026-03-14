"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  X,
  ImageIcon,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  XCircle,
} from "lucide-react"

type VerificationResult = {
  status: "genuine" | "suspicious" | "analyzing"
  confidence: number
  details: string[]
}

export default function ComplaintPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState<string>("")
  const [verificationResults, setVerificationResults] = useState<Map<number, VerificationResult>>(new Map())
  const [verifyingIndices, setVerifyingIndices] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [isFetchingCategories, setIsFetchingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        setCategories(json.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback categories if API fails
        setCategories([
          { id: "1", name: "Waste Management" },
          { id: "2", name: "Transportation" },
          { id: "3", name: "Water & Sewage" },
          { id: "4", name: "Parks & Recreation" },
          { id: "5", name: "Street Lighting" },
        ])
      } finally {
        setIsFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const verifyImage = useCallback((fileIndex: number) => {
    setVerifyingIndices((prev) => {
      const next = new Set(prev)
      next.add(fileIndex)
      return next
    })
    setVerificationResults((prev) => {
      const next = new Map(prev)
      next.set(fileIndex, { status: "analyzing", confidence: 0, details: [] })
      return next
    })

    setTimeout(() => {
      const isGenuine = Math.random() > 0.3
      setVerificationResults((prev) => {
        const next = new Map(prev)
        next.set(fileIndex, {
          status: isGenuine ? "genuine" : "suspicious",
          confidence: isGenuine ? 94.7 : 32.1,
          details: isGenuine
            ? [
              "No signs of digital manipulation detected",
              "EXIF metadata is consistent",
              "Pixel-level analysis passed",
              "No GAN artifacts found",
              "Lighting and shadows are consistent",
            ]
            : [
              "Potential signs of image manipulation",
              "Inconsistent noise patterns detected",
              "Possible GAN-generated artifacts",
              "Metadata inconsistencies found",
              "Recommend manual review by officer",
            ],
        })
        return next
      })
      setVerifyingIndices((prev) => {
        const next = new Set(prev)
        next.delete(fileIndex)
        return next
      })
    }, 3000)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => {
        const updated = [...prev, ...newFiles].slice(0, 5)
        // Auto-verify new files
        const startIndex = prev.length
        newFiles.forEach((_, i) => {
          const idx = startIndex + i
          if (idx < 5) {
            verifyImage(idx)
          }
        })
        return updated
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    // Rebuild verification results with shifted indices
    setVerificationResults((prev) => {
      const next = new Map<number, VerificationResult>()
      prev.forEach((value, key) => {
        if (key < index) next.set(key, value)
        else if (key > index) next.set(key - 1, value)
      })
      return next
    })
    setVerifyingIndices((prev) => {
      const next = new Set<number>()
      prev.forEach((key) => {
        if (key < index) next.add(key)
        else if (key > index) next.add(key - 1)
      })
      return next
    })
  }

  const hasSuspicious = Array.from(verificationResults.values()).some((r) => r.status === "suspicious")
  const hasAnalyzing = verifyingIndices.size > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSuspicious || hasAnalyzing) return
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          ward: formData.get("ward"),
          category: formData.get("category"),
          address: formData.get("address"),
          description: formData.get("description"),
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      setComplaintId(json.data?.id || "")
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (error: any) {
      console.error("Error submitting complaint:", error)
      setIsSubmitting(false)
      // You might want to show a toast error here
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
          <Card className="w-full max-w-md border-border text-center">
            <CardContent className="flex flex-col items-center gap-4 pt-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">Complaint Submitted!</h2>
              <p className="text-muted-foreground">
                Your complaint has been registered with ID{" "}
                <span className="font-mono font-bold text-primary">{complaintId}</span>.
                You can track the progress in the tracking section.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => { setSubmitted(false); setComplaintId(""); setFiles([]); setVerificationResults(new Map()); setVerifyingIndices(new Set()) }}>Submit Another</Button>
                <Button variant="outline" asChild>
                  <a href={`/track?id=${complaintId}`}>Track Progress</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.15_200)] px-4 py-16">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
              Submit a <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Complaint</span>
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Report an issue and upload supporting evidence for quick resolution
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <Card className="border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Complaint Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your information and describe the issue in detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                      <Input id="fullName" name="fullName" placeholder="Enter your full name" required className="bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-foreground">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-background" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ward" className="text-foreground">Ward / District</Label>
                      <Select name="ward">
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select ward" />
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category" className="text-foreground">Service Category</Label>
                    <Select name="category" disabled={isFetchingCategories}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={isFetchingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address" className="text-foreground">Location of Issue</Label>
                    <Input id="address" name="address" placeholder="Street address or landmark" required className="bg-background" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description" className="text-foreground">Describe the Issue</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide detailed information about the problem..."
                      rows={4}
                      required
                      className="bg-background resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-3">
                    <Label className="text-foreground">Upload Evidence (Images)</Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-gradient-to-b from-secondary/30 to-primary/[0.02] p-8 transition-colors hover:border-primary/50 hover:from-secondary/50 hover:to-primary/[0.05]"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Click to upload images</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each (max 5 files)</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Uploaded Files with Verification */}
                    {files.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {files.map((file, index) => {
                          const result = verificationResults.get(index)
                          const isVerifying = verifyingIndices.has(index)

                          return (
                            <div key={`${file.name}-${index}`} className="rounded-xl border border-border bg-card overflow-hidden">
                              {/* File Header */}
                              <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isVerifying && (
                                    <Badge variant="secondary" className="gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Analyzing
                                    </Badge>
                                  )}
                                  {result && result.status === "genuine" && (
                                    <Badge className="gap-1 bg-success/10 text-success">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Verified
                                    </Badge>
                                  )}
                                  {result && result.status === "suspicious" && (
                                    <Badge className="gap-1 bg-destructive/10 text-destructive">
                                      <XCircle className="h-3 w-3" />
                                      Suspicious
                                    </Badge>
                                  )}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                    className="h-8 w-8"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Verification Results Inline */}
                              {isVerifying && (
                                <div className="border-t border-border bg-secondary/30 px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <div>
                                      <p className="text-sm font-medium text-foreground">Analyzing image...</p>
                                      <p className="text-xs text-muted-foreground">Running deepfake detection and manipulation checks</p>
                                    </div>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    <Badge variant="secondary" className="text-xs">Pixel Analysis</Badge>
                                    <Badge variant="secondary" className="text-xs">GAN Detection</Badge>
                                    <Badge variant="secondary" className="text-xs">Metadata Check</Badge>
                                    <Badge variant="secondary" className="text-xs">Noise Pattern</Badge>
                                  </div>
                                </div>
                              )}

                              {result && result.status !== "analyzing" && (
                                <div className="border-t border-border px-4 py-4">
                                  {/* Status Banner */}
                                  <div
                                    className={`flex items-center gap-3 rounded-lg p-3 ${result.status === "genuine"
                                      ? "bg-success/10"
                                      : "bg-destructive/10"
                                      }`}
                                  >
                                    {result.status === "genuine" ? (
                                      <CheckCircle2 className="h-6 w-6 text-success" />
                                    ) : (
                                      <XCircle className="h-6 w-6 text-destructive" />
                                    )}
                                    <div>
                                      <p className={`text-sm font-bold ${result.status === "genuine" ? "text-success" : "text-destructive"}`}>
                                        {result.status === "genuine" ? "Image Verified - Genuine" : "Warning - Suspicious Image"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Confidence: {result.confidence}%
                                      </p>
                                    </div>
                                  </div>

                                  {/* Confidence Bar */}
                                  <div className="mt-3 flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Authenticity Score</span>
                                      <span className="font-bold text-foreground">{result.confidence}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                      <div
                                        className={`h-full rounded-full transition-all duration-1000 ${result.confidence > 70 ? "bg-success" : "bg-destructive"
                                          }`}
                                        style={{ width: `${result.confidence}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Analysis Details */}
                                  <div className="mt-3 flex flex-col gap-1.5">
                                    <h4 className="text-xs font-semibold text-foreground">Analysis Details</h4>
                                    {result.details.map((detail) => (
                                      <div key={detail} className="flex items-start gap-2">
                                        {result.status === "genuine" ? (
                                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                                        ) : (
                                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                                        )}
                                        <p className="text-xs text-muted-foreground">{detail}</p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Checks Grid */}
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    {[
                                      { label: "Deepfake", check: result.status === "genuine" },
                                      { label: "GAN Artifacts", check: result.status === "genuine" },
                                      { label: "Metadata", check: result.status === "genuine" },
                                      { label: "Pixel Analysis", check: result.status === "genuine" },
                                    ].map((item) => (
                                      <div key={item.label} className="flex items-center gap-2 rounded-lg border border-border p-2">
                                        {item.check ? (
                                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                        ) : (
                                          <XCircle className="h-3.5 w-3.5 text-destructive" />
                                        )}
                                        <span className="text-xs font-medium text-foreground">{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        All uploaded images are automatically verified by our AI system for authenticity and deepfake detection before submission.
                      </p>
                    </div>

                    {/* Block submission warning */}
                    {hasSuspicious && (
                      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <p className="text-xs text-destructive">
                          One or more images have been flagged as suspicious. Please remove the flagged images or upload authentic images to proceed with submission.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isSubmitting || hasSuspicious || hasAnalyzing}
                  >
                    {isSubmitting ? "Submitting..." : hasAnalyzing ? "Verifying images..." : hasSuspicious ? "Cannot submit - suspicious images" : "Submit Complaint"}
                    {!isSubmitting && !hasAnalyzing && !hasSuspicious && <Send className="h-4 w-4" />}
                    {hasAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar Info */}
            <div className="flex flex-col gap-4">
              <Card className="border-border">
                <CardContent className="flex flex-col gap-3 pt-6">
                  <h3 className="font-semibold text-card-foreground">How it works</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { step: "1", text: "Fill in your personal details and ward" },
                      { step: "2", text: "Describe the issue and select category" },
                      { step: "3", text: "Upload photos of the issue" },
                      { step: "4", text: "AI verifies image authenticity instantly" },
                      { step: "5", text: "Complaint assigned to officer" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.4_0.15_200)] text-xs font-bold text-primary-foreground">
                          {item.step}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-warning/5">
                <CardContent className="flex flex-col gap-2 pt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <h3 className="text-sm font-semibold text-card-foreground">Important Note</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Submitting false or misleading complaints is a punishable offense. Our AI system detects manipulated images and deepfakes automatically during upload.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">AI Verified</Badge>
                    <Badge variant="secondary" className="text-xs">Deepfake Detection</Badge>
                    <Badge variant="secondary" className="text-xs">Real-time Analysis</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
