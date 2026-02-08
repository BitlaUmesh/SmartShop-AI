import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const mockHistory = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra 5G",
    image: "https://images.unsplash.com/photo-1673718424704-51d0d2ca1fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmUlMjBwcm9kdWN0fGVufDF8fHx8MTc3MDM4ODI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 124999,
    originalPrice: 134999,
    savings: 10000,
    platform: "Flipkart",
    lastSearched: "2 hours ago",
  },
  {
    id: "2",
    name: "MacBook Air M2 13.6-inch",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHByb2R1Y3R8ZW58MXx8fHwxNzM4OTg1NDExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 104990,
    originalPrice: 119900,
    savings: 14910,
    platform: "Amazon",
    lastSearched: "Yesterday",
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBwcm9kdWN0fGVufDF8fHx8MTczODk4NTQxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 27990,
    originalPrice: 34990,
    savings: 7000,
    platform: "Flipkart",
    lastSearched: "2 days ago",
  },
  {
    id: "4",
    name: "Nike Air Max Running Shoes",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0fGVufDF8fHx8MTczODk4NTQxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    lowestPrice: 6995,
    originalPrice: 9995,
    savings: 3000,
    platform: "Myntra",
    lastSearched: "3 days ago",
  },
];

export default function History() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1>Search History</h1>
              <p className="text-muted-foreground">Recently viewed products</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </div>

        {mockHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockHistory.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No search history</h3>
            <p className="text-muted-foreground mb-6">
              Start searching for products to see them here
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