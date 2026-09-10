"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Task, TaskStatus } from "../types"
import { TaskDate } from "./task-date"
import { TaskActions } from "./task-actions"


export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return <p className="line-clamp-1 font-medium">{name}</p>
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus
      
      const badgeVariantMap: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
        [TaskStatus.TODO]: "destructive",
        [TaskStatus.IN_PROGRESS]: "secondary",
        [TaskStatus.DONE]: "default"
      }

      return (
        <Badge variant={badgeVariantMap[status] || "default"}>
          {status}
        </Badge>
      )
    }
  },
    {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return <TaskDate value={createdAt} />
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      const projectId = row.original.projectId
      return (
        <TaskActions id={id} projectId={projectId} />
      )
    }
  }
]