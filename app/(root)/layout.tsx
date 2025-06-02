import RootFooter from '@/components/main/Footer'
import Header from '@/components/main/Header'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main>
      <SessionProvider>
        <Header/>
        {children}
      <RootFooter/>
      </SessionProvider>
    </main>
  )
}

export default layout