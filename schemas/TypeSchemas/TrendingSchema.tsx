// Represents a single image of a product
export type ProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
};

// Represents the full product structure
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  brand: string;
  discount: number;
  slug: string;
  images: ProductImage[];  // Relation to images
};

// Represents a trending product with relation to Product
export type TrendingProduct = {
  id: string;
  productId: string;
  addedAt: Date;          // Defaults to now() in Prisma
  product: Product;       // Relation to Product
};
