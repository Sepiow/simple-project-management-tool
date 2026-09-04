"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { Plus } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 font-semibold">
          Workspaces
        </p>
        <button
          onClick={open}
          className="size-5 hover:opacity-75 transition text-neutral-500 hover:text-neutral-800"
          type="button"
          aria-label="Create workspace"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <Select value={workspaceId} onValueChange={onSelect}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                  className="size-7"
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
