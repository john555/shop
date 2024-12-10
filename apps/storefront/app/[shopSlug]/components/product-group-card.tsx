import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent } from 'lucide-react'

interface ProductGroupCardProps {
  title: string
  description: string
  imageSrc: string
  link: string
  discount?: string
  offerText?: string
  spanFull?: boolean
}

export function ProductGroupCard({ 
  title, 
  description, 
  imageSrc, 
  link, 
  discount, 
  offerText,
  spanFull 
}: ProductGroupCardProps) {
  return (
    <Link href={link}>
      <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary h-full flex flex-col bg-card cursor-pointer relative ${spanFull ? 'sm:col-span-2 lg:col-span-3 xl:col-span-4' : ''}`}>
        <CardContent className="p-0 flex flex-col h-full">
          <div className={`relative ${spanFull ? 'aspect-[21/9]' : 'aspect-square'} overflow-hidden`}>
            <Image
              src={imageSrc}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent group-hover:from-primary/90 group-hover:via-primary/60 transition-colors duration-300" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end group-hover:translate-y-[-1rem] transition-transform duration-300">
              <h3 className="text-2xl sm:text-3xl font-bold text-white transition-colors drop-shadow-md mb-2">
                {title}
              </h3>
              <p className="text-lg text-white/90 transition-colors line-clamp-2 drop-shadow-md mb-4">
                {description}
              </p>
              {(discount || offerText) && (
                <div className="flex items-center space-x-2 mb-4">
                  {discount && (
                    <Badge variant="destructive" className="text-lg px-2 py-1">
                      <Percent className="w-4 h-4 mr-1" />
                      {discount} OFF
                    </Badge>
                  )}
                  {offerText && (
                    <span className="text-white text-lg font-semibold">{offerText}</span>
                  )}
                </div>
              )}
              <div className="bg-primary text-white text-center py-2 px-4 text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block self-start">
                Explore Products
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

