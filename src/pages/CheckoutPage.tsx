import type { FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import type { EventItem, Promotion, Seat, TicketCategory, Venue } from '../types'
import { formatCurrency } from '../utils/format'

type CheckoutPageProps = {
  event: EventItem
  venues: Venue[]
  seats: Seat[]
  categories: TicketCategory[]
  promotions: Promotion[]
  quantity: number
  category: string
  promoCode: string
  selectedSeats: string[]
  onQuantityChange: (value: number) => void
  onCategoryChange: (value: string) => void
  onPromoChange: (value: string) => void
  onSelectedSeatsChange: (value: string[]) => void
  onApplyPromo: () => void
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
  selectedSeats,
  onQuantityChange,
  onCategoryChange,
  onPromoChange,
  onSelectedSeatsChange,
  onApplyPromo,
  onSubmit,
  onBack,
}: CheckoutPageProps) {
  const availableSeats = createVisualSeats()
  
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

  const toggleSeat = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      onSelectedSeatsChange(selectedSeats.filter(s => s !== seatCode))
    } else if (selectedSeats.length < quantity) {
      onSelectedSeatsChange([...selectedSeats, seatCode])
    }
  }

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
              <span className="text-[#64748b]">Artis</span>
              <span className="font-medium">{event.artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Venue</span>
              <span className="font-medium">{event.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Tanggal & Waktu</span>
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
                <Select value={category} onValueChange={(val) => { onCategoryChange(val); onSelectedSeatsChange([]); }}>
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

              {category && (
                <div className="grid gap-2">
                  <Label>Pilih Kursi ({selectedSeats.length}/{quantity})</Label>
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0f172a]">Seat Map</span>
                      <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#64748b]">
                        {selectedSeats.length} dipilih
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {availableSeats.map(seat => {
                        const seatCode = `${seat.section}-${seat.row}-${seat.number}`
                        const isSelected = selectedSeats.includes(seatCode)
                        return (
                          <button
                            key={seatCode}
                            type="button"
                            onClick={() => toggleSeat(seatCode)}
                            disabled={!isSelected && selectedSeats.length >= quantity}
                            className={`h-12 rounded-xl border text-sm font-bold transition-colors ${
                              isSelected 
                                ? 'border-[#2563eb] bg-[#2563eb] text-white' 
                                : 'border-[#e2e8f0] bg-white text-[#334155] hover:border-[#93c5fd] hover:bg-[#eff6ff]'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {seat.section}{seat.number}
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-4 flex gap-6 border-t border-[#e2e8f0] pt-4 text-xs">
                      <span className="flex items-center gap-2 text-[#64748b]">
                        <span className="h-4 w-4 rounded border border-[#e2e8f0] bg-white"></span> Tersedia
                      </span>
                      <span className="flex items-center gap-2 text-[#64748b]">
                        <span className="h-4 w-4 rounded bg-[#2563eb]"></span> Dipilih
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label>Jumlah Tiket</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => { onQuantityChange(parseInt(e.target.value) || 1); onSelectedSeatsChange([]); }}
                />
                <p className="text-xs text-[#64748b]">Maximum 10 tiket per transaksi</p>
              </div>

              <div className="grid gap-2">
                <Label>Kode Promo (Opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => onPromoChange(e.target.value)}
                    placeholder="Masukkan kode promo"
                  />
                  <Button type="button" variant="outline" onClick={onApplyPromo}>
                    Terapkan
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#64748b]">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {promo && (
                  <div className="flex justify-between text-sm text-[#22c55e] mb-2">
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

function createVisualSeats(): Seat[] {
  return ['A', 'B', 'C', 'D'].flatMap((section, sectionIndex) =>
    Array.from({ length: 4 }, (_, index) => ({
      id: sectionIndex * 4 + index + 1,
      venue: 'Visual',
      section,
      row: '',
      number: String(index + 1),
      status: 'Tersedia' as const,
    })),
  )
}
