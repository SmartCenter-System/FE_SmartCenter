import { ArrowUpRight } from "lucide-react";

interface ValueCardProps {
  number: string;
  title: string;
  description: string;
}

export function ValueCard({ number, title, description }: ValueCardProps) {
  return (
    <div className="group flex flex-col justify-between p-8 md:p-10 bg-slate-50 dark:bg-card border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-[24px]">
      <div className="flex justify-end w-full mb-6">
        <span className="text-6xl md:text-7xl font-extrabold text-primary opacity-90">{number}</span>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-muted border border-border/50 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
          <ArrowUpRight className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
