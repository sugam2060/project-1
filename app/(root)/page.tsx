import Container from "@/components/main/Container";
import CategoryGrid from "@/components/RootOnly/CategoryGrid";
import HomeImageCarosel from "@/components/RootOnly/HomeImageCarosel";
import TrendingGrid from "@/components/RootOnly/TrendingGrid";


export default function RootPage() {
  return (
    <div className="mb-2">
      <HomeImageCarosel />
      <div className="text-center mt-5">
        <h1 className="font-bold text-2xl">Elevate Your Space with Timeless Furniture.</h1>
        <p className="font-semibold text-base">Discover hand-crafted pieces that blend comfort, style, and durability.</p>
      </div>
      {/* Trending section */}
      <Container>
        <div className="mx-auto max-w-[90%] mt-10">

          <TrendingGrid limit={8} />
          <div>
            <h2 className='md:text-left font-semibold text-xl md:text-3xl lg:text-3xl mb-6'>Categories</h2>
            <CategoryGrid />
          </div>
        </div>
      </Container>
    </div>
  );
}
