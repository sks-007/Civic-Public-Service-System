import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Search, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.15_200)] px-4 py-20 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5">
            <Shield className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Trusted by 50,000+ Citizens</span>
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Your Gateway to
            <br />
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">Public Services</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/70">
            Submit complaints, track progress, access comprehensive civic services, and engage directly with your local government -- all in one platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/complaint">
              <Button size="lg" variant="secondary" className="gap-2 text-secondary-foreground">
                <FileText className="h-5 w-5" />
                Submit a Complaint
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Search className="h-5 w-5" />
                Track Your Request
              </Button>
            </Link>
          </div>
          <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: FileText, label: "Quick Complaint Filing", desc: "Submit issues in under 2 minutes" },
              { icon: Search, label: "Real-time Tracking", desc: "Monitor your complaint status" },
              { icon: Shield, label: "AI Verification", desc: "Deepfake detection for uploads" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl border border-primary-foreground/10 bg-gradient-to-b from-primary-foreground/10 to-primary-foreground/5 p-5 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-primary-foreground">{item.label}</h3>
                <p className="text-xs text-primary-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
