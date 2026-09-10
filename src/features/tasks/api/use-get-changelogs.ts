import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/rpc"

interface UseGetChangelogsProps {
  taskId: string
}

export const useGetChangelogs = ({ taskId }: UseGetChangelogsProps) => {
  const query = useQuery({
    queryKey: ["task-changelogs", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["changelogs"].$get({
        param: { taskId }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch changelogs")
      }

      const { data } = await response.json()
      return data
    },
    enabled: !!taskId
  })

  return query
}