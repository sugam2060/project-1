import RegisterForm from '@/components/main/RegisterForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className="py-10 px-2 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className='text-center'>
          <CardTitle className="text-2xl">Register as admin</CardTitle>
        </CardHeader>
        <RegisterForm/>
      </Card>
    </div>
  )
}

export default RegisterPage