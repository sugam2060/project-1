'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger

} from '@/components/ui/dropdown-menu'
import AvatorIcon from './AvatarIcon'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'


const DropDown = () => {
  const { data: session } = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-7 h-7 rounded-full p-0 m-0 border-none bg-transparent outline-none focus:outline-none active:outline-none"
          type="button"
        >
          <AvatorIcon session={session} />
        </button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Welcome {session?.user.name?.split(' ')[0]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({callbackUrl: '/'})}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDown