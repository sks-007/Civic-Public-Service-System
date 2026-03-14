import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Bus,
  Droplets,
  Trees,
  Lightbulb,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
} from "lucide-react"

const services = [
  {
    icon: Trash2,
    title: "Waste Management",
    description: "Comprehensive waste collection and recycling services for your neighborhood.",
    details: [
      "Residential garbage collection (Mon, Wed, Fri)",
      "Recycling pickup (Tue, Thu)",
      "Bulk waste & hazardous material disposal",
      "Commercial waste services",
      "Composting programs",
    ],
    contact: "+91-80-2266-1001",
    location: "Public Works Dept, Municipal Corporation Building",
    responseTime: "24-48 hours",
    resolvedThisMonth: 342,
  },
  {
    icon: Bus,
    title: "Transportation",
    description: "Road maintenance, traffic management, and public transit services.",
    details: [
      "Pothole repair & road resurfacing",
      "Traffic signal maintenance",
      "Public bus routes & schedules",
      "Sidewalk & crosswalk safety",
      "Parking management",
    ],
    contact: "+91-80-2266-1002",
    location: "Transportation Authority, BMTC Head Office",
    responseTime: "48-72 hours",
    resolvedThisMonth: 218,
  },
  {
    icon: Droplets,
    title: "Water & Sewage",
    description: "Water supply management, quality testing, and sewage infrastructure.",
    details: [
      "Water main repair & maintenance",
      "Sewage line inspection & repair",
      "Water quality monitoring",
      "Storm drain management",
      "Fire hydrant maintenance",
    ],
    contact: "+91-80-2266-1003",
    location: "Water Authority, BWSSB Office, K.G. Road",
    responseTime: "4-24 hours (emergency)",
    resolvedThisMonth: 156,
  },
  {
    icon: Trees,
    title: "Parks & Recreation",
    description: "Green spaces, recreational facilities, and community programs.",
    details: [
      "Park grounds maintenance",
      "Playground equipment safety",
      "Trail & pathway upkeep",
      "Community event spaces",
      "Sports facility management",
    ],
    contact: "+91-80-2266-1004",
    location: "Parks & Rec Dept, Horticulture Office, Lalbagh",
    responseTime: "3-5 days",
    resolvedThisMonth: 89,
  },
  {
    icon: Lightbulb,
    title: "Street Lighting",
    description: "Street light installation, repair, and energy-efficient upgrades.",
    details: [
      "Streetlight outage reporting",
      "New light installation requests",
      "LED upgrade program",
      "Dark spot identification",
      "Holiday lighting coordination",
    ],
    contact: "+91-80-2266-1005",
    location: "Electrical Services, BESCOM Office, MG Road",
    responseTime: "24-48 hours",
    resolvedThisMonth: 267,
  },
]

export default function ServicesPage() {
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
              Comprehensive <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Public Services</span>
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Explore all civic service departments and their offerings
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-border overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="flex flex-col lg:flex-row">
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                      </div>
                    </div>
                    <ul className="mt-4 flex flex-col gap-2">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 border-t border-border bg-gradient-to-b from-secondary/30 to-primary/[0.02] p-6 lg:w-72 lg:border-l lg:border-t-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      {service.contact}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      {service.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      Response: {service.responseTime}
                    </div>
                    <Badge variant="secondary" className="mt-2 w-fit bg-accent/10 text-accent">
                      {service.resolvedThisMonth} resolved this month
                    </Badge>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
