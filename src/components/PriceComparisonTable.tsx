import { ExternalLink, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface PriceData {
  platform: string;
  logo: string;
  price: number;
  discount?: number;
  delivery: string;
  rating: number;
  offer?: string;
  isBestDeal?: boolean;
  url: string;
}

interface PriceComparisonTableProps {
  prices: PriceData[];
}

export function PriceComparisonTable({ prices }: PriceComparisonTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((price, index) => (
            <TableRow
              key={index}
              className={price.isBestDeal ? "bg-[#10B981]/5" : ""}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{price.logo}</span>
                  <span>{price.platform}</span>
                  {price.isBestDeal && (
                    <Badge className="ml-2 bg-[#10B981] hover:bg-[#10B981] text-white">
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className={price.isBestDeal ? "text-[#10B981]" : ""}>
                    ₹{price.price.toLocaleString()}
                  </span>
                  {price.discount && (
                    <span className="text-xs text-[#10B981]">
                      {price.discount}% off
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{price.delivery}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-sm">{price.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                {price.offer ? (
                  <span className="text-sm text-muted-foreground">{price.offer}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={price.isBestDeal ? "default" : "outline"}
                  asChild
                >
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Buy
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}