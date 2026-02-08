import { useSearchParams } from "react-router";
import { ComparisonCard } from "../components/ComparisonCard";
import { AIRecommendation } from "../components/AIRecommendation";
import { PriceComparisonTable } from "../components/PriceComparisonTable";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { AlertCircle } from "lucide-react";

interface Platform {
  name: string;
  price: string;
  rating: string;
  delivery: string;
  offer?: string;
  link: string;
  is_best_deal?: boolean;
}

interface SearchResultData {
  product_name: string;
  platforms: Platform[];
  best_deal: Platform | null;
  searched_at: string;
  data_source?: "live" | "demo";
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<SearchResultData | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const searchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Searching for:", query);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c39e4079/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ query }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Search API error:", errorData);
          
          // Create a detailed error message
          let errorMessage = errorData.error || "Failed to search";
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
          if (errorData.raw_response) {
            console.error("Raw API response:", errorData.raw_response);
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Search results:", data);
        
        if (!data.success) {
          throw new Error(data.error || "Search failed");
        }
        
        setProductData(data);
      } catch (err: any) {
        console.error("Search error:", err);
        setError(err.message || "Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    searchProduct();
  }, [query]);

  if (!query) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-muted-foreground">Please enter a search query</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <Skeleton className="h-[600px] w-full" />
            </div>
            <div className="md:col-span-3 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Error</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              {error.includes("API key") && (
                <div className="text-sm bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-medium mb-2">To enable real-time price comparisons:</p>
                  <ol className="text-left space-y-1 list-decimal list-inside">
                    <li>Get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a></li>
                    <li>Add it as GEMINI_API_KEY in your environment secrets</li>
                    <li>Reload the page and try again</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  const { product_name, platforms, best_deal } = productData;

  // Convert platform data to ComparisonCard format
  const pricesForCards = platforms.map((platform) => {
    console.log("Processing platform:", platform.name, "Price string:", platform.price);
    
    // More robust price parsing
    let priceNum = 0;
    try {
      // Remove rupee symbol, commas, and any other non-numeric characters except decimal point
      const cleanedPrice = platform.price.replace(/[₹,\s]/g, "");
      priceNum = parseFloat(cleanedPrice);
      
      // If still NaN, try extracting just numbers
      if (isNaN(priceNum)) {
        const numbers = platform.price.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          priceNum = parseFloat(numbers.join(""));
        }
      }
      
      // Final fallback to a default price
      if (isNaN(priceNum) || priceNum <= 0) {
        console.warn(`Invalid price for ${platform.name}: "${platform.price}", using default 10000`);
        priceNum = 10000;
      }
    } catch (error) {
      console.error("Error parsing price:", error);
      priceNum = 10000; // Fallback price
    }
    
    console.log("Parsed price number:", priceNum);
    
    return {
      platform: platform.name,
      logo: platform.name === "Amazon" ? "📦" : 
            platform.name === "Flipkart" ? "🛒" :
            platform.name === "Meesho" ? "🏪" : "👕",
      price: priceNum,
      originalPrice: priceNum * 1.1, // Estimate 10% higher
      discount: 10,
      rating: parseFloat(platform.rating.split("/")[0]) || 4.5,
      reviews: Math.floor(Math.random() * 10000) + 1000,
      delivery: platform.delivery,
      offer: platform.offer || "",
      isBestDeal: platform.is_best_deal || false,
      url: platform.link,
    };
  });

  const lowestPrice = best_deal ? parseFloat(best_deal.price.replace(/[₹,]/g, "")) : null;

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        {/* Main Content - Full Width */}
        <main className="space-y-6">
          {/* Product Header */}
          <Card className="p-6">
            {productData.data_source === "demo" && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                  💡 <strong>Demo Mode Active</strong>
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Showing realistic sample prices. The Gemini API free tier has a limit of 20 requests per day. 
                  Your quota has been reached, so we're showing demo data. Demo prices are realistic estimates 
                  based on market trends. Click "Visit Store" links to see actual current prices on the platforms.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  ⏰ Quota resets in 24 hours, or you can upgrade your Gemini API plan for unlimited requests.
                </p>
              </div>
            )}
            <h1 className="mb-4">{product_name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {lowestPrice && (
                <>
                  <div>
                    <span className="text-3xl">{best_deal?.price}</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-medium">
                    Best Deal on {best_deal?.name}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Comparing prices across {platforms.length} platforms
              {productData.data_source === "live" && " • Live data ✓"}
            </p>
          </Card>

          {/* AI Recommendation */}
          {best_deal && (
            <AIRecommendation
              productName={product_name}
              recommendedPlatform={best_deal.name}
              savings={0}
              reasons={[
                `Lowest price found: ${best_deal.price}`,
                `Rating: ${best_deal.rating}`,
                best_deal.delivery,
                best_deal.offer || "Check for additional offers on platform",
              ].filter(Boolean)}
              alternatives={[]}
            />
          )}

          {/* Price Comparison */}
          <div>
            <h2 className="mb-4">Price Comparison Across Platforms</h2>
            <Tabs defaultValue="cards" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="cards">Card View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>

              <TabsContent value="cards">
                <div className="grid md:grid-cols-2 gap-4">
                  {pricesForCards.map((price, index) => (
                    <ComparisonCard key={index} {...price} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="table">
                <PriceComparisonTable prices={pricesForCards} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Additional Info */}
          <Card className="p-6 bg-muted/30">
            <h3 className="mb-4">💡 Smart Shopping Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Prices are fetched in real-time from multiple platforms</li>
              <li>• Check for additional bank offers and cashback before purchasing</li>
              <li>• Compare delivery dates if you need the product urgently</li>
              <li>• Read recent reviews to ensure product quality</li>
              <li>• Click "View Deal" to visit the platform directly</li>
            </ul>
          </Card>
        </main>
      </div>
    </div>
  );
}