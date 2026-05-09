import { Outlet, useLocation } from "react-router-dom";
import Header from "@/shared/components/common/Header";
import Footer from "@/shared/components/common/Footer";
import ProgressBar from "@/shared/components/common/ProgressBar";
import ScrollToTop from "@/shared/components/common/ScrollToTop";

export default function LandingLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const headerTone = isHomePage ? "auto" : "solid";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <ScrollToTop />
      <ProgressBar />
      <Header tone={headerTone} />

      {/* Main Content */}
      <main className={isHomePage ? "flex-1 flex flex-col" : "flex-1 flex flex-col pt-[72px]"}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
