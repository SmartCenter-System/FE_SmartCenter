import FullscreenHero from "./components/FullscreenHero";
import { CoreValuesSection } from "./components/CoreValuesSection";
import { FeaturedCoursesSection } from "./components/FeaturedCoursesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <main className="flex-1">
        <FullscreenHero className="relative isolate h-screen w-full overflow-hidden bg-[#0E3BAF] pt-[72px]" />
        <CoreValuesSection />
        <FeaturedCoursesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
    </div>
  );
}
