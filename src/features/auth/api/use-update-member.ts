import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth["update-member"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.auth["update-member"]["$patch"]>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["update-member"]["$patch"]({
        json,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to update member" }));
        throw new Error((err as any)?.error || "Failed to update member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Profile and password updated successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update member");
    },
  });

  return mutation;
};