import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface StatCardProps {
  icon: ReactNode;
  count: number;
  label: string;
  description: string;
}

export function StatCard({ icon, count, label, description }: StatCardProps) {
  return (
    <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold text-foreground mb-2">{count}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="ml-4 flex-shrink-0">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
