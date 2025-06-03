import RegisterForm from '@/components/main/RegisterForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Register | Kalika Kasta Furniture Udyog",
  description: "Create an account with Kalika Kasta Furniture Udyog to shop high-quality wooden furniture online. Enjoy faster checkout, order tracking, and personalized offers from Dhangadhi’s trusted furniture brand."
};


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