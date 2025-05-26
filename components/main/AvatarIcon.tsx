import React, { forwardRef } from 'react'
import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar'
import { Session } from 'next-auth'

const AvatorIcon = forwardRef<HTMLSpanElement, { session: Session | null }>(
  ({ session }, ref) => {
    const name = session?.user.name || ''
  const parts = name.trim().split(' ');
    return (
      <Avatar ref={ref} className='cursor-pointer w-7 h-7'>
        <AvatarImage src={session?.user.image || ''} alt="user" />
        <AvatarFallback className='bg-gray-400 text-black font-semibold text-sm flex items-center justify-center'>
          {session?.user.role === 'ADMIN' && parts.length >= 2 ? `${parts[0][0] ?? ''}${parts[1][0] ?? ''}` : parts.length >= 2 ? parts[1][0] : parts[0]?.[0] ?? ''}
        </AvatarFallback>
      </Avatar>
    )
  }
)

AvatorIcon.displayName = 'AvatorIcon'

export default AvatorIcon
