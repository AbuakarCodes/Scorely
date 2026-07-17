import Team from "@/Server/models/TeamSchema";
import Player from "@/Server/models/PlayersSchema";
import { connectDB } from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    await connectDB();

    try {
        const token = await getToken({
            req,
            secret: process.env?.NEXTAUTH_SECRET,
        });

        if (!token) {
            return Response.json(
                new ErrorResponse("Unauthorized"),
                { status: 401 }
            );
        }

        const { teamAId, teamBId } = await req.json();

        if (!teamAId || !teamBId) {
            return Response.json(
                new ErrorResponse("Both team IDs are required"),
                { status: 400 }
            );
        }

        // 1. fetch teams
        const teams = await Team?.find({
            _id: { $in: [teamAId, teamBId] },
        });

        if (teams?.length !== 2) {
            return Response.json(
                new ErrorResponse("One or both teams not found"),
                { status: 404 }
            );
        }

        // 2. fetch players separately 
        // return  only those whor are in playing 11 and not deleted
        const teamAPlayers = enrichPlayers(await Player.find({ teamId: teamAId }))?.filter(P => !P?.isDeleted)
        const teamBPlayers = enrichPlayers(await Player.find({ teamId: teamBId }))?.filter(P => !P?.isDeleted)

        // 3. map teams
        const teamA = teams.find(t => t._id.toString() === teamAId);
        const teamB = teams.find(t => t._id.toString() === teamBId);

        // 4. response structure
        return Response.json(
            new SuccessResponse("Teams players fetched successfully", {
                teamA: {
                    _id: teamA._id,
                    name: teamA.name,
                    players: teamAPlayers,
                },
                teamB: {
                    _id: teamB._id,
                    name: teamB.name,
                    players: teamBPlayers,
                },
            })
        );
    } catch (err) {
        console.error(err);
        return Response.json(
            new ErrorResponse("Server error"),
            { status: 500 }
        );
    }
}



function enrichPlayers(players) {
    if (!Array.isArray(players)) {
        return []
    }
    // Mongoose returns document objects; toObject() converts 
    // them to plain JS objects and removes internal
    //  fields like $__ and _doc
    return players.map(player => ({
        ...player.toObject(),
        batting: ""
    }));

}