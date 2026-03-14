import Link from "next/link"
import { Building2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-card to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.4_0.15_200)]">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">CPSS</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Civic Public Service System - Empowering communities through transparent and efficient governance.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Services</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Waste Management</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Transportation</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Water & Sewage</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Parks & Recreation</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Street Lighting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/complaint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit Complaint</Link></li>
              <li><Link href="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Track Progress</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Authorities</Link></li>
              <li><Link href="/ai-chatbot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            2026 Civic Public Service System. All rights reserved. Serving the community with transparency and accountability.
          </p>
        </div>
      </div>
    </footer>
  )
}
