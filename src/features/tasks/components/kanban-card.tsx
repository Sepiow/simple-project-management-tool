import { Task } from "../types"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { TaskDate } from "./task-date"
import { TaskActions } from "./task-actions"
interface KanbanCardProps {
  task: Task
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-3 mb-2 rounded-md shadow-xs space-y-2 border hover:shadow-md transition">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm font-medium line-clamp-2">{task.name}</p>
        <TaskActions id={task.id} projectId={task.projectId} /> 
      </div>

      {task.contents && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.contents}
        </p>
      )}

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5">
        <TaskDate value={task.created_at} />
      </div>
    </div>
  )
}