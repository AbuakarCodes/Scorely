const MatchSchema = new mongoose.Schema({
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
        required: true
    },

    matchWinner: {
        type: String,
        required: true,
    },
    overs: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["completed", "paused", "local"] // local maens it's not in DB yet 
    },

}, {
    timestamps: true,
});