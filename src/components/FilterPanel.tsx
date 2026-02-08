import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface FilterPanelProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const brands = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme"];
  const platforms = ["Amazon", "Flipkart", "Meesho", "Myntra"];
  const deliveryOptions = ["Same Day", "1-2 Days", "3-5 Days", "5+ Days"];

  return (
    <Card className="p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h3>Filters</h3>
        <Button variant="ghost" size="sm">Clear All</Button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="mb-3 block">Price Range</Label>
        <Slider
          defaultValue={[0, 100000]}
          max={100000}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹0</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <Label className="mb-3 block">Minimum Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                {rating}★ & above
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <Label className="mb-3 block">Brand</Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={`brand-${brand}`} />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-6">
        <Label className="mb-3 block">Platform</Label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox id={`platform-${platform}`} defaultChecked />
              <label
                htmlFor={`platform-${platform}`}
                className="text-sm cursor-pointer"
              >
                {platform}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div className="mb-6">
        <Label className="mb-3 block">Delivery Time</Label>
        <div className="space-y-2">
          {deliveryOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={`delivery-${option}`} />
              <label
                htmlFor={`delivery-${option}`}
                className="text-sm cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </Card>
  );
}
