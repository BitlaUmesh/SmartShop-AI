import { Sparkles, TrendingDown, Clock, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface AIRecommendationProps {
  productName: string;
  recommendedPlatform: string;
  savings: number;
  reasons: string[];
  alternatives?: Array<{
    name: string;
    price: number;
    savings: number;
  }>;
}

export function AIRecommendation({
  productName,
  recommendedPlatform,
  savings,
  reasons,
  alternatives,
}: AIRecommendationProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3>AI Recommendation</h3>
      </div>

      <div className="mb-4">
        <p className="text-lg mb-2">
          Best choice: <span className="font-semibold">{recommendedPlatform}</span>
        </p>
        <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white">
          Save ₹{savings.toLocaleString()}
        </Badge>
      </div>

      <div className="mb-6">
        <p className="text-sm mb-3">Why this is the best deal:</p>
        <div className="space-y-2">
          {reasons.map((reason, index) => {
            // Get appropriate icon based on content or position
            const Icon = index === 0 ? TrendingDown : 
                        index === 1 ? Clock : 
                        index === 2 ? Shield : null;
            
            return (
              <div key={index} className="flex items-start gap-2 text-sm">
                {Icon && <Icon className={`h-4 w-4 mt-0.5 ${
                  index === 0 ? 'text-[#10B981]' : 
                  index === 1 ? 'text-primary' : 
                  'text-accent'
                }`} />}
                {!Icon && <span className="h-4 w-4 mt-0.5 inline-block">•</span>}
                <span className="text-muted-foreground">{reason}</span>
              </div>
            );
          })}
        </div>
      </div>

      {alternatives && alternatives.length > 0 && (
        <div>
          <p className="text-sm mb-3">Alternative suggestions:</p>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg"
              >
                <div>
                  <p className="text-sm">{alt.name}</p>
                  <p className="text-xs text-muted-foreground">₹{alt.price.toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="text-[#10B981] border-[#10B981]">
                  -₹{alt.savings}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}