"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert"
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { loginSchema, LoginInput } from "@repo/zod-types/auth"
import Link from "next/link"


export default function Login() {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginInput>>({})
  const [oauthError, setOauthError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "OAuthAccountNotLinked") {
      setOauthError("An account with this email already exists. Please sign in with your password or use a different social login method.")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      loginSchema.parse(formData)
      setErrors({})

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/dashboard")
      } else {
        setErrors({ email: "Invalid email or password" })
      }
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as any
        const fieldErrors: Partial<LoginInput> = {}
        zodError.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials or use a social login</CardDescription>
        </CardHeader>
        <CardContent>
          {oauthError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{oauthError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={() => handleOAuthSignIn('google')}>
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthSignIn('github')}>
              <FaGithub className="mr-2" /> GitHub
            </Button>
          </div>
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}