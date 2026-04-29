import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select'
import type { AppData, ResourceDialogState, ResourceDraft, ResourceKind } from '../types'

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
          label="Status Pembayaran"
          value={state.draft.status}
          field="status"
          options={['Menunggu', 'Dibayar', 'Dibatalkan']}
          onChange={onDraftChange}
        />
      </>
    )
  }

  if (kind === 'tickets') {
    return <TicketFields state={state} data={data} onDraftChange={onDraftChange} />
  }

  return null
}

function TicketFields({
  state,
  data,
  onDraftChange,
}: {
  state: ResourceDialogState
  data: AppData
  onDraftChange: (draft: ResourceDraft) => void
}) {
  const [selectedOrder, setSelectedOrder] = useState(state.draft.orderCode || '')
  const [selectedCategory, setSelectedCategory] = useState(state.draft.category || '')

  const orderOptions = data.orders.map(o => o.code)
  const selectedOrderData = data.orders.find(o => o.code === selectedOrder)
  const eventName = selectedOrderData?.event || ''
  
  const categoryOptions = eventName 
    ? data.ticketCategories.filter(c => c.event === eventName).map(c => c.name)
    : []
  
  const venueForEvent = data.events.find(e => e.title === eventName)?.venue || ''
  const venueData = data.venues.find(v => v.name === venueForEvent)
  const isReservedSeating = venueData?.seatingType === 'Nomor kursi'
  
  const availableSeats = isReservedSeating
    ? data.seats.filter(s => s.venue === venueForEvent && s.status === 'Tersedia').map(s => `${s.section}-${s.row}${s.number}`)
    : []

  const isUpdate = state.mode === 'update'

  if (isUpdate) {
    const currentTicket = data.tickets.find(t => t.id === state.id)
    const currentEvent = currentTicket?.event || ''
    const currentVenue = data.events.find(e => e.title === currentEvent)?.venue || ''
    const currentVenueData = data.venues.find(v => v.name === currentVenue)
    const isCurrentReserved = currentVenueData?.seatingType === 'Nomor kursi'
    
    const currentSeatOptions = isCurrentReserved
      ? data.seats.filter(s => s.venue === currentVenue && s.status === 'Tersedia').map(s => `${s.section}-${s.row}${s.number}`)
      : []

    return (
      <>
        <FieldInput label="Kode Tiket" value={state.draft.code} field="code" onChange={onDraftChange} readOnly />
        <FieldSelect
          label="Status"
          value={state.draft.status}
          field="status"
          options={['Aktif', 'Dipakai', 'Dibatalkan']}
          onChange={onDraftChange}
        />
        {isCurrentReserved && (
          <FieldSelect
            label="Kursi"
            value={state.draft.seatCode}
            field="seatCode"
            options={[state.draft.seatCode, 'Tanpa Kursi', ...currentSeatOptions].filter((v, i, a) => a.indexOf(v) === i)}
            onChange={onDraftChange}
          />
        )}
      </>
    )
  }

  return (
    <>
      <FieldSelect
        label="Order"
        value={selectedOrder}
        field="orderCode"
        options={orderOptions}
        onChange={(draft) => {
          const val = draft.orderCode
          if (val) {
            setSelectedOrder(val)
            setSelectedCategory('')
            onDraftChange({ ...state.draft, orderCode: val, category: '', seatCode: '' } as ResourceDraft)
          }
        }}
      />
      {selectedOrder && (
        <FieldSelect
          label="Kategori Tiket"
          value={selectedCategory}
          field="category"
          options={categoryOptions}
          onChange={(draft) => {
            const val = draft.category
            if (val) {
              setSelectedCategory(val)
              onDraftChange({ ...state.draft, category: val } as ResourceDraft)
            }
          }}
        />
      )}
      {isReservedSeating && selectedOrder && selectedCategory && (
        <FieldSelect
          label="Kursi"
          value={state.draft.seatCode}
          field="seatCode"
          options={['Tanpa Kursi', ...availableSeats]}
          onChange={onDraftChange}
        />
      )}
    </>
  )
}

function FieldInput({
  label,
  value,
  field,
  type = 'text',
  placeholder,
  required,
  readOnly,
  onChange,
}: {
  label: string
  value: string
  field: string
  type?: string
  placeholder?: string
  required?: boolean
  readOnly?: boolean
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
        readOnly={readOnly}
        className={readOnly ? 'bg-[var(--muted)]' : ''}
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