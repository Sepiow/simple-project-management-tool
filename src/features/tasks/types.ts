export enum TaskStatus {
  TODO = "Todo",
  IN_PROGRESS = "In Progress",
  DONE = "Done"
}

export type Task = {
  id: number | string
  name: string
  status: TaskStatus
  projectId: number | string
  description?: string
  dueDate?: string
  position?: number
  created_at?: string
  updated_at?: string
}