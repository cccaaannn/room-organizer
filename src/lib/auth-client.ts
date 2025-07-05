import { createAuthClient } from "better-auth/react";


const authClient = createAuthClient();

export default authClient;
export const { signIn, signUp, useSession, signOut, getSession } = authClient;
