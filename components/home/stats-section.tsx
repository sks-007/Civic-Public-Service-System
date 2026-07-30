export function StatsSection() {
  const stats = [
    { value: "12,450+", label: "Complaints Resolved" },
    { value: "98.2%", label: "Satisfaction Rate" },
    { value: "24hrs", label: "Avg. Response Time" },
    { value: "5", label: "Service Categories" },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-r from-card via-secondary/50 to-card px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.03),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent lg:text-4xl">
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
