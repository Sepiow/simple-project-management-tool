// Centralized local mock database for offline & development workflows.
// TODO: Replace these functions with direct Dowinnsys API calls when connecting backend.

export interface MockWorkspace {
  $id: string;
  name: string;
  imageUrl?: string;
  inviteCode: string;
  userId: string;
  createdAt: string;
}

export interface MockMember {
  $id: string;
  userId: string;
  workspaceId: string;
  role: "ADMIN" | "MEMBER";
  name: string;
  email: string;
}

export interface MockProject {
  $id: string;
  name: string;
  imageUrl?: string;
  workspaceId: string;
}

export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface MockTask {
  $id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  description?: string;
  status: TaskStatus;
  position: number;
}

// Initial mock dataset
let workspaces: MockWorkspace[] = [
  {
    $id: "ws-default-1",
    name: "Workspace 1",
    inviteCode: "inv-abc12345",
    userId: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    $id: "ws-default-2",
    name: "Development Team",
    inviteCode: "inv-dev99887",
    userId: "admin",
    createdAt: new Date().toISOString(),
  },
];

let members: MockMember[] = [
  {
    $id: "mem-1",
    userId: "admin",
    workspaceId: "ws-default-1",
    role: "ADMIN",
    name: "Admin User",
    email: "admin@example.com",
  },
  {
    $id: "mem-2",
    userId: "admin",
    workspaceId: "ws-default-2",
    role: "ADMIN",
    name: "Admin User",
    email: "admin@example.com",
  },
];

let projects: MockProject[] = [
  {
    $id: "proj-1",
    name: "Platform Roadmap",
    workspaceId: "ws-default-1",
  },
  {
    $id: "proj-2",
    name: "Mobile App v2",
    workspaceId: "ws-default-1",
  },
  {
    $id: "proj-3",
    name: "API Gateway",
    workspaceId: "ws-default-2",
  },
];

let tasks: MockTask[] = [
  {
    $id: "task-1",
    name: "Setup authentication & cookie session",
    workspaceId: "ws-default-1",
    projectId: "proj-1",
    assigneeId: "mem-1",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: "Implement secure session cookie verification with Hono RPC.",
    status: "DONE",
    position: 1000,
  },
  {
    $id: "task-2",
    name: "Build responsive Kanban board",
    workspaceId: "ws-default-1",
    projectId: "proj-1",
    assigneeId: "mem-1",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    description: "Allow dragging tasks across status columns and switching views.",
    status: "IN_PROGRESS",
    position: 1000,
  },
  {
    $id: "task-3",
    name: "Integrate Dowinnsys API backend",
    workspaceId: "ws-default-1",
    projectId: "proj-1",
    assigneeId: "mem-1",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    description: "Connect endpoints to https://m-backend.dowinnsys.com.",
    status: "TODO",
    position: 1000,
  },
  {
    $id: "task-4",
    name: "Draft release documentation",
    workspaceId: "ws-default-1",
    projectId: "proj-2",
    assigneeId: "mem-1",
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    description: "Write complete user guide for workspace creation.",
    status: "BACKLOG",
    position: 1000,
  },
];

// Helper to generate 8-char random alphanumeric ID
export const generateId = () => Math.random().toString(36).substring(2, 10);

// Workspaces Store
export const dbWorkspaces = {
  list: (userId?: string) => {
    // TODO: Call Dowinnsys API GET /workspaces
    return workspaces;
  },
  getById: (id: string) => {
    // TODO: Call Dowinnsys API GET /workspaces/:id
    return workspaces.find((w) => w.$id === id) || null;
  },
  create: (data: { name: string; imageUrl?: string; userId: string }) => {
    // TODO: Call Dowinnsys API POST /workspaces
    const newWs: MockWorkspace = {
      $id: generateId(),
      name: data.name,
      imageUrl: data.imageUrl,
      inviteCode: generateId(),
      userId: data.userId,
      createdAt: new Date().toISOString(),
    };
    workspaces.push(newWs);

    // Auto-create admin member
    members.push({
      $id: generateId(),
      userId: data.userId,
      workspaceId: newWs.$id,
      role: "ADMIN",
      name: data.userId,
      email: `${data.userId}@example.com`,
    });

    return newWs;
  },
  update: (id: string, data: Partial<MockWorkspace>) => {
    // TODO: Call Dowinnsys API PATCH /workspaces/:id
    const index = workspaces.findIndex((w) => w.$id === id);
    if (index === -1) return null;
    workspaces[index] = { ...workspaces[index], ...data };
    return workspaces[index];
  },
  delete: (id: string) => {
    // TODO: Call Dowinnsys API DELETE /workspaces/:id
    workspaces = workspaces.filter((w) => w.$id !== id);
    projects = projects.filter((p) => p.workspaceId !== id);
    tasks = tasks.filter((t) => t.workspaceId !== id);
    members = members.filter((m) => m.workspaceId !== id);
    return true;
  },
  resetInviteCode: (id: string) => {
    // TODO: Call Dowinnsys API POST /workspaces/:id/reset-invite-code
    const ws = workspaces.find((w) => w.$id === id);
    if (!ws) return null;
    ws.inviteCode = generateId();
    return ws;
  },
};

// Members Store
export const dbMembers = {
  listByWorkspace: (workspaceId: string) => {
    // TODO: Call Dowinnsys API GET /workspaces/:id/members
    return members.filter((m) => m.workspaceId === workspaceId);
  },
  getMember: (workspaceId: string, userId: string) => {
    return members.find((m) => m.workspaceId === workspaceId && m.userId === userId) || null;
  },
  add: (workspaceId: string, userId: string, role: "ADMIN" | "MEMBER" = "MEMBER") => {
    // TODO: Call Dowinnsys API POST /workspaces/:id/join
    const newMember: MockMember = {
      $id: generateId(),
      userId,
      workspaceId,
      role,
      name: userId,
      email: `${userId}@example.com`,
    };
    members.push(newMember);
    return newMember;
  },
  updateRole: (memberId: string, role: "ADMIN" | "MEMBER") => {
    const mem = members.find((m) => m.$id === memberId);
    if (!mem) return null;
    mem.role = role;
    return mem;
  },
  delete: (memberId: string) => {
    members = members.filter((m) => m.$id !== memberId);
    return true;
  },
};

// Projects Store
export const dbProjects = {
  listByWorkspace: (workspaceId: string) => {
    // TODO: Call Dowinnsys API GET /workspaces/:id/projects
    return projects.filter((p) => p.workspaceId === workspaceId);
  },
  getById: (id: string) => {
    return projects.find((p) => p.$id === id) || null;
  },
  create: (data: { name: string; imageUrl?: string; workspaceId: string }) => {
    // TODO: Call Dowinnsys API POST /projects
    const newProj: MockProject = {
      $id: generateId(),
      name: data.name,
      imageUrl: data.imageUrl,
      workspaceId: data.workspaceId,
    };
    projects.push(newProj);
    return newProj;
  },
  update: (id: string, data: Partial<MockProject>) => {
    const index = projects.findIndex((p) => p.$id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...data };
    return projects[index];
  },
  delete: (id: string) => {
    projects = projects.filter((p) => p.$id !== id);
    tasks = tasks.filter((t) => t.projectId !== id);
    return true;
  },
};

// Tasks Store
export const dbTasks = {
  list: (filter: { workspaceId: string; projectId?: string; status?: TaskStatus; assigneeId?: string; search?: string }) => {
    // TODO: Call Dowinnsys API GET /tasks
    return tasks.filter((t) => {
      if (t.workspaceId !== filter.workspaceId) return false;
      if (filter.projectId && t.projectId !== filter.projectId) return false;
      if (filter.status && t.status !== filter.status) return false;
      if (filter.assigneeId && t.assigneeId !== filter.assigneeId) return false;
      if (filter.search && !t.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },
  getById: (id: string) => {
    return tasks.find((t) => t.$id === id) || null;
  },
  create: (data: Omit<MockTask, "$id">) => {
    // TODO: Call Dowinnsys API POST /tasks
    const newTask: MockTask = {
      $id: generateId(),
      ...data,
    };
    tasks.push(newTask);
    return newTask;
  },
  update: (id: string, data: Partial<MockTask>) => {
    const index = tasks.findIndex((t) => t.$id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
  },
  bulkUpdate: (updates: { $id: string; status: TaskStatus; position: number }[]) => {
    // TODO: Call Dowinnsys API POST /tasks/bulk-update
    updates.forEach((u) => {
      const t = tasks.find((task) => task.$id === u.$id);
      if (t) {
        t.status = u.status;
        t.position = u.position;
      }
    });
    return true;
  },
  delete: (id: string) => {
    tasks = tasks.filter((t) => t.$id !== id);
    return true;
  },
};
