import React from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Facebook, Github, Instagram, Linkedin } from 'lucide-react'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'
interface props {
    className?: string
    iconClassName?: string
    tooptipClassName?: string
}

const socialLinks = [
    {
        title: 'Github',
        href: 'https://github.com/adrianhajdin/yc_directory/tree/main',
        icons: <Github className='w-5 h-5' />
    },
    {
        title: 'Facebook',
        href: 'https://www.facebook.com/',
        icons: <Facebook className='w-5 h-5' />
    },
    {
        title: 'Linkedin',
        href: 'https://www.linkedin.com/in/sugam-pudasain-843912247/',
        icons: <Linkedin className='w-5 h-5' />
    },
    {
        title: 'instagram',
        href: 'https://www.instagram.com/',
        icons: <Instagram className='w-5 h-5' />
    }
]

const SocialMedia = ({ className, iconClassName, tooptipClassName }: props) => {
    return (
        <TooltipProvider>

            <div className={cn('flex items-center gap-3.5', className)}>
                {socialLinks.map((item) => (
                    <Tooltip key={item.title}>
                        <TooltipTrigger asChild>
                            <Link href={item.href} className={cn('p-2 border rounded-full hover:text-white hover:border-white hoverEffect', iconClassName)}>
                                {item.icons}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className={cn('p-1 text-[#151515] rounded-sm text-xs bg-white font-semibold', tooptipClassName)}>
                            {item.title}
                        </TooltipContent>
                    </Tooltip>
                ))}

            </div>

        </TooltipProvider>


    )
}

export default SocialMedia