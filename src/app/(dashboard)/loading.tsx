import { Loader } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="h-full min-h-[50vh] flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}