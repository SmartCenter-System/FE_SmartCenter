import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function Header() {
  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            SmartCenter
          </p>
          <h1 className="text-base font-semibold">Community Rescue Portal</h1>
        </div>

        <div className="hidden w-full max-w-sm md:block">
          <Input placeholder="Search help points..." />
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/user">User</Link>
          </Button>
          <Button asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
