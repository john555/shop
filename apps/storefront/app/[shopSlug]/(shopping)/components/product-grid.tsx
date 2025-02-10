import { ProductCard } from "./product-card"
import { Product } from "@/types/admin-api"

interface ProductGridProps {
  products: Product[]
  buttonColor: string
}

export function ProductGrid({ products, buttonColor }: ProductGridProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            buttonColor={buttonColor}
          />
        ))}
      </div>
    </section>
  )
}

