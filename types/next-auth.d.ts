import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
 

//  EXTENDING THE NEXT-AUTH DEFAULT SEESION BY DEFINING MY SESSION INTERFACE AND EXTENDING IT WITH WHAT IS ON THE DEFAULT NEXT-AUTH SESSION. THIS WAY I CAN ADD ANY NUMBER OF PROPERTY TO THE SESSION OBJECT 

  declare module "next-auth" {
    // EXTENDING THE SUBSET OF FTHE MAIN SESSION MADE AVAILABLE TO THE CLIENT SIDE
    interface Session {
      user: {
        id?: string
        role?: "admin" | "user",
        provider?: string
      } & DefaultSession["user"]
    }
  
    // EXTENDING THE MAIN SESSION WE GOT FROM THE DATABASE
    interface User extends DefaultUser {
      role?: "admin" | "user",
      emailVerified?: date,
      provider?: string

    }
  }
  // EXTENDING THE DEFAULT JWT
  declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
      role?: "admin" | "user",
      emailVerified?: date,
      provider?: string,
    }
  }