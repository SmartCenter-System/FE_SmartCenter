import { Outlet, useLocation } from "react-router-dom";
import Header from "@/shared/components/common/Header";
import Footer from "@/shared/components/common/Footer";

export default function LandingLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const headerTone = isHomePage ? "auto" : "solid";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
    {!isAuthPage ? <Header tone={headerTone} /> : null}

      {/* Main Content */}
      <main className={isHomePage || isAuthPage ? "flex-1 flex flex-col" : "flex-1 flex flex-col pt-[72px]"}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
