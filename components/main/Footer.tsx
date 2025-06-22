import React from "react";
import Container from "@/components/main/Container";
import FooterTop from "./FooterTop";
import SocialMedia from "./SocialMedia";
import { quickLinksData } from "@/constant";
import Link from "next/link";

const Footer = async () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-8 px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {/* About Section */}
          <div className="max-w-md mx-auto sm:mx-0 text-center sm:text-left">
            <h2 className="font-semibold text-lg sm:text-xl mb-3">
              Kalika Kasta Furniture Udgog
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
              accusantium consectetur cum esse distinctio in facilis deleniti,
              doloribus culpa. Aliquid?
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col sm:items-start items-center">
            <h3 className="font-semibold text-[#151515] mb-3 text-base sm:text-lg border-b border-gray-200 w-full pb-2">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2 sm:gap-3 w-full max-w-xs">
              {quickLinksData.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-gray-600 hover:text-[#151515] text-sm sm:text-base font-medium transition-colors duration-200"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-[#151515] mb-2 sm:mb-3 text-base sm:text-lg border-b border-gray-200 w-full pb-2">
              Social Media
            </h3>
            <p className="mb-4 text-sm sm:text-base font-normal">
              Follow us on social media
            </p>
            <SocialMedia />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
