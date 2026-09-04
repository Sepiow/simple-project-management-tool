"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./constants";
import { AuthUser } from "@/lib/session-middleware";

export const getCurrent = async (): Promise<AuthUser | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session?.value) {
      return null;
    }

    
    const user: AuthUser = JSON.parse(session.value);

    return user;
  } catch {
    return null;
  }
};