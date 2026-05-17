const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({
  match_id: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  innings: Number,
  over: Number,
  ball_in_over: Number,

  striker_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  non_striker_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  bowler_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },

  runs_batsman: Number,
  runs_extras: Number,
  extra_type: {
    type: String,
    enum: ["wide", "no_ball", "bye", "leg_bye", null],
    default: null
  },

  wicket_type: {
    type: String,
    enum: ["bowled", "caught", "lbw", "run_out", "stumped", null],
    default: null
  },

  player_out_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null }
});

ballSchema.index({ match_id: 1 });
ballSchema.index({ striker_id: 1 });
ballSchema.index({ bowler_id: 1 });

module.exports = mongoose.model("Ball", ballSchema);