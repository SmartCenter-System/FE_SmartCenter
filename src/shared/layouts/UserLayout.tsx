import { Outlet } from "react-router-dom";

import Footer from "@/shared/components/common/Footer";
import Header from "@/shared/components/common/Header";

export default function UserLayout() {
  return (
    <div className="app-shell min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <Header />
      <main className="content-wrap mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
