"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";

interface NavbarProps {
  title?: string;
  description?: string;
}

export const Navbar = ({
  title = "Home",
  description = "Monitor all of your projects and tasks here",
}: NavbarProps) => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
