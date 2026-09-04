"use server";

import { getCurrent } from "@/features/auth/actions";
import { dbWorkspaces, dbMembers } from "@/lib/mock-db";
import { Workspace } from "./types";

export const getWorkspaces = async (): Promise<{ documents: Workspace[]; total: number }> => {
  const user = await getCurrent();
  if (!user) {
    return { documents: [], total: 0 };
  }

  // TODO: Fetch from Dowinnsys API
  const workspaces = dbWorkspaces.list(user.user_id);
  return { documents: workspaces, total: workspaces.length };
};

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }): Promise<Workspace | null> => {
  const user = await getCurrent();
  if (!user) {
    return null;
  }

  // TODO: Fetch from Dowinnsys API
  const workspace = dbWorkspaces.getById(workspaceId);
  return workspace;
};

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
  const workspace = dbWorkspaces.getById(workspaceId);
  if (!workspace) {
    return null;
  }

  return {
    name: workspace.name,
  };
};
