'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Product {
  name: string;
  sales: number;
  maxSales: number;
  revenue: string;
}

const topProducts: Product[] = [
  { name: 'Ready Player One', sales: 423, maxSales: 500, revenue: 'NT$ 253,800' },
  { name: 'Eragon', sales: 356, maxSales: 500, revenue: 'NT$ 534,000' },
  { name: 'The Fun of It', sales: 289, maxSales: 500, revenue: 'NT$ 115,600' },
  { name: 'Python For Kids', sales: 218, maxSales: 500, revenue: 'NT$ 327,000' },
  { name: 'The Little Prince', sales: 176, maxSales: 500, revenue: 'NT$ 158,400' },
];

export default function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Book Sell</CardTitle>
        <CardDescription>Top 5 best-selling books</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0 ml-2">
                  {product.revenue}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={(product.sales / product.maxSales) * 100}
                  className="h-2 flex-1"
                />
                <span className="text-xs font-mono text-muted-foreground w-10 text-right shrink-0">
                  {product.sales}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
