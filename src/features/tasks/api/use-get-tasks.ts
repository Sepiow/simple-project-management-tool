import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/rpc"
import { TaskStatus } from "../types"

interface UseGetTasksProps {
  projectId?: string | null
  status?: TaskStatus | null
  search?: string | null
  dueDate?: string | null
}

export const useGetTasks = ({
  projectId,
  status,
  search,
  dueDate
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      {
        projectId,
        status,
        search,
        dueDate
      }
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const { data } = await response.json()
      return data
    }
  })

  return query
}