import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package2, Layers, Wrench } from "lucide-react";
import type { CategorySummary } from "@shared/schema";

interface TopCategoriesProps {
  categories?: CategorySummary[];
  isLoading: boolean;
}

const categoryIcons = {
  "Doors": Package2,
  "Plywood": Layers,
  "Hardware": Wrench,
};

export default function TopCategories({ categories, isLoading }: TopCategoriesProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {categories?.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No categories available
            </div>
          ) : (
            categories?.slice(0, 3).map((category) => {
              const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Package2;
              
              return (
                <div key={category.category} className="flex items-center justify-between" data-testid={`category-${category.category.toLowerCase()}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground" data-testid={`category-name-${category.category.toLowerCase()}`}>
                        {category.category}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`category-count-${category.category.toLowerCase()}`}>
                        {category.productCount} products
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground" data-testid={`category-value-${category.category.toLowerCase()}`}>
                      ${category.totalValue.toLocaleString()}
                    </p>
                    <p className={`text-xs ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid={`category-growth-${category.category.toLowerCase()}`}>
                      {category.growth >= 0 ? '+' : ''}{category.growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
