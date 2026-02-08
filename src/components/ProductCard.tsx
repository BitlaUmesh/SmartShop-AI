import { Heart, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  lowestPrice: number;
  originalPrice: number;
  savings: number;
  platform: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  lastSearched?: string;
}

export function ProductCard({
  id,
  name,
  image,
  lowestPrice,
  originalPrice,
  savings,
  platform,
  isFavorite,
  onToggleFavorite,
  lastSearched,
}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {onToggleFavorite && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        )}
        <Badge className="absolute top-2 left-2 bg-[#10B981] hover:bg-[#10B981] text-white">
          <TrendingDown className="h-3 w-3 mr-1" />
          ₹{savings.toLocaleString()} off
        </Badge>
      </div>

      <div className="p-4">
        <h4 className="mb-2 line-clamp-2">{name}</h4>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl text-[#10B981]">₹{lowestPrice.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Best on {platform}</span>
          {lastSearched && (
            <span className="text-xs text-muted-foreground">{lastSearched}</span>
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => navigate(`/search?q=${encodeURIComponent(name)}`)}
        >
          Compare Prices
        </Button>
      </div>
    </Card>
  );
}
