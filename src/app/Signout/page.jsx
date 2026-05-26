"use client"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })} className="signout-btn">
      <LogOutIcon />
      Sign out
    </button>
  )
}
