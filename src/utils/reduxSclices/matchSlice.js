import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



export const fetchTeamPlayers_off = createAsyncThunk(
    "match/fetchTeamPlayers",
    async (teamId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/teams/${teamId}/players`);
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch team players"
            );
        }
    }
);

export const fetchTeamPlayers = createAsyncThunk(
    "match/fetchTeamPlayers",
    async ({ teamAId, teamBId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/Team/getPlayersInTeams", {
                teamAId,
                teamBId,
            });
            return data?.data;
        } catch (err) {
            console.log(err.message)
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch teams"
            );
        }
    }
);


const defaultState = {
    match: {

        id: "",
        status: "live",

        tossWinner: "",
        tossDecision: "bat",
        matchWinner: "",

        teams: {
            teamA: {
                id: "",
                name: "",
                players: [],
            },

            teamB: {
                id: "",
                name: "",
                players: [],
            },
        },
    },

    innings: {
        isFirstInings: null,

        battingTeamId: "",
        bowlingTeamId: "",

        dismissedPlayers: [],
        yetToBall: [],

        score: {
            runs: 0,
            wickets: 0,
            over: 22.44,
            balls: 0,
            CRR: 0,
            RRR: 0
        },

        balls: [],

        pendingNewBatsman: false,
        pendingBowlerChange: false,
    },

    // batsmen: {
    //     batsmenA: {
    //         batsmenA_Id: "",
    //         isStriker:null,
    //         batsmenAName: "",
    //         batsmenA_Runs: 0,
    //         batsmenA_facedBalls: 0,
    //         batsmenA_fours: 0,
    //         batsmenA_sixes: 0,
    //         batsmenA_strikRate: 0
    //     },

    //     batsmenB: {
    //         batsmenB_Id: "",
    //         isStriker:null,
    //         batsmenB_Name: "",
    //         batsmenB_Runs: 0,
    //         batsmenB_facedBalls: 0,
    //         batsmenB_fours: 0,
    //         batsmenB_sixes: 0,
    //         batsmenB_strikRate: 0
    //     }
    // },

    batsmen: {
        batsmenA: {
            id: "BAT001",
            name: "Abdullah Khan",
            runs: 45,
            balls: 32,
            fours: 6,
            sixes: 2,
            strikeRate: 140.62,
            isStriker: false,
        },

        batsmenB: {
            id: "BAT002",
            name: "Ali",
            runs: 28,
            balls: 25,
            fours: 3,
            sixes: 1,
            strikeRate: 112.0,
            isStriker: true,
        },
    },

    bowler: {
        bowler_Id: "",
        bowler_Name: "",
        bowler_over: 0,
        bowler_ballInOver: 0,
        bowler_Runs: 0,
        bowler_Econ: 0,
        bowler_Wickets: 0,

    },

    Loading: {
        playersLoading: false,
        playersError: null,
    },

    flags: {
        shouldPersistmatch: false,
        show_prevMatch_popup: false

    }

};
// INITIAL STATE
const initialState = loadMatchState() || defaultState




// HELPERS

const swapStrike = (state) => {
    const temp = state.innings.strikerId;
    state.innings.strikerId = state.innings.nonStrikerId;
    state.innings.nonStrikerId = temp;
};



// SLICE

const matchSlice = createSlice({
    name: "match",
    initialState,

    reducers: {

        // ADD BALL
        addBall: (state, action) => {
            const { runs = 0, wicket = false } = action.payload;

            const innings = state.innings;

            const ball = {
                matchId: state.match.id,

                inningsNumber: state.innings.isFirstInings ? 1 : 2,

                over: state.innings.score.overs,
                ballInOver: state.innings.score.balls,

                isLegalDelivery:
                    action.payload.extraType !== "wide" &&
                    action.payload.extraType !== "noball",

                strikerId: state.innings.strikerId,
                nonStrikerId: state.innings.nonStrikerId,

                bowlerId: state.innings.currentBowlerId,

                battingTeamId: state.innings.battingTeamId,
                bowlingTeamId: state.innings.bowlingTeamId,

                runs: action.payload.runs || 0,

                extraType: action.payload.extraType || null,

                extraRuns: action.payload.extraRuns || 0,

                isWicket: action.payload.wicket || false,

            };

            innings.balls.push(ball);

            innings.score.runs += runs;

            // legal delivery
            innings.score.balls += 1;

            // wicket
            if (wicket) {
                innings.score.wickets += 1;
                innings.pendingNewBatsman = true;
            }

            // over completed
            if (innings.score.balls === 6) {
                innings.score.overs += 1;
                innings.score.balls = 0;

                swapStrike(state);

                innings.pendingBowlerChange = true;
            }

            // strike rotation
            if (runs % 2 === 1) {
                swapStrike(state);
            }
        },


        // SET PLAYERS AFTER FETCH (optional manual)
        setTeamPlayers: (state, action) => {
            const { teamId, players } = action.payload;

            state.match.teams[teamId].players = players;
        },


        // SELECT NEW BATSMAN
        selectNewBatsman: (state, action) => {
            const playerId = action.payload;

            state.innings.strikerId = playerId;
            // state.innings.pendingNewBatsman = false;
        },

        // CHANGE BOWLER
        changeBowler: (state, action) => {
            const bowlerId = action.payload;

            state.innings.currentBowlerId = bowlerId;
            state.innings.pendingBowlerChange = false;
        },


        tossWinner_fn: (state, action) => {
            const tossWinnerTeamID = action.payload
            state.match.tossWinner = tossWinnerTeamID
        },

        tossDecision_fn: (state, action) => {
            const tossWinnerTeamDecision = action.payload
            state.match.tossDecision = tossWinnerTeamDecision
            if (tossWinnerTeamDecision === "bat") {
                state.match.innings.battingTeamId = state.match.tossWinner
                console.log("Changing bat state ")
            } else if (tossWinnerTeamDecision === "bowl") {
                state.match.innings.bowlingTeamId = state.match.tossWinner
                console.log("Changing bowl state ")

            }


        },

        initiate_LS_presistance(state) {
            state.flags.shouldPersistmatch = true;
        },
        resetMatch(state) {
            localStorage.removeItem("match");
            return defaultState;
        }




    },



    // EXTRA REDUCERS (THUNK HANDLING)

    extraReducers: (builder) => {
        builder

            // loading state
            .addCase(fetchTeamPlayers.pending, (state) => {
                state.Loading.playersLoading = true;
                state.Loading.playersError = null;
            })

            // success
            .addCase(fetchTeamPlayers.fulfilled, (state, action) => {
                const { teamA, teamB } = action.payload;
                state.Loading.playersLoading = false;
                state.match.teams.teamA = {
                    id: teamA._id,
                    name: teamA.name,
                    players: teamA.players,
                };

                state.match.teams.teamB = {
                    id: teamB._id,
                    name: teamB.name,
                    players: teamB.players,
                };
            });
    },
});

export const {
    addBall,
    setTeamPlayers,
    selectNewBatsman,
    changeBowler,
    tossWinner_fn,
    tossDecision_fn,
    initiate_LS_presistance,
    resetMatch
} = matchSlice.actions;

export default matchSlice.reducer;



function loadMatchState() {
    try {
        const data = localStorage.getItem("match");
        return data ? JSON.parse(data) : undefined;
    } catch {
        return undefined;
    }
};