import EmailVefify from '@/components/main/EmailVerify'
import React from 'react'

interface EmailVerifyProps {
  searchParams: Promise<{
    token?: string
  }>
}

const VerifyPage = async ({ searchParams }: EmailVerifyProps) => {
  const resolvedSearchParams = await searchParams
  
  return (
    <div>
        <EmailVefify token={resolvedSearchParams?.token ?? ''}/>
    </div>
  )
}

export default VerifyPage