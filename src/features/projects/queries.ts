import { getCurrent } from "@/features/auth/queries"

export const getProjects = async () => {
  try {
    const user = await getCurrent()
    if (!user) {
      return { documents: [], total: 0 }
    }

    let numericUserId: number | null = null
    try {
      const membersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/get_all_member`
      )
      const membersData = await membersRes.json()
      const allMembers = Array.isArray(membersData?.data)
        ? membersData.data
        : Array.isArray(membersData)
        ? membersData
        : []

      const found = allMembers.find(
        (m: any) => m.user_id === user.user_id
      )
      if (found) {
        numericUserId = found.id
      }
    } catch {
      numericUserId = null
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`,
      { cache: "no-store" }
    )
    const result = await response.json().catch(() => null)
    const allProjects = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
      ? result
      : []

    const userProjects = allProjects.filter((project: any) => {
      return (
        project.user_id === numericUserId ||
        String(project.user_id) === String(numericUserId) ||
        project.user_id === user.user_id
      )
    })

    return {
      documents: userProjects,
      total: userProjects.length
    }
  } catch {
    return { documents: [], total: 0 }
  }
}