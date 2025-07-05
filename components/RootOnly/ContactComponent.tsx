'use client'
import Container from '@/components/main/Container'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IoLogoWhatsapp } from "react-icons/io"
import { Instagram } from 'lucide-react'
import { FaTiktok } from 'react-icons/fa'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ContactComponent = () => {
    const contactMethods = [
        {
          title: "WhatsApp",
          subtitle: "+977 9700550270",
          description: "Chat with us on WhatsApp for quick responses",
          icon: <IoLogoWhatsapp className="w-6 h-6 text-green-600" />,
          href: "https://wa.me/9779700550270",
          color: "hover:bg-green-50 border-green-200",
          buttonColor: "bg-green-600 hover:bg-green-700"
        },
        {
          title: "Instagram",
          subtitle: "@kalikakasta",
          description: "Follow us on Instagram for latest updates",
          icon: <Instagram className="w-6 h-6 text-pink-600" />,
          href: "https://www.instagram.com/kalikakasta",
          color: "hover:bg-pink-50 border-pink-200",
          buttonColor: "bg-pink-600 hover:bg-pink-700"
        },
        {
          title: "TikTok",
          subtitle: "@kalikakasta",
          description: "Watch our videos on TikTok",
          icon: <FaTiktok className="w-6 h-6 text-black" />,
          href: "https://www.tiktok.com/@kalikakasta",
          color: "hover:bg-gray-50 border-gray-200",
          buttonColor: "bg-black hover:bg-gray-800"
        }
      ]
    
      const contactInfo = [
        {
          title: "Call us",
          subtitle: "+977 9700550270",
          icon: <Phone className="w-5 h-5 text-gray-600" />
        },
        {
          title: "Email us",
          subtitle: "aashishmainali12@gmail.com",
          icon: <Mail className="w-5 h-5 text-gray-600" />
        }
      ]
    
      return (
        <Container>
          <div className="py-16 flex items-center justify-center dark:bg-gray-900 px-4">
            <Card className="w-full max-w-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Get in Touch</CardTitle>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  Choose your preferred way to contact us
                </p>
              </CardHeader>
    
              <CardContent className="space-y-6">
                {/* Contact Methods */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-colors ${method.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {method.icon}
                          <div>
                            <h3 className="font-semibold text-gray-900">{method.title}</h3>
                            <p className="text-sm text-gray-600">{method.subtitle}</p>
                            <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                          </div>
                        </div>
                        <Link href={method.href} target="_blank" rel="noopener noreferrer">
                          <Button className={method.buttonColor}>
                            Contact
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
    
                {/* Divider */}
                <div className="flex items-center justify-between my-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="mx-3 text-sm text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
    
                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      {info.icon}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{info.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{info.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
    
                {/* Additional Info */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    We&apos;re here to help with all your wooden furniture needs. 
                    Feel free to reach out through any of the channels above!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      )
}

export default ContactComponent