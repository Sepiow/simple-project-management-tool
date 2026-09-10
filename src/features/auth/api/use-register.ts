import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { useRouter } from "next/navigation"

import { client } from "@/lib/rpc"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>
type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>

export const useRegister = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register["$post"]({ json })
            if (!response.ok) {
                const errData = await response.json().catch(() => null)
                throw new Error((errData as any)?.error || "Failed to create account")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Account created successfully")
            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["current"] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to register an account")
        }
    })

    return mutation
}