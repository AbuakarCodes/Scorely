"use client"
import { useRef, useState } from "react"
import OAuthButtons from "@/customComponents/authComponenets/OAuthButtons"
import { Separator } from "@/components/ui/separator"
import SignupField from "@/customComponents/authComponenets/signupField"
import PageLoader from "@/customComponents/loaders/pageLoader"
import Link from "next/link"
import { requestSigninOTP } from "@/utils/OTP/requestSigninOTP"
import { v4 as uuidv4 } from "uuid"
import OtpVerification from "@/customComponents/authComponenets/OTP"
import { toast } from "sonner"

export default function SignUpFormCompact() {
  let otp_id = useRef("")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })
  const [errors, setErrors] = useState({})
  const [Loading, setLoading] = useState(false)
  const [showOTP, setshowOTP] = useState(false)

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "Abubakar" },
    { name: "email", label: "Email", type: "email", placeholder: "name@example.com" },
    {
      name: "password",
      label: "Password",
      type: showPassword.password ? "text" : "password",
      placeholder: "password",
      toggle: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: showPassword.confirmPassword ? "text" : "password",
      placeholder: "password",
      toggle: "confirmPassword",
    },
  ]

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setErrors({ ...errors, [field]: "" })
  }

  const handleFocus = (field) => () => {
    setErrors({ ...errors, [field]: "" })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = "Full Name required"
    if (!form.email.match(/^[\w.-]+@[\w.-]+\.\w+$/)) newErrors.email = "Invalid email"
    if (form.password.length < 8) newErrors.password = "Password must be ≥ 8 chars"
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form?.email || !form?.password) return
    if (!validate()) return

    try {
      setLoading(true)
      otp_id.current = uuidv4()
      await requestSigninOTP(form?.email, otp_id.current)
      setshowOTP(true)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setshowOTP(false)
      toast.error(error.message || "Something went wrong")
    }
  }

  return (
    <>
      {Loading && <PageLoader />}
      {showOTP ? (
        <OtpVerification
          form={form}
          otp_id={otp_id.current}
          setshowOTP={setshowOTP}
          resendOTP={requestSigninOTP}
        />
      ) : (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-display p-6">
          <div className="w-full max-w-md bg-white dark:bg-background-dark/50">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-primary text-primary-foreground p-4 rounded-xl mb-4 text-2xl">🏏</div>
              <h1 className="text-[32px] font-bold leading-tight text-primary">Cricket Scorer</h1>
              <p className="text-sm leading-normal text-primary/60">Precision in every ball</p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <SignupField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange(field.name)}
                  onFocus={handleFocus(field.name)}
                  toggle={field.toggle}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              ))}

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              >
                Create Account
              </button>

              <div className="w-full flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-xs leading-normal text-primary/60">OR</span>
                <Separator className="flex-1" />
              </div>

              <OAuthButtons setLoading={setLoading} />
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-primary/60 dark:text-white/60">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
