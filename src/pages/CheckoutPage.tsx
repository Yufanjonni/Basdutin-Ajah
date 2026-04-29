import type { FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import type { EventItem, Promotion, TicketCategory } from '../types'
import { formatCurrency } from '../utils/format'

type CheckoutPageProps = {
  event: EventItem
  categories: TicketCategory[]
  promotions: Promotion[]
  quantity: number
  category: string
  promoCode: string
  onQuantityChange: (value: number) => void
  onCategoryChange: (value: string) => void
  onPromoChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onBack: () => void
}

export function CheckoutPage({
  event,
  categories,
  promotions,
  quantity,
  category,
  promoCode,
  onQuantityChange,
  onCategoryChange,
  onPromoChange,
  onSubmit,
  onBack,
}: CheckoutPageProps) {
  const selectedCategory = categories.find((c) => c.name === category)
  const basePrice = selectedCategory?.price ?? event.price
  const subtotal = basePrice * quantity
  
  const promo = promotions.find((p) => p.code.toLowerCase() === promoCode.trim().toLowerCase())
  const discount = promo
    ? promo.discountType === 'Persentase'
      ? Math.round((subtotal * parseInt(promo.value)) / 100)
      : parseInt(promo.value.replace(/\D/g, ''))
    : 0
  const total = Math.max(0, subtotal - discount)

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-1">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Artis</span>
              <span className="font-medium">{event.artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Venue</span>
              <span className="font-medium">{event.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Tanggal & Waktu</span>
              <span className="font-medium">{event.date}, {event.time}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pemesanan Tiket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label>Kategori Tiket</Label>
                <Select value={category} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name} - {formatCurrency(cat.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Jumlah Tiket</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-[var(--muted-foreground)]">Maximum 10 tiket per transaksi</p>
              </div>

              <div className="grid gap-2">
                <Label>Kode Promo (Opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => onPromoChange(e.target.value)}
                    placeholder="Masukkan kode promo"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {promo && (
                  <div className="flex justify-between text-sm text-[var(--success)] mb-2">
                    <span>Diskon ({promo.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4">
                Buat Pesanan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}