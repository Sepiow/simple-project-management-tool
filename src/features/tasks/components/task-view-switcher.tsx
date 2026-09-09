"use client"

import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, Loader } from "lucide-react"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { useGetTasks } from "../api/use-get-tasks"
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { useTaskFilters } from "../hooks/use-task-filters"
import { DataFilters } from "./data-filters"

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean
}

export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table"
  })

  const [{ status, search, dueDate }] = useTaskFilters()
  const projectId = useProjectId()
  const { open } = useCreateTaskModal()

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    projectId,
    status,
    search,
    dueDate
  })

  return (
    <Tabs
      defaultValue={view}
      onValueChange={(val) => setView(val)}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>

        <div className="my-4">
          <DottedSeparator />
        </div>

        <DataFilters hideProjectFilter={hideProjectFilter} />

        <div className="my-4">
          <DottedSeparator />
        </div>

        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <div className="p-4 text-neutral-500 text-sm">
                Table view component will render here (found {tasks?.total || 0} tasks).
              </div>
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <div className="p-4 text-neutral-500 text-sm">
                Kanban board component will render here.
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <div className="p-4 text-neutral-500 text-sm">
                Calendar view component will render here.
              </div>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}