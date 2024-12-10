import { Button } from "@/components/ui/button"

export function PromotionalBanner() {
  return (
    <section className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Summer Sale: Up to 30% Off!</h2>
        <p className="text-lg mb-6">Get amazing discounts on our eco-friendly products. Limited time offer!</p>
        <Button variant="secondary" size="lg">Shop the Sale</Button>
      </div>
    </section>
  )
}

