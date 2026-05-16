// app/api/auth/me/route.ts
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authApi } from '../../../lib/api'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'baraat-wheels',
      audience: 'baraat-wheels-users',
      clockTolerance: 60,
    })

    // Fetch full user from DB using payload.id
    const response = await authApi.getUserById(payload.id as string)

    const user = response.data.user

    return NextResponse.json({
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        role: user?.role,
        avatar: user?.avatar,
      },
      verificationStatus: user?.isApproved ? 'approved' : 'pending',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}