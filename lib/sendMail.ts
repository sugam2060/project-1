// lib/mail/sendEmail.ts

import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Verify the transporter connection
transporter.verify((error) => {
  if (error) {
    console.error('Nodemailer Transport Error:', error)
  } else {
    console.log('Nodemailer Transporter is ready to send emails')
  }
})

// Main email function
export const sendMail = async ({ to, subject, text, html }: SendEmailOptions) => {
  try {
    const mailOptions = {
      from: `"Kalika Kasta Furniture Udyog" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Email sending error:', error.message)
    return { success: false, error: error.message }
  } else {
    console.error('Email sending error:', error)
    return { success: false, error: 'Unknown error' }
  }
}
}
