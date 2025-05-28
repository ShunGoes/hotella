"use client"
import {signIn} from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "./ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }
  return (
    <div className="flex items-center justify-center gap-x-2 w-full ">
        <Button size="lg" variant="outline" className="flex-1" onClick={() => {onClick("google")}}>
            <FcGoogle className="w-5 h-5" />
        </Button>
        <Button size="lg" variant="outline" className="flex-1" onClick={() => {onClick("github")}}>
            <FaGithub className="w-5 h-5" />
        </Button>

    </div>
  )
}

export default Social