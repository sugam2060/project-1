import LoginComponent from '@/components/main/LoginComponent';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Login",
  description: "Securely log in to your Kalika Kasta Furniture Udyog account to view orders, manage your cart, and explore our latest wooden furniture collections online."
};


const LoginPage = () => {
  return (
    <LoginComponent/>
  )
}

export default LoginPage
