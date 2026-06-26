import mongoose from "mongoose";

const BallSchema = new mongoose.Schema(
  {
    // IDENTIFIERS
    matchId: {
      type: String,
      required: true,
      index: true,
    },

    inningsNumber: {
      type: Number,
      required: true,
    },

    over: {
      type: Number,
      required: true,
    },

    ballInOver: {
      type: Number,
      required: true,
    },

    isLegalDelivery: {
      type: Boolean,
      required: true,
    },

    // PLAYERS
    strikerId: {
      type: String,
      required: true,
    },

    nonStrikerId: {
      type: String,
    },

    bowlerId: {
      type: String,
      required: true,
    },



    // SCORING CORE
    runs: {
      type: Number,
      required: true,
      default: 0,
    },

    extraType: {
      type: String,
      enum: [
        null,
        "wide",
        "noball",
        "Bye",
        "Legbye",
      ],
      default: null,
    },

    extraRuns: {
      type: Number,
      default: 0,
    },


    isWicket: {
      type: Boolean
    },


  }, { timestamps: true },


);

BallSchema.index({ matchId: 1, inningsNumber: 1 });
BallSchema.index({ strikerId: 1 });
BallSchema.index({ bowlerId: 1 });

export default mongoose.model("Ball", BallSchema);