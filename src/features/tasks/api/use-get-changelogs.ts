import { useQuery } from "@tanstack/react-query"

interface UseGetChangelogsProps {
  taskId: string
}

export const useGetChangelogs = ({ taskId }: UseGetChangelogsProps) => {
  const query = useQuery({
    queryKey: ["task-changelogs", String(taskId)],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}/changelogs`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      })

      if (!response.ok) {
        return []
      }

      const { data } = await response.json()
      return Array.isArray(data) ? data : data ? [data] : []
    },
    enabled: !!taskId,
    staleTime: 0,
    refetchInterval: 1000,
    refetchOnWindowFocus: true
  })

  return query
}