import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        avatar: {
            type: String,
            default: "",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);