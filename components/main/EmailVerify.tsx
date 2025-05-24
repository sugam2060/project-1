'use client'

import { Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyEmail } from '@/actions/usersActions/verifyUserEmail'

export default function EmailVefify({ token }: { token: string }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      redirect('/auth/login')
    }

    setError('')
    setLoading(true)

    verifyEmail(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success as string)
          setTimeout(() => {
            router.replace('/auth/login')
          }, 500)
        } else {
          setError(data.error as string)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token, router])

  const handleRedirectHome = () => {
    router.replace('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold tracking-tight text-gray-800">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
          {loading && (
            <>
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600 text-sm">Verifying your email address...</p>
            </>
          )}

          {!loading && error && (
            <>
              <p className="text-red-600 font-medium text-sm">{error}</p>
              <button
                onClick={handleRedirectHome}
                className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Click here to get a new verification link
              </button>
            </>
          )}
          {!loading && success && (
            <div className='bg-green-300 py-2 px-4 rounded-md'>
                <p className='text-black font-semibold '>{success}</p>
            </div>
          ) }
        </CardContent>
      </Card>
    </div>
  )
}
