"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getSession, signIn } from "next-auth/react"
import Link from "next/link"
import OAuthButtons from "@/customComponents/authComponenets/OAuthButtons"
import { useRouter } from "next/navigation"
import SigninField from "@/customComponents/authComponenets/signinField"
import { toast } from "sonner"
import PageLoader from "@/customComponents/loaders/pageLoader"

export default function SignInFormCompact() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({ password: false })
  const router = useRouter()

  const fields = [
    {
      name: "email",
      label: "Email or Username",
      type: "text",
      placeholder: "name@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "password",
      toggle: "password",
    },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFocus = (e) => {
    const field = e.target.name
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email or username is required"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCredentialsLogin = async (e) => {
    e.preventDefault()
    if (!formData?.email || !formData?.password) return
    if (!validate()) return

    setLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (res?.error) {
        if (res.error === "CredentialsSignin") toast.error("Invalid email or password")
        else toast.error("Invalid credentials")
        return
      }
    } catch (err) {
      alert("Network or server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <PageLoader />}

      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary text-primary-foreground p-4 rounded-xl mb-4 text-2xl">🏏</div>
            <h1 className="text-[32px] font-bold leading-tight text-primary">Cricket Scorer</h1>
            <p className="text-sm leading-normal text-primary/60">Precision in every ball</p>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight">Welcome Back</h2>
              <p className="text-sm leading-normal text-primary/60">
                Log in to your scorer account to start a match
              </p>
            </div>

            {loginError && <p className="text-xs mt-0.5 text-red-500">{loginError}</p>}

            {fields.map((field) => (
              <SigninField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={handleChange}
                onFocus={handleFocus}
                toggle={field.toggle}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            ))}

            <Button
              type="submit"
              className="mt-4 w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="w-full flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs leading-normal text-primary/60">OR</span>
              <Separator className="flex-1" />
            </div>

            <OAuthButtons setLoading={setLoading} />
          </form>

          <p className="text-center text-sm leading-normal text-primary/60 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold cursor-pointer">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
