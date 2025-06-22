import Container from "@/components/main/Container";
import CategoryGrid from "@/components/RootOnly/CategoryGrid";
import HomeImageCarosel from "@/components/RootOnly/HomeImageCarosel";
import TrendingGrid from "@/components/RootOnly/TrendingGrid";

export default function RootPage() {
  return (
    <div className="mb-2">
      <HomeImageCarosel />
      <div className="text-center mt-5">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-snug max-w-3xl mx-auto px-2">
          Elevate Your Space with Timeless Furniture.
        </h1>
        <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl mt-2 max-w-2xl mx-auto px-2 text-zinc-600">
          Discover hand-crafted pieces that blend comfort, style, and durability.
        </p>
      </div>
      {/* Trending section */}
      <Container>
        <div className="mx-auto max-w-[90%] mt-10">
          <TrendingGrid limit={8} />
          <div>
            <h2 className=" text-center md:text-left font-semibold text-2xl mb-6">
              Categories
            </h2>
            <CategoryGrid />
          </div>
        </div>
      </Container>
    </div>
  );
}
