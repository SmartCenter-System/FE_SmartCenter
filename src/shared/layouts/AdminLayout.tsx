import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="w-64 border-r border-border bg-background p-4">
          <p className="text-sm font-semibold">Admin Menu</p>
          <nav className="mt-4 space-y-2">
            <button className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted" type="button">
              Dashboard
            </button>
            <button className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted" type="button">
              Users
            </button>
            <button className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted" type="button">
              Settings
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
