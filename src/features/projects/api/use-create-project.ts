import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { useRouter } from "next/navigation"
import { client } from "@/lib/rpc"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.projects["$post"]>
type RequestType = InferRequestType<typeof client.api.projects["$post"]>

export const useCreateProject = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.projects["$post"]({json})

            if (!response.ok) {
                throw new Error("Failed to create project")
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success("Project created successfully")
            
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            router.refresh()
        },
        onError: () => {
            toast.error("Failed to create project")
        }
    })

    return mutation
}