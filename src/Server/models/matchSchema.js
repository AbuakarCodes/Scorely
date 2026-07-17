import mongoose from "mongoose"

const MatchSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
      index: true,
    },
    matchId: {
      type: String,
      required: true,
      unique: true,
    },

    teamA: {
      type: String,
      required: true,
    },
    teamB: {
      type: String,
      required: true,
    },
    tossWinner: {
      type: String,
      required: true,
    },

    tossDecision: {
      type: String,
      enum: ["bat", "ball"],
      required: true,
    },

    matchWinner: {
      id: {
        type: String,
        ref: "Team",
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
    },
    TotalOvers: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.match || mongoose.model("match", MatchSchema)
