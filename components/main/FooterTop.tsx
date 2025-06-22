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
        subtitle: '8:00 AM - 6:00 PM',
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
    const getHref = () => {
      if (item.title === 'Visit us') {
        return 'https://www.google.com/maps/place/...';
      } else if (item.title === 'Email us') {
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.subtitle)}`;
      } else if (item.title === 'Call us') {
        return 'https://wa.me/9779700550270';
      }
      return null; // No href for "Working Hours"
    };
  
    const href = getHref();
    const content = (
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
    );
  
    return href ? (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    ) : (
      <div>{content}</div>
    );
  };
  

export default FooterTop