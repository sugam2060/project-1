import Container from "@/components/main/Container";
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
          <h1 className="font-bold text-3xl mb-5">Trending Products</h1>
          <TrendingGrid limit={3} />
        </div>
      </Container>
    </div>
  );
}
