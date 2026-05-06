import { Card } from "@/components/ui/card"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export function PlayerCardSkeletonTeam() {
  return (
    <Card className="flex flex-row h-[7rem] items-center p-3 border">
      {/* Avatar */}
      <Skeleton circle height={30} width={30} />

      {/* Text */}
      <div className="flex flex-col flex-1 ml-3 space-y-1">
        <Skeleton height={10} width={130} />
        <Skeleton height={10} width={90} />
        <Skeleton height={10} width={60} />
      </div>

      {/* Checkbox / Radio */}
      <Skeleton circle height={16} width={16} />
    </Card>
  )
}