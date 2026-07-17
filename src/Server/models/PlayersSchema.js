import mongoose from "mongoose"

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
      required: true
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

    inPlaying_XI: {
      type: Boolean,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: null,
    },

    currentTeam: {
      type: String
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