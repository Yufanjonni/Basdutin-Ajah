import type { FormEvent } from 'react'
import { Field } from '../components/Field'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
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
    <section className="content-page">
      <PageHeader
        eyebrow={`Dashboard ${roleLabels[user.role]}`}
        title={user.name}
        action={
          <button className="secondary-button" type="button" onClick={onProfile}>
            Profil Saya
          </button>
        }
      />
      <div className="stats-row wide">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <ProfileInfo user={user} />
    </section>
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
    <section className="content-page">
      <PageHeader
        eyebrow="Profile"
        title={user.name}
        action={
          <button className="secondary-button" type="button" onClick={onBack}>
            Dashboard
          </button>
        }
      />
      <div className="profile-layout">
        <ProfileInfo user={user} />
        <section className="panel-card">
          <h2>Edit Profil</h2>
          <form className="form-stack" onSubmit={onSubmit}>
            <ProfileFields role={user.role} form={form} onChange={onFormChange} />
            <Field label="Username">
              <input disabled value={user.username} />
            </Field>
            <div className="action-row">
              <button className="primary-button" type="submit">
                Simpan
              </button>
              <button className="secondary-button" type="button" onClick={onOpenPassword}>
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>

      {passwordOpen && (
        <Modal title="Update Password" onClose={onClosePassword}>
          <form className="form-stack" onSubmit={onPasswordSubmit}>
            <Field label="Password Saat Ini">
              <input
                required
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => onPasswordChange({ ...passwordForm, currentPassword: event.target.value })}
              />
            </Field>
            <Field label="Password Baru">
              <input
                required
                minLength={6}
                type="password"
                value={passwordForm.nextPassword}
                onChange={(event) => onPasswordChange({ ...passwordForm, nextPassword: event.target.value })}
              />
            </Field>
            <Field label="Konfirmasi Password">
              <input
                required
                minLength={6}
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => onPasswordChange({ ...passwordForm, confirmPassword: event.target.value })}
              />
            </Field>
            <button className="primary-button" type="submit">
              Simpan Password
            </button>
          </form>
        </Modal>
      )}
    </section>
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
        <Field label="Nama Penyelenggara">
          <input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
        </Field>
        <Field label="Email Kontak">
          <input
            required
            type="email"
            value={form.contactEmail}
            onChange={(event) => onChange({ ...form, contactEmail: event.target.value })}
          />
        </Field>
      </>
    )
  }

  if (role === 'customer') {
    return (
      <>
        <Field label="Nama Lengkap">
          <input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
        </Field>
        <Field label="Nomor Telepon">
          <input required value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} />
        </Field>
      </>
    )
  }

  return (
    <>
      <Field label="Nama Admin">
        <input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
      </Field>
      <Field label="Nomor Telepon">
        <input required value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} />
      </Field>
    </>
  )
}

function ProfileInfo({ user }: { user: User }) {
  return (
    <article className="profile-card">
      <dl>
        <Info label="Nama" value={user.name} />
        <Info label="Role" value={roleLabels[user.role]} />
        <Info label="Email" value={user.email} />
        <Info label="Nomor Telepon" value={user.phone} />
        <Info label="Username" value={user.username} />
        {user.contactEmail && <Info label="Email Kontak" value={user.contactEmail} />}
      </dl>
    </article>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
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
