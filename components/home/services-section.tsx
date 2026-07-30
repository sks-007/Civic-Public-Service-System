import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Bus, Droplets, Trees, Lightbulb, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Trash2,
    title: "Waste Management",
    description: "Report waste collection issues, request special pickups, and manage recycling schedules.",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: Bus,
    title: "Transportation",
    description: "Report road damage, traffic signals, public transit issues, and infrastructure problems.",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Droplets,
    title: "Water & Sewage",
    description: "Report water main breaks, sewage overflow, water quality concerns, and drainage issues.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Trees,
    title: "Parks & Recreation",
    description: "Report park maintenance needs, playground safety, trail conditions, and facility issues.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Lightbulb,
    title: "Street Lighting",
    description: "Report streetlight outages, damaged fixtures, dark spots, and electrical hazards.",
    color: "bg-chart-5/10 text-chart-5",
  },
]

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-16 lg:py-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-primary/3 blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-accent/3 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">Comprehensive Public Services</span>
          </h2>
          <p className="mt-3 text-pretty text-lg text-muted-foreground">
            Access and report issues across all essential civic service categories
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="group relative overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/complaint">
                  <Button variant="ghost" className="gap-2 p-0 text-primary hover:bg-transparent hover:text-primary/80">
                    Report an Issue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg" className="gap-2 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
