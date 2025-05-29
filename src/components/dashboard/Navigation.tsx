import { Link } from "@tanstack/react-router";
import { BarChartIcon, HomeIcon, LinkIcon, SettingsIcon } from "lucide-react";

const links = [
  { title: "Overview", href: "/dashboard", icon: HomeIcon },
  { title: "My Links", href: "/dashboard/urls", icon: LinkIcon },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChartIcon },
  { title: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {links.map((link) => (
        <Link
          key={link.title}
          to={link.href}
          activeProps={{ className: "bg-blue-100" }}
          activeOptions={{ exact: link.href === "/dashboard" }}
          className="flex items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900"
        >
          <link.icon />
          {link.title}
        </Link>
      ))}
    </nav>
  );
};
