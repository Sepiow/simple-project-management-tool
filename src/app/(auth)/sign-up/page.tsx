
import { getCurrent } from "@/features/auth/actions";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/dist/client/components/navigation";

const  SignupPage = async () => {
    const user = await getCurrent();
    if (user) {
        redirect("/");
    }
    
    return ( 
        <SignUpCard />
     );
}
 
export default SignupPage;