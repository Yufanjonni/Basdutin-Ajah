import { Ticket } from 'lucide-react'

export function BrandPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg">
        <Ticket className="h-8 w-8" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
          TikTakTuk
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-md">
          Platform pemesanan tiket event terpercaya. Temukan dan pesan tiket acara favorit Anda dengan mudah.
        </p>
      </div>
    </div>
  )
}