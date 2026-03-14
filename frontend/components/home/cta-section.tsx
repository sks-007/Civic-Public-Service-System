import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, MessageSquare } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-secondary to-background px-4 py-16 lg:py-20">
      <div className="absolute -top-20 left-1/3 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 right-1/3 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="group flex flex-col justify-center gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.03] p-8 transition-all hover:shadow-lg hover:shadow-primary/5 lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">AI-Powered Assistant</h3>
            <p className="leading-relaxed text-muted-foreground">
              Our intelligent chatbot helps you navigate the system, verifies uploaded images for authenticity, and detects deepfakes to ensure genuine reporting.
            </p>
            <Link href="/ai-chatbot">
              <Button className="w-fit gap-2">
                <Bot className="h-4 w-4" />
                Try AI Assistant
              </Button>
            </Link>
          </div>
          <div className="group flex flex-col justify-center gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/[0.03] p-8 transition-all hover:shadow-lg hover:shadow-accent/5 lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">Contact Authorities</h3>
            <p className="leading-relaxed text-muted-foreground">
              Need to speak directly with your local government? Fill out our contact form to reach the appropriate department heads and elected officials.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="w-fit gap-2">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
