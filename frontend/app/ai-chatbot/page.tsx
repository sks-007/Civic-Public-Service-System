"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  Shield,
  CheckCircle2,
  Navigation,
  Trash2,
  HelpCircle,
} from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { label: "How to submit a complaint?", icon: HelpCircle },
  { label: "Track my complaint status", icon: Navigation },
  { label: "Find nearest service center", icon: Navigation },
  { label: "Report a streetlight outage", icon: Trash2 },
]

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Civic AI Assistant. I can help you navigate the system, answer questions about public services, and guide you through submitting complaints. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true)
    setTimeout(() => {
      let response = ""
      const lower = userMessage.toLowerCase()
      if (lower.includes("complaint") && lower.includes("submit")) {
        response = "To submit a complaint:\n\n1. Go to the 'Submit Complaint' page from the navigation\n2. Fill in your personal details (name, email, phone)\n3. Select the service category (Waste, Transportation, etc.)\n4. Describe the issue in detail\n5. Upload photos as evidence\n6. Our AI will verify the images automatically right in the form\n7. Click submit and you'll receive a tracking ID\n\nWould you like me to take you to the complaint form?"
      } else if (lower.includes("track")) {
        response = "You can track your complaint progress by:\n\n1. Going to 'Track Complaints' in the navigation\n2. Enter your complaint ID (e.g., #CMP-2026-0847)\n3. You'll see the current status, assigned officer, allocated funds, and timeline\n\nWould you like to check a specific complaint?"
      } else if (lower.includes("service") || lower.includes("center")) {
        response = "We offer 5 main service categories:\n\n- Waste Management - Public Works Dept, 200 Civic Center Dr\n- Transportation - Transit Authority, 150 Transit Blvd\n- Water & Sewage - Water Authority, 300 Reservoir Rd\n- Parks & Recreation - Parks Dept, 75 Greenway Ave\n- Street Lighting - Electrical Services, 100 Power Lane\n\nEach department has dedicated staff ready to help. Which service do you need?"
      } else if (lower.includes("streetlight") || lower.includes("light")) {
        response = "To report a streetlight outage:\n\n1. Go to Submit Complaint\n2. Select 'Street Lighting' as the category\n3. Provide the exact location or nearest address\n4. Upload a photo of the dark area if possible\n5. Our team typically responds within 24-48 hours\n\nThe Electrical Services department handles all street lighting issues at 100 Power Lane."
      } else {
        response = "Thank you for your message. I can help you with:\n\n- Navigating the civic services platform\n- Submitting and tracking complaints\n- Finding service center locations\n- Understanding complaint procedures\n\nPlease ask me anything specific about these services!"
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    simulateResponse(input)
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
              AI <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Civic Assistant</span>
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Navigate services, get answers, and manage your civic needs with AI
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-4">
            <Card className="border-border lg:col-span-3">
              <CardContent className="flex flex-col p-0">
                <ScrollArea className="h-[500px] p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : (
                            <span className="text-xs font-bold text-secondary-foreground">Y</span>
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === "assistant"
                              ? "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
                              : "bg-gradient-to-br from-primary to-[oklch(0.4_0.15_200)] text-primary-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
                          <p className={`mt-1 text-[10px] ${msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-2xl bg-secondary px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask me anything about civic services..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="bg-background"
                    />
                    <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Sidebar */}
            <div className="flex flex-col gap-4">
              <Card className="border-border">
                <CardContent className="flex flex-col gap-3 pt-6">
                  <h3 className="text-sm font-semibold text-card-foreground">Quick Actions</h3>
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="h-auto justify-start gap-2 whitespace-normal text-left text-xs"
                      onClick={() => {
                        setInput(action.label)
                        setTimeout(() => {
                          const userMessage: Message = {
                            id: Date.now().toString(),
                            role: "user",
                            content: action.label,
                            timestamp: new Date(),
                          }
                          setMessages((prev) => [...prev, userMessage])
                          setInput("")
                          simulateResponse(action.label)
                        }, 100)
                      }}
                    >
                      <action.icon className="h-4 w-4 shrink-0 text-primary" />
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/[0.02]">
                <CardContent className="flex flex-col gap-2 pt-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-card-foreground">AI Capabilities</h3>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      "Navigation assistance",
                      "Service information",
                      "Complaint guidance",
                      "Department lookup",
                      "FAQ answers",
                    ].map((cap) => (
                      <li key={cap} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-accent" />
                        {cap}
                      </li>
                    ))}
                  </ul>
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
