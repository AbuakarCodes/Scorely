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
            return inject_isDismissedInPlayers(data?.data);
        } catch (err) {
            console.error(err.message)
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

        tossWinner: { id: "", name: "" },
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
        isInings: false,
        isFirstInings: false,

        battingTeamId: "",
        bowlingTeamId: "",



        score: {
            runs: 0,
            wickets: 0,
            over: 22.44,
            balls: 0,
            CRR: 0,
            RRR: 0
        },

        balls: [],

        pendingNewBatsman: { stricker: true, nonStricker: true },
        pendingNewBowler: true,
    },

    batsmen: {
        batsmenA: {
            id: "",
            name: "Abdullah Khan",
            runs: 45,
            balls: 32,
            fours: 6,
            sixes: 2,
            strikeRate: 140.62,
            isStriker: false,
        },

        batsmenB: {
            id: "",
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
        alreadyBowled: [],
        currentBowler: {
            id: "",
            name: "",
            over: 0,
            ballInOver: 0,
            runsOnThatBall: 0,
            Econ: 0,
            TotalWickets: 0,
            TotalOver: 0,
            TotalRunsConceded: 0
        }
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

            // function will return that object 
            const ball = {
                matchId: state.match.id,

                inningsNumber: state.innings.isFirstInnings ? 1 : 2,

                over: state.innings.score.overs,
                ballInOver: state.innings.score.balls,

                isLegalDelivery:
                    action.payload.extraType !== "Wide" &&
                    action.payload.extraType !== "NB",

                strikerId: state.innings.strikerId,
                nonStrikerId: state.innings.nonStrikerId,
                bowlerId: state.innings.currentBowlerId,

                runs: action.payload.runs || 0,

                extraType: action.payload.extraType || null,
                extraRuns: action.payload.extraRuns || 0,

                isWicket: action.payload.wicket || false,
            };

            // state shange 
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
            if (innings.score.balls === 5) {
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
        // setTeamPlayers: (state, action) => {
        //     const { teamId, players } = action.payload;

        //     state.match.teams[teamId].players = players;
        // },


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
            const id = action?.payload?.id
            const name = action?.payload?.name
            state.match.tossWinner.id = id
            state.match.tossWinner.name = name
        },

        tossDecision_fn: (state, action) => {
            const decision = action.payload
            if (!["bat", "bowl"].includes(decision)) return
            state.match.tossDecision = decision
        },

        initiate_LS_presistance(state) {
            state.flags.shouldPersistmatch = true;
        },
        resetMatch(state) {
            localStorage.removeItem("match");
            return defaultState;
        },

        setInings(state, action) {
            if (!action.payload || typeof action.payload != "boolean") return
            state.innings.isFirstInings = action.payload
        },




    },



    // EXTRA REDUCERS (THUNK HANDLING)

    extraReducers: (builder) => {
        builder

            // loading state
            .addCase(fetchTeamPlayers.pending, (state) => {
                state.Loading.playersLoading = true;
                state.Loading.playersError = null;
            })

            // failed state
            .addCase(fetchTeamPlayers.rejected, (state, action) => {
                state.Loading.playersLoading = false;
                state.Loading.playersError = action.payload || action.error.message;
            })

            // success
            .addCase(fetchTeamPlayers.fulfilled, (state, action) => {
                const { teamA, teamB } = action.payload;
                state.Loading.playersLoading = false;
                state.match.teams.teamA = {
                    id: teamA?._id,
                    name: teamA?.name,
                    isBatting: null,
                    players: teamA?.players?.map(P => ({
                        ...P,
                        isDismissed: false,
                    })),
                };

                state.match.teams.teamB = {
                    id: teamB?._id,
                    name: teamB?.name,
                    isBatting: null,
                    players: teamB?.players?.map(P => ({
                        ...P,
                        isDismissed: false,
                    })),
                };
            });
    },
});

export const {
    addBall,
    // setTeamPlayers,
    selectNewBatsman,
    changeBowler,
    tossWinner_fn,
    tossDecision_fn,
    initiate_LS_presistance,
    resetMatch,
    setInings
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


function inject_isDismissedInPlayers(params) {
    if (!params) return;

    return {
        teamA: {
            ...params.teamA, isBatting: false,
            players: params.teamA.players.map((player) => ({
                ...player,
                isDismissed: false,
            })),
        },

        teamB: {
            ...params.teamB, isBatting: false,
            players: params.teamB.players.map((player) => ({
                ...player,
                isDismissed: false,
            })),
        },
    };
}