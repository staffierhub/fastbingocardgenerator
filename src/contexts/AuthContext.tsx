import { Session } from "@supabase/supabase-js";
import { createContext } from "react";

interface AuthContextType {
  session: Session | null;
}

export const AuthContext = createContext<AuthContextType>({ session: null });