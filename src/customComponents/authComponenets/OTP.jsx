"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, ShieldCheck, Clock, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getSession, signIn } from "next-auth/react"
import axios from "axios"
import PageLoader from "../loaders/pageLoader"
import { useRouter } from "next/navigation"

const OTP_EXPIRY_SECONDS = 180

export default function OtpVerification({ form, otp_id, setshowOTP, resendOTP }) {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(OTP_EXPIRY_SECONDS)
  const [isExpired, setIsExpired] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef([])


  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setIsExpired(true)
      return
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last char
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""])
    setTimer(OTP_EXPIRY_SECONDS)
    setIsExpired(false)
    inputRefs.current[0]?.focus()
    toast.success("A new OTP has been sent!")
    try {
      await resendOTP(form.email, otp_id)
    } catch (error) {
      console.log(error)
      toast.error("Sorry can't resend OTP")
    }
  }


    async function credentials_nextAuth() {
    const res = await signIn("credentials", {
      redirect: false,
      name: form.fullName,
      email: form.email,
      password: form.password,
      isSignUp: true,
    })

    if (res?.error) {
      if (res.error === "CredentialsSignin") toast.error("Invalid email or password")
      else toast.error("Invalid credentials")
      return
    }

    if (res.ok) {
      await getSession()
      router.replace("/")
      router.refresh()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join("")

    // Basic validation
    if (otpValue.length < 6) {
      toast.error("Please enter all 6 digits of the OTP.")
      return
    }

    if (isExpired) {
      toast.error("OTP has expired. Please request a new one.")
      return
    }

    try {
      setIsVerifying(true)
      const res = await axios.post("/api/OTP/verify_signupotp", {
        email: form.email,
        otp_id,
        otp: otpValue,
      })
      await credentials_nextAuth()
    } catch (error) {
      console.log(error?.response?.data?.message)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setIsVerifying(false)
    }
  }


  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  return (
    <>
    {isVerifying && <PageLoader/>}
    <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => setshowOTP(false)}
          className="rounded-full hover:bg-primary/10 text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full">
        {/* Icon */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Enter Code</h1>
          <p className="text-muted-foreground text-base">
            We&apos;ve sent a 6-digit security code to your registered email address.
          </p>
        </div>

        <div className="w-full space-y-8">
          {/* OTP Inputs */}
          <div className="flex justify-center">
            <fieldset className="relative flex gap-2 sm:gap-4" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="
                    flex h-14 w-11 sm:w-12 text-center text-xl font-semibold
                    bg-white dark:bg-slate-800
                    text-foreground
                    border-b-2 border-slate-200 dark:border-slate-700
                    focus:border-primary focus:ring-0 focus:outline-none
                    transition-all rounded-sm
                  "
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </fieldset>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-primary font-medium text-sm">
                {isExpired ? "OTP expired" : `OTP valid for ${formatTime(timer)}`}
              </p>
            </div>

            {/* Verify Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] h-auto"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verify &amp; Proceed
                </span>
              )}
            </Button>

            {/* Resend */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-muted-foreground text-sm">Didn&apos;t receive the code?</p>
              {isExpired ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 p-0 h-auto gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Resend OTP
                </Button>
              ) : (
                <span className="text-muted-foreground/50 text-sm font-medium cursor-not-allowed select-none">
                  Resend available after expiry
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          <span>Secure Cricket Authentication</span>
        </div>
      </footer>

      {/* Bottom gradient bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
    </>
  )
}
