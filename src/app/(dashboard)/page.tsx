import { getCurrent } from "@/features/auth/queries"
import { getProjects } from "@/features/projects/queries"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  const projects = await getProjects()

  if (projects.total === 0) {
    redirect("/projects/create")
  } else {
    redirect(`/projects/${projects.documents[0].id}`)
  }
}