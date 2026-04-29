"use client"

import { useRef, useState } from "react"
import { User, Camera } from "lucide-react"
import { uploadImageToCloudinary } from "@/utils/Basic/cloudinaryUplode_client"

export default function ImageUpload({ avatarURL, h = 28, w = 28, user_icon = 40, camera_icon = 16 }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState("")

  const handleClick = () => {
    fileRef.current.click()
  }

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return 

     // preview
    setPreview(URL.createObjectURL(file))

    // cloudinary upload
    const cloudinary_URL = await uploadImageToCloudinary(file)
    console.log({cloudinary_URL})

    avatarURL.current = cloudinary_URL
    console.log(avatarURL.current)



  }

  return (
    <div className="flex flex-col items-center p-6 gap-3">
      <input type="file" accept="image/*" ref={fileRef} onChange={handleChange} hidden />

      <div className="relative cursor-pointer" onClick={handleClick}>
        <div className={`w-${w} h-${h} rounded-full bg-primary/10 overflow-hidden flex items-center justify-center`}>
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <User size={user_icon} className="text-primary/40" />
          )}
        </div>

        <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
          <Camera size={camera_icon} />
        </div>
      </div>

      <p className="text-sm text-primary/60">Upload Photo</p>
    </div>
  )
}
