import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import {toast} from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>

export const useCreateWorkspace = () => {

    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.workspaces["$post"]({ json })
            if (!response.ok) {
                throw new Error("Failed to make a workspace")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Workspace made")
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        },
        onError: ()=>{
            toast.error("Error in creating a workspace")
        }

    })

    return mutation
}