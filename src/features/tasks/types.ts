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
  contents?: string 
  created_at?: string
  updated_at?: string
}