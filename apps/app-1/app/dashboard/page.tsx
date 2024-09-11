"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
      <div>
        <p><strong>Name:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
      </div>
    </div>
  )
}