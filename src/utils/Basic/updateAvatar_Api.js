import axios from "axios"

export const updateAvatar = async ( id, imageUrl, model ) => {
  console.log({id, imageUrl, model})
  try {
    const res = await axios.patch("/api/avatar", {
      id,
      imageUrl,
      model,
    })

    return res.data
  } catch (err) {
    // throw Error(err?.message || "Failed to set image")
    console.log(err.message)
  }
}