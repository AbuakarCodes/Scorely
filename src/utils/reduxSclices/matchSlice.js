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
            console.log(data.data)
            return data?.data;
        } catch (err) {
            console.log(err.message)
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch teams"
            );
        }
    }
);


// INITIAL STATE
const initialState = {
    match: loadMatchState() || {
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
        battingTeamId: "",
        bowlingTeamId: "",

        strikerId: null,
        nonStrikerId: null,
        currentBowlerId: null,

        yetToBat: [],
        yetToBall: [],

        score: {
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
        },

        balls: [],

        pendingNewBatsman: false,
        pendingBowlerChange: false,
    },

    Loading: {
        playersLoading: false,
        playersError: null,
    }
};



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
                id: crypto.randomUUID(),
                strikerId: innings.strikerId,
                bowlerId: innings.currentBowlerId,
                runs,
                wicket,
                over: innings.score.overs,
                ballInOver: innings.score.balls,
                timestamp: Date.now(),
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
            state.innings.pendingNewBatsman = false;
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
    tossDecision_fn
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