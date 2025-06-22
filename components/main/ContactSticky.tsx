import React from "react";
import { Mail, Phone, Instagram } from "lucide-react";
import Link from "next/link";

const CONTACT_EMAIL = "aashishmainali12@gmail.com";
const WHATSAPP_NUMBER = "9779700550270";
const INSTAGRAM_URL = "https://instagram.com/your_instagram_handle";

const buttons = [
  {
    href: `mailto:${CONTACT_EMAIL}`,
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    color: "hover:bg-blue-100 text-blue-600 hover:text-blue-800 border-blue-200",
    tooltip: "Email us",
  },
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: <Phone className="w-5 h-5" />,
    label: "WhatsApp",
    color: "hover:bg-green-100 text-green-600 hover:text-green-800 border-green-200",
    tooltip: "WhatsApp us",
    external: true,
  },
  {
    href: INSTAGRAM_URL,
    icon: <Instagram className="w-5 h-5" />,
    label: "Instagram",
    color: "hover:bg-pink-100 text-pink-600 hover:text-pink-800 border-pink-200",
    tooltip: "Instagram",
    external: true,
  },
];

const ContactSticky = () => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3 pr-1">
      {buttons.map((btn) => (
        <Link
          key={btn.label}
          href={btn.href}
          target={btn.external ? "_blank" : undefined}
          rel={btn.external ? "noopener noreferrer" : undefined}
          className={`group relative flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow-md transition-all duration-200 ${btn.color}`}
          title={btn.tooltip}
        >
          {btn.icon}
          <span className="absolute right-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 pointer-events-none bg-zinc-900 text-white text-xs rounded px-2 py-1 transition-all duration-200 whitespace-nowrap font-medium">
            {btn.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ContactSticky; 