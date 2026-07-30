"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
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
              Contact <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Authorities</span>
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Reach out directly to department heads and local government officials
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Form */}
            <Card className="border-border lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Send a Message
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your message will be forwarded to the relevant authority
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                      <CheckCircle2 className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Message Sent Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Your message has been forwarded to the appropriate department. Expect a response within 2-3 business days.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input id="name" placeholder="Your full name" required className="bg-background" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required className="bg-background" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone" className="text-foreground">Phone</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-background" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="department" className="text-foreground">Department</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mayor">{"Mayor's Office"}</SelectItem>
                            <SelectItem value="public-works">Public Works</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="water">Water Authority</SelectItem>
                            <SelectItem value="parks">Parks & Recreation</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="subject" className="text-foreground">Subject</Label>
                      <Input id="subject" placeholder="Brief subject of your message" required className="bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message" className="text-foreground">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your detailed message to the authorities..."
                        rows={5}
                        required
                        className="bg-background resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card className="border-border">
                <CardContent className="flex flex-col gap-5 pt-6">
                  <h3 className="font-semibold text-card-foreground">Contact Information</h3>
                  {[
                    { icon: Phone, label: "Emergency Line", value: "+1 (555) 911-0000" },
                    { icon: Phone, label: "General Helpline", value: "+1 (555) 100-0000" },
                    { icon: Mail, label: "Email", value: "support@cpss.gov" },
                    { icon: MapPin, label: "City Hall", value: "100 Civic Center Plaza, Suite 200" },
                    { icon: Clock, label: "Office Hours", value: "Mon-Fri: 8:00 AM - 5:00 PM" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-card-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/[0.02]">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-card-foreground">Department Heads</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "Sarah Johnson", role: "Director of Public Works" },
                      { name: "Michael Chen", role: "Transportation Commissioner" },
                      { name: "Dr. Priya Patel", role: "Water Authority Chief" },
                      { name: "David Williams", role: "Parks & Recreation Director" },
                    ].map((person) => (
                      <div key={person.name} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {person.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.role}</p>
                        </div>
                      </div>
                    ))}
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
