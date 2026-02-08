import { Search, Smartphone, Laptop, Shirt, Zap, Watch } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";

const categories = [
  { name: "Mobiles", icon: Smartphone, color: "from-blue-500 to-blue-600" },
  { name: "Laptops", icon: Laptop, color: "from-purple-500 to-purple-600" },
  { name: "Fashion", icon: Shirt, color: "from-pink-500 to-pink-600" },
  { name: "Appliances", icon: Zap, color: "from-green-500 to-green-600" },
  { name: "Accessories", icon: Watch, color: "from-orange-500 to-orange-600" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-accent/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find the Best Deals with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compare prices across Amazon, Flipkart, Meesho, Myntra and more. Save money on every purchase with SmartShop AI.
          </p>

          {/* Main Search */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search any product…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-14 text-lg rounded-xl shadow-lg bg-card"
              />
            </div>
            <Button
              type="submit"
              className="mt-4 h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Compare Prices
            </Button>
          </form>

          {/* Quick Categories */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">Quick Categories</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border hover:border-primary transition-all hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${category.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Why Choose SmartShop AI?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Our intelligent algorithm finds the best deals and suggests alternatives to save you money.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get instant price comparisons across all major e-commerce platforms in seconds.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="mb-2">Save Money</h3>
              <p className="text-muted-foreground">
                Students in India save an average of ₹2,500 per month using SmartShop AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Start Saving Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of smart shoppers who save money every day
          </p>
          <Button
            onClick={() => document.querySelector("input")?.focus()}
            className="h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Search Your First Product
          </Button>
        </div>
      </section>
    </div>
  );
}
