import Team from "@/Server/models/TeamSchema"
import Player from "@/Server/models/PlayersSchema"
import { connectDB } from "@/lib/db"
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"
import { getToken } from "next-auth/jwt"

export async function POST(req) {
    await connectDB()

    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token) {
            return Response.json(
                new ErrorResponse("Unauthorized"),
                { status: 401 }
            )
        }

        const userId = token.id

        const { name, avatar, players } = await req.json()

        if (!name || !players?.length) {
            return Response.json(
                new ErrorResponse("Name and players required"),
                { status: 400 }
            )
        }

        // 1. Create team
        const team = await Team.create({
            name,
            avatar,
            userId,
        })

        // 2. Fetch players
        const existingPlayers = await Player.find({
            _id: { $in: players },
        })

        // helper: generate unique jersey numbers (1–100) within this team
        const usedNumbers = new Set()

        const getUniqueJersey = () => {
            let num
            do {
                num = Math.floor(Math.random() * 100) + 1
            } while (usedNumbers.has(num))

            usedNumbers.add(num)
            return num
        }

        // 3. prepare updates
        const updatedPlayersData = existingPlayers.map((player) => {
            return {
                _id: player._id,
                teamId: team._id,
                currentTeam: team.name,
                jerseyNumber: getUniqueJersey(),
                teams: [...(player.teams || []), team.name],
            }
        })

        // 4. apply updates
        await Promise.all(
            updatedPlayersData.map((p) =>
                Player.updateOne(
                    { _id: p._id },
                    {
                        $set: {
                            teamId: p.teamId,
                            currentTeam: p.currentTeam,
                            jerseyNumber: p.jerseyNumber,
                        },
                        $push: {
                            teams: team.name,
                        },
                    }
                )
            )
        )

        // 5. return updated players
        const updatedPlayers = await Player.find({
            _id: { $in: players },
        })

        return Response.json(
            new SuccessResponse("Team created successfully", {
                team,
                players: updatedPlayers,
            })
        )
    } catch (err) {
        console.error(err)
        return Response.json(
            new ErrorResponse("Server error"),
            { status: 500 }
        )
    }
}