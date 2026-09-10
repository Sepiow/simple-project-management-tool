import { useQuery } from "@tanstack/react-query"

interface UseGetChangelogsProps {
  taskId: string
}

export const useGetChangelogs = ({ taskId }: UseGetChangelogsProps) => {
  const query = useQuery({
    queryKey: ["task-changelogs", taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}/changelogs`)

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