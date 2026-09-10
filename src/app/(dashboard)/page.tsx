import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { EditProfileCard } from "@/features/auth/components/edit-profile-card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl mx-auto py-6">
      <EditProfileCard />
    </div>
  );
}