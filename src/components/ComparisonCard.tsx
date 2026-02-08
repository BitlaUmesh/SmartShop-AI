import { ExternalLink, Star, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface ComparisonCardProps {
  platform: string;
  logo: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  delivery: string;
  offer?: string;
  isBestDeal?: boolean;
  url: string;
}

export function ComparisonCard({
  platform,
  logo,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  delivery,
  offer,
  isBestDeal,
  url,
}: ComparisonCardProps) {
  return (
    <Card className={`p-6 ${isBestDeal ? "border-[#10B981] border-2 relative" : ""}`}>
      {isBestDeal && (
        <Badge className="absolute -top-3 left-4 bg-[#10B981] text-white hover:bg-[#10B981]">
          🏆 Best Deal
        </Badge>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-xl">{logo}</span>
          </div>
          <div>
            <h3>{platform}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{rating}</span>
              <span className="text-muted-foreground">({reviews.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {discount && (
          <span className="text-sm text-[#10B981]">{discount}% off</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Truck className="h-4 w-4" />
        <span>{delivery}</span>
      </div>

      {offer && (
        <div className="mb-4 p-3 bg-accent/10 rounded-lg">
          <p className="text-sm text-accent">{offer}</p>
        </div>
      )}

      <Button
        className="w-full"
        asChild
      >
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Store
        </a>
      </Button>
    </Card>
  );
}