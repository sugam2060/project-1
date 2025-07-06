'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {FaTiktok} from 'react-icons/fa'

interface Props {
  className?: string
  iconClassName?: string
  tooptipClassName?: string
}

const socialLinks = [
  {
    title: 'Tiktok',
    href: 'https://www.tiktok.com/@kalika.kasta.furn?_t=ZS-8xnb5fDYd0O&_r=1',
    icon: <FaTiktok className="w-5 h-5 text-[#010101] group-hover:text-[#69C9D0]" />,
    color: 'hover:bg-[#69C9D0]/10',
  },
  {
    title: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: <Facebook className="w-5 h-5 text-[#1877F3] group-hover:text-[#145db2]" />,
    color: 'hover:bg-[#1877F3]/10',
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sugam-pudasain-843912247/',
    icon: <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:text-[#004182]" />,
    color: 'hover:bg-[#0A66C2]/10',
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: <Instagram className="w-5 h-5 text-[#E1306C] group-hover:text-[#C13584]" />,
    color: 'hover:bg-[#E1306C]/10',
  }
]

const SocialMedia: React.FC<Props> = ({
  className,
  iconClassName,
  tooptipClassName
}) => {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-4', className)}>
        {socialLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
                className={cn(
                  'p-2 border border-gray-300 rounded-full transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
                  item.color,
                  iconClassName
                )}
              >
                {item.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className={cn(
                'bg-white text-xs font-medium text-[#151515] px-2 py-1 border rounded shadow-sm',
                tooptipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export default SocialMedia
