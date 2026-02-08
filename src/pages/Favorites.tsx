import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const initialFavorites = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra 5G",
    image: "https://images.unsplash.com/photo-1673718424704-51d0d2ca1fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmUlMjBwcm9kdWN0fGVufDF8fHx8MTc3MDM4ODI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 124999,
    originalPrice: 134999,
    savings: 10000,
    platform: "Flipkart",
    isFavorite: true,
  },
  {
    id: "2",
    name: "MacBook Air M2 13.6-inch",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHByb2R1Y3R8ZW58MXx8fHwxNzM4OTg1NDExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 104990,
    originalPrice: 119900,
    savings: 14910,
    platform: "Amazon",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBwcm9kdWN0fGVufDF8fHx8MTczODk4NTQxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 27990,
    originalPrice: 34990,
    savings: 7000,
    platform: "Flipkart",
    isFavorite: true,
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const navigate = useNavigate();

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1>My Favorites</h1>
            <p className="text-muted-foreground">
              {favorites.length} saved deal{favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Save products you like to keep track of the best deals
            </p>
            <Button onClick={() => navigate("/")}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}