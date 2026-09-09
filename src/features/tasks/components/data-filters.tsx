"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListCheckIcon } from "lucide-react"
import { TaskStatus } from "../types"
import { useTaskFilters } from "../hooks/use-task-filters"

interface DataFiltersProps {
  hideProjectFilter?: boolean
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const [{ status, search }, setFilters] = useTaskFilters()

  const onStatusChange = (value: string | null) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        value={status ?? "all"}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
          <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
           </SelectContent>
      </Select>
    </div>
  )
}