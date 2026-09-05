import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProjectAvatarProps {
  name: string
  className?: string
}

export const ProjectAvatar = ({ name, className }: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("size-8 rounded-md", className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-sm uppercase rounded-md">
        {name ? name[0] : "P"}
      </AvatarFallback>
    </Avatar>
  )
}