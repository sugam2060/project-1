import React, { Suspense } from "react";
import Image from "next/image";
import { getInteriorCategories, getInteriorImagesByCategory } from "@/actions/ManagesMisc/InteriorPageMgmt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileCategoryFilter } from "@/components/RootOnly/MobileCategoryFilter";
import UniversalLoader from "@/components/main/UniversalLoader";
import Link from "next/link";

// function HeroSkeleton() {
//   return (
//     <div className="w-full h-[350px] md:h-[500px] bg-zinc-300 animate-pulse rounded-lg" />
//   );
// }

const fallbackImages = [
  "/interior_assets/interior-1.jpg",
  "/interior_assets/interior-2.jpg",
  "/interior_assets/interior-3.jpg",
];

// Category Gallery Component
const CategoryGallery = async ({ categoryId }: { categoryId: string }) => {
  let images: string[] = [];
  
  try {
    images = await getInteriorImagesByCategory(categoryId);
  } catch (error) {
    console.error("Failed to load images for category:", error);
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">No images available for this category yet.</p>
        <p className="text-sm text-gray-500">Please check back later for new projects.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {images.map((src: string, idx: number) => (
        <div
          key={idx}
          className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300"
        >
          <Image
            src={src}
            alt={`Interior project ${idx + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
};

interface InteriorCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const InteriorPageContent = async () => {
  let categories: InteriorCategory[] = [];
  
  try {
    categories = await getInteriorCategories();
  } catch (error) {
    console.error("Failed to load interior categories:", error);
  }

  const heroImage =fallbackImages[0];

  return (
    <div className="min-h-screen bg-white text-zinc-800 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden">
        <Image
          src={heroImage}
          alt="Featured Interior Design"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Interior Design by Kalika Kasta Furniture Udyog
          </h1>
          <p className="text-lg md:text-2xl text-zinc-100 max-w-3xl mx-auto">
            Transform your space with handcrafted interior design tailored for
            you.
          </p>
        </div>
      </section>

      {/* Services Description */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">
          Our Interior Design Approach
        </h2>
        <p className="text-center text-zinc-600 md:text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
          Every space has a story. We turn your ideas into vibrant, functional
          environments—from homes to offices to showrooms—ensuring every detail
          speaks your personality and purpose.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Personalized Consultation",
              desc: "We co-create with you to design living spaces that match your needs and aesthetics.",
            },
            {
              title: "Custom Furniture & Decor",
              desc: "Handcrafted furniture designed to harmonize with your space and elevate comfort.",
            },
            {
              title: "End-to-End Execution",
              desc: "We handle everything—from concept to completion—ensuring a seamless experience.",
            },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 text-center"
            >
              <h3 className="font-semibold text-lg mb-2 text-zinc-700">
                {service.title}
              </h3>
              <p className="text-zinc-500 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Description Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-zinc-700 space-y-8">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          About Our Services
        </h2>
        <p>
          Welcome to <strong>Kalika Kasta Furniture Udyog</strong>, where design
          meets craftsmanship. Our Interior Design and Furniture Services bring
          together creative spatial transformation and expertly crafted
          furniture under one roof. Whether you&apos;re furnishing your dream home or
          setting up a modern office, we deliver holistic solutions that blend
          style, comfort, and functionality.
        </p>

        <h3 className="text-xl font-semibold">Interior Design Services</h3>
        <p>
          Our interior design services are fully tailored to reflect your unique
          lifestyle and personality. From concept to completion, we guide you
          through every step—design ideation, layout planning, color
          consultation, material selection, and final execution. Our in-house
          team ensures that your space is not only aesthetically pleasing but
          also practical and aligned with your needs.
        </p>

        <h3 className="text-xl font-semibold">
          Custom Furniture Manufacturing
        </h3>
        <p>
          What sets us apart is our own furniture workshop. We build
          high-quality, custom furniture that fits perfectly within your
          interiors. Be it sofas, beds, modular kitchens, or office desks—each
          piece is crafted with precision, using premium wood and materials to
          ensure durability, beauty, and timeless appeal.
        </p>

        <h3 className="text-xl font-semibold">Why Choose Us?</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>End-to-end interior and furniture services under one roof</li>
          <li>Completely personalized designs and consultations</li>
          <li>Cost-effective solutions with in-house production</li>
          <li>Experienced team of designers and craftsmen</li>
          <li>Turnkey project execution with quality assurance</li>
        </ul>

        <p>
          Whether you&apos;re building a new space or revamping an old one, our team
          brings expertise, creativity, and commitment to every project. We
          don&apos;t just decorate; we design experiences.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Our Interior Projects by Category
        </h2>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No interior categories available yet.</p>
            <p className="text-sm text-gray-500">Please check back later for our interior design projects.</p>
          </div>
        ) : (
          <div className="w-full">
            {/* Mobile: Popover Filter */}
            <MobileCategoryFilter 
              categories={categories} 
              defaultCategoryId={categories[0]?.id || ""} 
            />

            {/* Desktop: Tabs */}
            <div className="hidden md:block">
              <Tabs defaultValue={categories[0]?.id || ""} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-8 max-w-4xl mx-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <CategoryGallery categoryId={category.id} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}
      </section>

      {/* Contact / CTA */}
      <section className="bg-gradient-to-br from-white via-zinc-100 to-white py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-zinc-800">
            Ready to Transform Your Space?
          </h3>
          <p className="text-zinc-600 text-base md:text-lg mb-8">
            Schedule a consultation with our expert interior designers and bring
            your vision to life with Kalika Kasta.
          </p>
          <Link href={'/contact'} aria-label="Contact Kalika Kasta Interior Design Team"
            className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-zinc-800 transition-colors text-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

const InteriorPage = () => (
  <Suspense fallback={<UniversalLoader text="Loading Interior Projects..." fullScreen={true} />}>
    <InteriorPageContent />
  </Suspense>
);

export default InteriorPage;
