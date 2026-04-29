import type { FormEvent } from 'react'
import { Button } from './ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select'
import type { AppData } from '../types'

export type ResourceKind = keyof AppData
export type ResourceDraft = Record<string, string>

export type ResourceDialogState = {
  kind: ResourceKind
  mode: 'create' | 'update'
  id?: number
  draft: ResourceDraft
}

type ResourceDialogProps = {
  state: ResourceDialogState
  data: AppData
  open: boolean
  onDraftChange: (draft: ResourceDraft) => void
  onOpenChange: (open: boolean) => void
  onSubmit: (event: FormEvent) => void
}

const titles: Record<ResourceKind, string> = {
  venues: 'Venue',
  artists: 'Artist',
  events: 'Event',
  seats: 'Kursi',
  ticketCategories: 'Kategori Tiket',
  tickets: 'Tiket',
  orders: 'Order',
  promotions: 'Promosi',
}

export function ResourceDialog({ state, data, open, onDraftChange, onOpenChange, onSubmit }: ResourceDialogProps) {
  const title = `${state.mode === 'create' ? 'Tambah' : 'Update'} ${titles[state.kind]}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Fields state={state} data={data} onDraftChange={onDraftChange} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {state.mode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Fields({
  state,
  data,
  onDraftChange,
}: {
  state: ResourceDialogState
  data: AppData
  onDraftChange: (draft: ResourceDraft) => void
}) {
  const { kind } = state

  if (kind === 'venues') {
    return (
      <>
        <FieldInput label="Nama Venue" value={state.draft.name} field="name" onChange={onDraftChange} required />
        <FieldInput label="Alamat" value={state.draft.address} field="address" onChange={onDraftChange} required />
        <FieldInput label="Kota" value={state.draft.city} field="city" onChange={onDraftChange} required />
        <FieldInput label="Kapasitas" value={state.draft.capacity} field="capacity" type="number" onChange={onDraftChange} required />
        <FieldSelect
          label="Jenis Seating"
          value={state.draft.seatingType}
          field="seatingType"
          options={['Nomor kursi', 'Festival', 'Campuran']}
          onChange={onDraftChange}
        />
      </>
    )
  }

  if (kind === 'events') {
    return (
      <>
        <FieldInput label="Judul Acara" value={state.draft.title} field="title" onChange={onDraftChange} required />
        <FieldInput label="Tanggal" value={state.draft.date} field="date" onChange={onDraftChange} placeholder="12 Mei 2026" required />
        <FieldInput label="Waktu" value={state.draft.time} field="time" type="time" onChange={onDraftChange} required />
        <FieldSelect
          label="Venue"
          value={state.draft.venue}
          field="venue"
          options={data.venues.map((v) => v.name)}
          onChange={onDraftChange}
        />
        <FieldSelect
          label="Artist"
          value={state.draft.artist}
          field="artist"
          options={data.artists.map((a) => a.name)}
          onChange={onDraftChange}
        />
        <FieldInput label="Kategori Tiket" value={state.draft.category} field="category" onChange={onDraftChange} required />
        <FieldInput label="Harga Mulai" value={state.draft.price} field="price" type="number" onChange={onDraftChange} required />
        <FieldInput label="Kuota" value={state.draft.quota} field="quota" type="number" onChange={onDraftChange} required />
        <FieldTextarea label="Deskripsi" value={state.draft.description} field="description" onChange={onDraftChange} />
      </>
    )
  }

  if (kind === 'artists') {
    return (
      <>
        <FieldInput label="Nama" value={state.draft.name} field="name" onChange={onDraftChange} required />
        <FieldInput label="Genre" value={state.draft.genre} field="genre" onChange={onDraftChange} />
        <FieldInput label="Negara" value={state.draft.country} field="country" onChange={onDraftChange} />
      </>
    )
  }

  if (kind === 'seats') {
    return (
      <>
        <FieldSelect
          label="Venue"
          value={state.draft.venue}
          field="venue"
          options={data.venues.map((v) => v.name)}
          onChange={onDraftChange}
        />
        <FieldInput label="Section" value={state.draft.section} field="section" onChange={onDraftChange} required />
        <FieldInput label="Row" value={state.draft.row} field="row" onChange={onDraftChange} required />
        <FieldInput label="Seat Number" value={state.draft.number} field="number" onChange={onDraftChange} required />
        <FieldSelect
          label="Status"
          value={state.draft.status}
          field="status"
          options={['Tersedia', 'Terisi']}
          onChange={onDraftChange}
        />
      </>
    )
  }

  if (kind === 'ticketCategories') {
    return (
      <>
        <FieldSelect
          label="Event"
          value={state.draft.event}
          field="event"
          options={data.events.map((e) => e.title)}
          onChange={onDraftChange}
        />
        <FieldInput label="Nama Kategori" value={state.draft.name} field="name" onChange={onDraftChange} required />
        <FieldInput label="Harga" value={state.draft.price} field="price" type="number" onChange={onDraftChange} required />
        <FieldInput label="Kuota" value={state.draft.quota} field="quota" type="number" onChange={onDraftChange} required />
      </>
    )
  }

  if (kind === 'promotions') {
    return (
      <>
        <FieldInput label="Kode Promo" value={state.draft.code} field="code" onChange={onDraftChange} required />
        <FieldInput label="Judul" value={state.draft.title} field="title" onChange={onDraftChange} required />
        <FieldSelect
          label="Tipe Diskon"
          value={state.draft.discountType}
          field="discountType"
          options={['Persentase', 'Nominal']}
          onChange={onDraftChange}
        />
        <FieldInput label="Nilai" value={state.draft.value} field="value" onChange={onDraftChange} placeholder="20% atau 50000" required />
        <FieldInput label="Tanggal Mulai" value={state.draft.startDate} field="startDate" type="date" onChange={onDraftChange} required />
        <FieldInput label="Tanggal Berakhir" value={state.draft.endDate} field="endDate" type="date" onChange={onDraftChange} required />
        <FieldInput label="Batas Penggunaan" value={state.draft.usageLimit} field="usageLimit" type="number" onChange={onDraftChange} required />
      </>
    )
  }

  if (kind === 'orders') {
    return (
      <>
        <FieldInput label="Kode Order" value={state.draft.code} field="code" onChange={onDraftChange} required />
        <FieldInput label="Tanggal" value={state.draft.orderDate} field="orderDate" onChange={onDraftChange} required />
        <FieldInput label="Customer" value={state.draft.customer} field="customer" onChange={onDraftChange} required />
        <FieldInput label="Event" value={state.draft.event} field="event" onChange={onDraftChange} required />
        <FieldInput label="Kategori Tiket" value={state.draft.ticketCategory} field="ticketCategory" onChange={onDraftChange} required />
        <FieldInput label="Jumlah" value={state.draft.quantity} field="quantity" type="number" onChange={onDraftChange} required />
        <FieldInput label="Total" value={state.draft.total} field="total" type="number" onChange={onDraftChange} required />
        <FieldSelect
          label="Status"
          value={state.draft.status}
          field="status"
          options={['Menunggu', 'Dibayar', 'Dibatalkan']}
          onChange={onDraftChange}
        />
      </>
    )
  }

  return null
}

function FieldInput({
  label,
  value,
  field,
  type = 'text',
  placeholder,
  required,
  onChange,
}: {
  label: string
  value: string
  field: string
  type?: string
  placeholder?: string
  required?: boolean
  onChange: (draft: ResourceDraft) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...{ [field]: e.target.value } } as ResourceDraft)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}

function FieldTextarea({
  label,
  value,
  field,
  onChange,
}: {
  label: string
  value: string
  field: string
  onChange: (draft: ResourceDraft) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={field}>{label}</Label>
      <textarea
        id={field}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...{ [field]: e.target.value } } as ResourceDraft)}
        className="flex min-h-[80px] w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
      />
    </div>
  )
}

function FieldSelect({
  label,
  value,
  field,
  options,
  onChange,
}: {
  label: string
  value: string
  field: string
  options: string[]
  onChange: (draft: ResourceDraft) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={field}>{label}</Label>
      <Select value={value} onValueChange={(val) => onChange({ ...{ [field]: val } } as ResourceDraft)}>
        <SelectTrigger id={field}>
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Helper functions kept from original
export function createDefaultDraft(kind: ResourceKind, data: AppData): ResourceDraft {
  if (kind === 'venues') return { name: '', address: '', city: '', capacity: '', seatingType: 'Nomor kursi' }
  if (kind === 'events') return { title: '', date: '', time: '', venue: data.venues[0]?.name ?? '', artist: data.artists[0]?.name ?? '', category: '', price: '', quota: '', description: '', organizerId: String(data.events[0]?.organizerId ?? 2) }
  if (kind === 'artists') return { name: '', genre: '', country: '' }
  if (kind === 'seats') return { venue: data.venues[0]?.name ?? '', section: '', row: '', number: '', status: 'Tersedia' }
  if (kind === 'ticketCategories') return { event: data.events[0]?.title ?? '', name: '', price: '', quota: '' }
  if (kind === 'promotions') return { code: '', title: '', discountType: 'Persentase', value: '', startDate: '', endDate: '', usageLimit: '' }
  if (kind === 'orders') return { code: '', orderDate: '', customer: '', event: '', ticketCategory: '', quantity: '', promoCode: '', total: '', status: 'Menunggu' }
  return {}
}

export function createDraftFromData(kind: ResourceKind, appData: AppData, id: number): ResourceDraft {
  if (kind === 'venues') {
    const v = appData.venues.find((x) => x.id === id)
    return v ? { name: v.name, address: v.address, city: v.city, capacity: String(v.capacity), seatingType: v.seatingType } : {}
  }
  if (kind === 'events') {
    const e = appData.events.find((x) => x.id === id)
    return e ? { title: e.title, date: e.date, time: e.time, venue: e.venue, artist: e.artist, category: e.category, price: String(e.price), quota: String(e.quota), description: e.description, organizerId: String(e.organizerId) } : {}
  }
  if (kind === 'artists') {
    const a = appData.artists.find((x) => x.id === id)
    return a ? { name: a.name, genre: a.genre, country: a.country } : {}
  }
  if (kind === 'seats') {
    const s = appData.seats.find((x) => x.id === id)
    return s ? { venue: s.venue, section: s.section, row: s.row, number: s.number, status: s.status } : {}
  }
  if (kind === 'ticketCategories') {
    const c = appData.ticketCategories.find((x) => x.id === id)
    return c ? { event: c.event, name: c.name, price: String(c.price), quota: String(c.quota) } : {}
  }
  if (kind === 'promotions') {
    const p = appData.promotions.find((x) => x.id === id)
    return p ? { code: p.code, title: p.title, discountType: p.discountType, value: p.value, startDate: p.startDate, endDate: p.endDate, usageLimit: String(p.usageLimit) } : {}
  }
  if (kind === 'orders') {
    const o = appData.orders.find((x) => x.id === id)
    return o ? { code: o.code, orderDate: o.orderDate, customer: o.customer, event: o.event, ticketCategory: o.ticketCategory, quantity: String(o.quantity), promoCode: o.promoCode, total: String(o.total), status: o.status } : {}
  }
  return {}
}