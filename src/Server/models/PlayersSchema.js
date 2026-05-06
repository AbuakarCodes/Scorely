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

    teamHistory: {
      type: Array
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