"use client"

import { useGetProjectLogs } from "../api/use-get-project-logs"
import { Badge } from "@/components/ui/badge"
import { Loader, HistoryIcon, ArrowRightIcon } from "lucide-react"
import { format } from "date-fns"

interface ProjectTaskLogsProps {
  projectId: string | null
}

const renderStatusBadge = (statusName?: string) => {
  if (!statusName) return <Badge variant="outline" className="text-[10px] px-2 py-0.5">Unknown</Badge>
  
  const lower = statusName.toLowerCase()
  if (lower.includes("todo")) {
    return <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-medium">Todo</Badge>
  }
  if (lower.includes("progress")) {
    return <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-medium bg-amber-100 text-amber-900 border-amber-300">In Progress</Badge>
  }
  if (lower.includes("done")) {
    return <Badge variant="default" className="text-[10px] px-2 py-0.5 font-medium bg-emerald-600 text-white hover:bg-emerald-700">Done</Badge>
  }
  return <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium">{statusName}</Badge>
}

export const ProjectTaskLogs = ({ projectId }: ProjectTaskLogsProps) => {
  const { data: logs, isLoading } = useGetProjectLogs({ projectId })

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-neutral-50/50 text-center">
        <HistoryIcon className="size-8 text-neutral-400 mb-2" />
        <p className="text-sm font-semibold text-neutral-700">No task history recorded yet</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Move tasks on the Kanban board or update their statuses to see audit logs appear here in real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg border bg-white overflow-hidden shadow-xs">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b">
        <div className="col-span-4 sm:col-span-3">Task</div>
        <div className="col-span-5 sm:col-span-5">Status Transition</div>
        <div className="hidden sm:block sm:col-span-2">Remark</div>
        <div className="col-span-3 sm:col-span-2 text-right">Date & Time</div>
      </div>

      <div className="divide-y divide-neutral-100">
        {logs.map((log: any, index: number) => {
          const oldStatus =
            log.old_status ||
            log.oldStatus ||
            log.old_value ||
            log.before_status ||
            (typeof log.remark === "string" ? log.remark.match(/from\s+([a-zA-Z\s]+?)\s+to/i)?.[1]?.trim() : null) ||
            "Todo"

          const newStatus =
            log.new_status ||
            log.newStatus ||
            log.new_value ||
            log.after_status ||
            (typeof log.remark === "string" ? log.remark.match(/to\s+([a-zA-Z\s]+)/i)?.[1]?.trim() : null) ||
            "Done"

          return (
            <div
              key={log.id || index}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-xs items-center hover:bg-neutral-50/80 transition"
            >
              {/* Task Name */}
              <div className="col-span-4 sm:col-span-3 font-semibold text-neutral-800 truncate">
                {log.task_name || `Task #${log.task_id || log.taskId}`}
              </div>

              {/* Status Transition: old -> new */}
              <div className="col-span-5 sm:col-span-5 flex items-center gap-1.5 flex-wrap">
                {renderStatusBadge(oldStatus)}
                <ArrowRightIcon className="size-3 text-neutral-400 shrink-0" />
                {renderStatusBadge(newStatus)}
              </div>

              {/* Remark */}
              <div className="hidden sm:block sm:col-span-2 text-neutral-500 italic truncate">
                {log.remark || "Status updated"}
              </div>

              {/* Timestamp */}
              <div className="col-span-3 sm:col-span-2 text-right text-muted-foreground whitespace-nowrap">
                {log.created_at ? format(new Date(log.created_at), "MMM d, yyyy h:mm a") : "-"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}