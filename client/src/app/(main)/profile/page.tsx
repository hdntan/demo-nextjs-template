import { createServerApiClient } from '@/lib/api/server'
import { getMe } from '@/lib/api/services/account.service'
import { redirect } from 'next/navigation'
import { ProfileForm } from './_components/profile-form'
import { ApiError } from '@/lib/net/net'
import type { User } from '@/types/auth'

export default async function ProfilePage() {
  const api = await createServerApiClient()

  let user: User
  try {
    user = await getMe(api)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/login')
    throw err
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <ProfileForm initialData={user} />
    </div>
  )
}
