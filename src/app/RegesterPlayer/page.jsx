"use client"

import { useRef, useState } from "react"
import { User, Hash, Trophy, Camera, ArrowLeft } from "lucide-react"
import Page from "@/app/page"
import PageLoader from "@/customComponents/loaders/pageLoader"
import ImageUpload from "@/customComponents/BasicComponents/ImageUpload"
import { RegesterPlayer_APIcall } from "./RegesterPlayer_APIcall"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { updateAvatar } from "@/utils/Basic/updateAvatar_Api"
import { useDispatch } from "react-redux"
import { insertPlayer } from "@/utils/reduxSclices/playerSlice"
import Link from "next/link"

export default function RegesterPlayerForm() {
  const avatarURL = useRef(null)
  const { data: session, status } = useSession()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: "",
    jersey: "",
    role: "",
  })

  const [errors, setErrors] = useState({})
  const [Loder, setLoder] = useState(false)
  const [preview, setPreview] = useState(null)

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!form.jersey) {
      newErrors.jersey = "Jersey number is required"
    } else if (form.jersey < 0) {
      newErrors.jersey = "Must be a valid number"
    }

    if (!form.role) {
      newErrors.role = "Please select a role"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (status === "unauthenticated") {
      toast.error("Please login to add a player")
      return null
    }

    setLoder(true)

    try {
      const res = await RegesterPlayer_APIcall({
        name: form.name,
        jersey: form.jersey,
        role: form.role,
        userId: session?.user?.id || null,
        avatarURL: avatarURL?.current || null,
        teamId: null,
      })

      dispatch(insertPlayer(res?.data || {}))

      setPreview(null)
      setForm({
        name: "",
        jersey: "",
        role: "",
      })

      console.log(res.data)
    } catch (error) {
      toast.error("Failed to create player")
      console.log(error?.message || "Failed to create player")
    } finally {
      setLoder(false)
    }
  }

  return (
    <>
      {Loder || (status === "loading" && <PageLoader></PageLoader>)}
      <div className="min-h-screen bg-background-light flex justify-center items-center">
        <div className="w-full max-w-md bg-white pb-3.5 shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
          <Link href="/">  <ArrowLeft className="text-primary cursor-pointer" /></Link>
            <h2 className="font-bold text-lg text-primary">Add New Player</h2>
            <div />
          </div>

          {/* Profile Upload */}

          <ImageUpload preview={preview} setPreview={setPreview} avatarURL={avatarURL}></ImageUpload>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Abubakar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Jersey */}
            <div>
              <label className="text-sm font-semibold">Jersey Number</label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input
                  type="number"
                  className="w-full h-12 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. 18"
                  value={form.jersey}
                  onChange={(e) => setForm({ ...form, jersey: e.target.value })}
                />
              </div>
              {errors.jersey && <p className="text-red-500 text-xs mt-1">{errors.jersey}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-semibold">Player Role</label>
              <div className="relative mt-1">
                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <select
                  className="w-full h-12 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-rounder</option>
                </select>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90"
            >
              Create Player Profile
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
