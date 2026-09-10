import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SignupPage = async () => {
  const user = await getCurrent();
  if (user) {
    redirect("/");
  }
    
  return ( 
    <SignUpCard />
  );
}
 
export default SignupPage;