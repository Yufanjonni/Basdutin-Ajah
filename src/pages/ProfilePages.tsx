import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { roleLabels } from '../data/mockData'
import type { AppData, Role, User } from '../types'
import { formatCurrency } from '../utils/format'

export type ProfileForm = {
  name: string
  phone: string
  contactEmail: string
}

export type PasswordForm = {
  currentPassword: string
  nextPassword: string
  confirmPassword: string
}

type DashboardPageProps = {
  user: User
  data: AppData
  userCount: number
  onProfile: () => void
}

export function DashboardPage({ user, data, userCount, onProfile }: DashboardPageProps) {
  const stats = getDashboardStats(user, data, userCount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-wide">
            Dashboard {roleLabels[user.role]}
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">{user.name}</h1>
        </div>
        <Button variant="outline" onClick={onProfile}>
          Profil Saya
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProfileInfo user={user} />
    </div>
  )
}

type ProfilePageProps = {
  user: User
  form: ProfileForm
  passwordForm: PasswordForm
  passwordOpen: boolean
  onBack: () => void
  onFormChange: (value: ProfileForm) => void
  onPasswordChange: (value: PasswordForm) => void
  onSubmit: (event: FormEvent) => void
  onPasswordSubmit: (event: FormEvent) => void
  onOpenPassword: () => void
  onClosePassword: () => void
}

export function ProfilePage({
  user,
  form,
  passwordForm,
  passwordOpen,
  onBack,
  onFormChange,
  onPasswordChange,
  onSubmit,
  onPasswordSubmit,
  onOpenPassword,
  onClosePassword,
}: ProfilePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Kembali
        </Button>
      </div>
      <h1 className="text-2xl font-bold">Edit Profil</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Nama</Label>
              <div className="font-medium">{user.name}</div>
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <div className="font-medium">{roleLabels[user.role]}</div>
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <div className="font-medium">{user.email}</div>
            </div>
            <div className="grid gap-1.5">
              <Label>Nomor Telepon</Label>
              <div className="font-medium">{user.phone}</div>
            </div>
            <div className="grid gap-1.5">
              <Label>Username</Label>
              <div className="font-medium">{user.username}</div>
            </div>
            {user.contactEmail && (
              <div className="grid gap-1.5">
                <Label>Email Kontak</Label>
                <div className="font-medium">{user.contactEmail}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbarui Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <ProfileFields role={user.role} form={form} onChange={onFormChange} />
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input disabled value={user.username} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Simpan</Button>
                <Button type="button" variant="outline" onClick={onOpenPassword}>
                  Ubah Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={passwordOpen} onOpenChange={onClosePassword}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={onPasswordSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input
                id="current-password"
                required
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => onPasswordChange({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input
                id="new-password"
                required
                minLength={6}
                type="password"
                value={passwordForm.nextPassword}
                onChange={(e) => onPasswordChange({ ...passwordForm, nextPassword: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input
                id="confirm-password"
                required
                minLength={6}
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => onPasswordChange({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <Button type="submit">Simpan Password</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProfileFields({
  role,
  form,
  onChange,
}: {
  role: Role
  form: ProfileForm
  onChange: (value: ProfileForm) => void
}) {
  if (role === 'organizer') {
    return (
      <>
        <div className="grid gap-2">
          <Label>Nama Penyelenggara</Label>
          <Input 
            required 
            value={form.name} 
            onChange={(e) => onChange({ ...form, name: e.target.value })} 
          />
        </div>
        <div className="grid gap-2">
          <Label>Email Kontak</Label>
          <Input
            required
            type="email"
            value={form.contactEmail}
            onChange={(e) => onChange({ ...form, contactEmail: e.target.value })}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="grid gap-2">
        <Label>Nama Lengkap</Label>
        <Input 
          required 
          value={form.name} 
          onChange={(e) => onChange({ ...form, name: e.target.value })} 
        />
      </div>
      <div className="grid gap-2">
        <Label>Nomor Telepon</Label>
        <Input 
          required 
          value={form.phone} 
          onChange={(e) => onChange({ ...form, phone: e.target.value })} 
        />
      </div>
    </>
  )
}

function ProfileInfo({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>informasi Profil</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <span className="text-sm text-[var(--muted-foreground)]">Nama</span>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-[var(--muted-foreground)]">Role</span>
          <span className="font-medium">{roleLabels[user.role]}</span>
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-[var(--muted-foreground)]">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-[var(--muted-foreground)]">Nomor Telepon</span>
          <span className="font-medium">{user.phone}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getDashboardStats(user: User, data: AppData, userCount: number) {
  if (user.role === 'admin') {
    return [
      { label: 'User', value: String(userCount) },
      { label: 'Venue', value: String(data.venues.length) },
      { label: 'Event', value: String(data.events.length) },
      { label: 'Revenue', value: formatCurrency(data.orders.reduce((total, order) => total + order.total, 0)) },
    ]
  }

  if (user.role === 'organizer') {
    const eventTitles = data.events.filter((event) => event.organizerId === user.id).map((event) => event.title)
    const orders = data.orders.filter((order) => eventTitles.includes(order.event))
    return [
      { label: 'Event Saya', value: String(eventTitles.length) },
      { label: 'Order', value: String(orders.length) },
      { label: 'Tiket', value: String(data.tickets.filter((ticket) => eventTitles.includes(ticket.event)).length) },
      { label: 'Revenue', value: formatCurrency(orders.reduce((total, order) => total + order.total, 0)) },
    ]
  }

  const orders = data.orders.filter((order) => order.customer === user.name)
  return [
    { label: 'Tiket Saya', value: String(data.tickets.filter((ticket) => ticket.customer === user.name).length) },
    { label: 'Pesanan', value: String(orders.length) },
    { label: 'Dibayar', value: String(orders.filter((order) => order.status === 'Dibayar').length) },
    { label: 'Total Belanja', value: formatCurrency(orders.reduce((total, order) => total + order.total, 0)) },
  ]
}