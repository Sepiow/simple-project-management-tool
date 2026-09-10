import { useQuery } from "@tanstack/react-query"

interface UseGetProjectLogsProps {
  projectId?: string | null
}

export const useGetProjectLogs = ({ projectId }: UseGetProjectLogsProps) => {
  const query = useQuery({
    queryKey: ["project-changelogs", String(projectId)],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/project/${projectId}/changelogs`, {
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
      return Array.isArray(data) ? data : []
    },
    enabled: !!projectId,
    refetchInterval: 2000,
    refetchOnWindowFocus: true
  })

  return query
}