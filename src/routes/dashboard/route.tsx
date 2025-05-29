import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Navigation } from "~/components/dashboard/Navigation";
import { Logo } from "~/components/home/Logo";
import { getUser } from "~/utils/auth-server";

export const Route = createFileRoute("/dashboard")({
  component: LayoutComponent,
  beforeLoad: async () => {
    const user = await getUser();
    console.log("user", user);
    if (!user) {
      console.log("no user");
      return redirect({ to: "/" });
    }
  },
});

function LayoutComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto h-screen max-w-7xl md:grid md:grid-cols-[280px_1fr]">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 md:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <Logo />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out md:hidden ${
            sidebarOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-in-out"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 w-full transform overflow-y-auto px-6 py-6 transition-transform duration-300 ease-in-out sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-gray-900" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <Navigation />
                <div className="py-6">
                  <button
                    type="button"
                    className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="p-6">
              <Logo />
            </div>

            {/* Navigation */}
            <Navigation />

            {/* User section */}
            <div className="p-4">
              <button
                type="button"
                className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] md:col-span-1 [&::-webkit-scrollbar]:hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
