"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CheckCircle2,
  HomeIcon,
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "",
    icon: HomeIcon,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: CheckCircle2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
];

interface NavigationProps {
  workspaceId?: string;
}

export const Navigation = ({ workspaceId }: NavigationProps) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-y-1">
      {routes.map((item) => {
        const fullHref = workspaceId 
          ? `/workspaces/${workspaceId}${item.href}` 
          : item.href || "/";
          
        const isActive = pathname === fullHref || (item.href === "" && pathname === `/workspaces/${workspaceId}`);
        const Icon = item.icon;

        return (
          <li key={item.label}>
            <Link href={fullHref}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {item.label}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
