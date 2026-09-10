import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { client } from "@/lib/rpc"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        param,
        json
        })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task", data.id] })
      // need this to make update changelogs live
      queryClient.invalidateQueries({ queryKey: ["task", String(data.id)] })
      queryClient.invalidateQueries({ queryKey: ["task-changelogs"] })
      queryClient.invalidateQueries({ queryKey: ["task-changelogs", String(data.id)] })
    },
    onError: () => {
      toast.error("Failed to update task")
    }
  })

  return mutation
}