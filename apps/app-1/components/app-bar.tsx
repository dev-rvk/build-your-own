"use client"

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@repo/ui/components/ui/button";

export function AppBar() {
  const { data: session } = useSession()

  return (
    <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Build your own X
      </Link>
      <div>
        {session ? (
          <Button variant="secondary" onClick={() => signOut()}>
            Sign Out
          </Button>
        ) : (
          <>
            <Button variant="secondary" className="mr-2" onClick={() => signIn()}>
              Login
            </Button>
            <Link href="/signup" passHref>
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}