import axios from "axios"

export const uploadImageToCloudinary = async (file) => {
  if (!file) throw new Error("No file provided")

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "scorely_Players_images") 
  formData.append("cloud_name", "dtrrzyutr")

  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/dtrrzyutr/image/upload",
    formData
  )
  return data.secure_url
}