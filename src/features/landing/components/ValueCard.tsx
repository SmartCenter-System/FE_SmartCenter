import { ArrowUpRight } from "lucide-react";

interface ValueCardProps {
  number: string;
  title: string;
  description: string;
}

export function ValueCard({ number, title, description }: ValueCardProps) {
  return (
    <div className="group flex h-full min-h-[320px] flex-col justify-between rounded-[24px] border border-transparent bg-slate-50 p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:bg-card md:p-10">
      <div className="flex justify-end w-full mb-6">
        <span className="text-6xl md:text-7xl font-extrabold text-primary opacity-90 transition-colors duration-300 group-hover:text-yellow-400">{number}</span>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-muted border border-border/50 text-foreground transition-colors duration-300 group-hover:border-yellow-400 group-hover:text-yellow-400">
          <ArrowUpRight className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
