import { DefaultSession } from "next-auth";




const ExtendedUser = DefaultSession["user"] & {
    role?: "ADMIN" | "USER",
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser}
    }


