
import { Suspense } from "react";
import ProductLoadingSkeleton from "@/components/main/ProductLoadingSkeleton";
import Container from "@/components/main/Container";

export default function RootPage() {

  return (
    <div className="mt-2 mb-2">
  <Container className="grid grid-cols-1 px-2 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <Suspense fallback={<ProductLoadingSkeleton />}>
      <div>
          asd
      </div>
    </Suspense>
  </Container>
</div>
  );
}
