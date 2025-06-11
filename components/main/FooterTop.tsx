import { Clock, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { IoLogoWhatsapp } from "react-icons/io";


interface Props {
    title: string
    subtitle: string
    icon: React.ReactNode
}

const data: Props[] = [
    {
        title: "Visit us",
        subtitle: 'Dhangadhi, Nepal',
        icon: (<MapPin
            className='text-gray-600 group-hover:text-[#151515] transition-colors'
        />)
    },
    {
        title: "Call us",
        subtitle: '+977 9700550270',
        icon: (<IoLogoWhatsapp
            className='text-gray-600 group-hover:text-[#151515] transition-colors w-6 h-6'
        />)
    },
    {
        title: "Working Hours",
        subtitle: 'Mon - Sat: 10:00 AM - 6:00 PM',
        icon: (<Clock
            className='text-gray-600 group-hover:text-[#151515] transition-colors'
        />)
    },
    {
        title: "Email us",
        subtitle: 'aashishmainali12@gmail.com',
        icon: (<Mail
            className='text-gray-600 group-hover:text-[#151515] transition-colors'
        />)
    }
]
const FooterTop = () => {
    return (
        <div className="w-full overflow-x-hidden px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-6">
                {data.map((item, idx) => (
                    <ContactItem key={idx} item={item} />
                ))}
            </div>
        </div>
    );
};



const ContactItem = ({ item }: { item: Props }) => {
    // Determine the URL based on item title
    const getHref = () => {
        if (item.title === 'Visit us') {
            return 'https://www.google.com/maps/place/%E0%A4%95%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%95%E0%A4%BE+%E0%A4%95%E0%A4%BE%E0%A4%B7%E0%A5%8D%E0%A4%A0+%E0%A4%AB%E0%A4%B0%E0%A5%8D%E0%A4%A8%E0%A4%BF%E0%A4%9A%E0%A4%B0+%E0%A4%89%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%97/@28.7045625,80.5714375,17z/data=!3m1!4b1!4m6!3m5!1s0x39a1edd4f5890f59:0xaa8e867645acb28b!8m2!3d28.7045625!4d80.5714375!16s%2Fg%2F11xkcw_sbl?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D';
        } else if (item.title === 'Email us') {
            return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.subtitle)}`;
        } else if (item.title === 'Call us') {
            return 'https://wa.me/9779700550270';
        } else {
            return '#';
        }
    };

    return (
        <Link href={getHref()} target="_blank" rel="noopener noreferrer">
            <div className="flex items-start gap-3 group hover:bg-gray-50 p-4 transition-colors rounded-md">
                {item.icon}
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#151515]">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors break-words">
                        {item.subtitle}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default FooterTop