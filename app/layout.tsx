import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Provider from "./Provider";

const RalewayFont = Raleway({
  variable: "--font-raleway",
  weight: "400",
  display: "swap", // <- helps avoid FOIT (flash of invisible text)
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kalika Kasta Furniture Udyog | Quality Wooden Furniture in Dhangadhi, Nepal",
    template: "%s | Kalika Kasta Furniture Udyog",
  },
  description: "Kalika Kasta Furniture Udyog is a trusted furniture manufacturer and seller based in Dhangadhi, Western Nepal. We specialize in high-quality wooden furniture including beds, sofas, cupboards, dining sets, and office furnishings. Discover durable, stylish, and affordable furniture handcrafted to suit your home or business needs.",
  twitter: {
    card: 'summary_large_image'
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${RalewayFont.variable} antialiased`}
      >
        <Provider>
          {children}
        </Provider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
