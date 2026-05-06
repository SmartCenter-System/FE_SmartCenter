import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-400">
        <aside className="w-64 border-r border-border bg-background p-4">
          <p className="text-sm font-semibold">Admin Menu</p>
          <nav className="mt-4 space-y-2">
            <Link to="/admin/dashboard" className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
              Dashboard
            </Link>
            <Link
              to="/admin/courses"
              className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted bg-muted/50 font-medium"
            >
              Courses
            </Link>
            <Link to="/admin/users" className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
              Users
            </Link>

            <Link to="/admin/settings" className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
