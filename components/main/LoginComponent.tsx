'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc"
import EmailLogin from '@/components/main/EmailLogin'
import Container from '@/components/main/Container'



const LoginComponent = () => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)



  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/admin' })
  }



  return (
    
    <Container>
      <div className=" py-16 flex items-center justify-center dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Sign in to your account</CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Choose a method to get started
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Login Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-6 font-medium text-base"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-between my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="mx-3 text-sm text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Admin Login Dialog Trigger */}
          <EmailLogin
            emailDialogOpen={emailDialogOpen}
            setEmailDialogOpen={setEmailDialogOpen}
          />
        </CardContent>
      </Card>
    </div>
    </Container>
  )
}

export default LoginComponent
