import { FaGoogle, FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Separator } from "radix-ui"

const providers = [
  {
    id: "google",
    name: "Google",
    icon: <FaGoogle className="w-5 h-5" />,
  },
  {
    id: "github",
    name: "Github",
    icon: <FaGithub className="w-5 h-5" />,
  },
]

export default function OAuthButtons({ setLoading }) {
  const handel_oAuth = (e) => {
    const providerId = e.target.id
    setLoading(true)
    signIn(providerId, { callbackUrl: "/" })
    // Since this is a synchronous function, setting the state to false here
    // will immediately hide the loader. Instead, set the loader state to true
    // when the component mounts again, so the state can be recalculated properly.
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {providers.map((provider) => (
        <Button
          id={provider.id}
          type="button"
          variant="outline"
          className="w-full lg:w-1/2 h-12 rounded-lg text-base font-bold flex items-center justify-center gap-2"
          onClick={handel_oAuth}
        >
          {provider.icon}
          {provider.name}
        </Button>
      ))}
    </div>
  )
}
