"use client";

import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./custom/dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { Projects } from "@/features/projects/components/projects";

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full flex flex-col">
      <Link href="/" onClick={onNavigate}>
        <Image src="/logo.svg" alt="logo" width={164} height={48} priority />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
