"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import PageLoader from "@/customComponents/loaders/pageLoader"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()  
  
console.log(session)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <PageLoader />
  }

  if (status === "unauthenticated") { 
    
    return null
  }

 


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-sm mx-auto bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
          <img
            src={session?.user?.image }
            alt="profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{session?.user?.name}</h2>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </>
  )
}