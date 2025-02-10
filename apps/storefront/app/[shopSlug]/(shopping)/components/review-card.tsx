import { Star, StarHalf, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  product: string;
  starColor: string;
}

export function ReviewCard({
  name,
  rating,
  comment,
  product,
  starColor,
}: ReviewCardProps) {
  return (
    <Card className="h-full flex flex-col bg-background/50 backdrop-blur-sm border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">{name}</p>
              <p className="text-sm text-muted-foreground">{product}</p>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              if (starValue <= rating) {
                return (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{ fill: starColor, color: starColor }}
                  />
                );
              } else if (starValue - 0.5 <= rating) {
                return (
                  <StarHalf
                    key={i}
                    className="w-5 h-5"
                    style={{ fill: starColor, color: starColor }}
                  />
                );
              } else {
                return (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{
                      fill: 'none',
                      color: starColor,
                      stroke: starColor,
                    }}
                  />
                );
              }
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base italic text-muted-foreground">{comment}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${(rating / 5) * 100}%` }}
          ></div>
        </div>
      </CardFooter>
    </Card>
  );
}
