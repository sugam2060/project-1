import RootFooter from '@/components/main/Footer'
import Header from '@/components/main/Header'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main>
      <Header/>
        {children}
      <RootFooter/>
    </main>
  )
}

export default layout