import mongoose from "mongoose"
import { StagedRenderingController } from "next/dist/server/app-render/staged-rendering"

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    jerseyNumber: {
      type: Number,
      required: function () {
        return !!this.teamId
      }
    },


    role: {
      type: String,
      required: true,
    },

    teamId: {
      type: String,
      ref: "Team",
      default: null,
    },


    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Player ||
  mongoose.model("Player", playerSchema)