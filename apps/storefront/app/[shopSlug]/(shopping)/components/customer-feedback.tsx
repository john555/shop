"use client"

import React, { useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ReviewCard } from './review-card'

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  product: string
}

interface CustomerFeedbackProps {
  reviews: Review[]
  starColor: string
}

export function CustomerFeedback({ reviews, starColor }: CustomerFeedbackProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      if (api) {
        api.scrollNext()
      }
    }, 5000)

    return () => clearInterval(autoplayInterval)
  }, [api])

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">What Our Customers Say</h2>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="sm:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1">
                  <ReviewCard
                    name={review.name}
                    rating={review.rating}
                    comment={review.comment}
                    product={review.product}
                    starColor={starColor}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm" />
        </Carousel>
        <div className="flex justify-center mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                index === current - 1 ? 'bg-primary w-4' : 'bg-primary/30'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

