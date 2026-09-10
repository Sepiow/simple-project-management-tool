"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { useCurrent } from "../api/use-current"
import { useLogout } from "../api/use-logout"
import { Loader, LogOut, Settings } from "lucide-react"

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent()
  const { mutate: logout } = useLogout()

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const { user_id, email } = user


  const fallbackValue = user_id
    ? user_id.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "U"

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-600 flex items-center justify-center">
            {fallbackValue}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-600 flex items-center justify-center">
              {fallbackValue}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">{user_id}</p>
            {email && <p className="text-xs text-neutral-500">{email}</p>}
          </div>
        </div>

        <DottedSeparator className="mb-1" />
        <Link href="/settings">
          <DropdownMenuItem className="h-10 flex items-center px-3 cursor-pointer">
            <Settings className="size-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
        </Link>
        <DottedSeparator className="my-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}