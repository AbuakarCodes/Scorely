import axios from "axios";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";



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
            over: 0,
            ballsInOver: 0,
            CRR: 0,
            RRR: 0
        },

        balls: [],

        pendingNewBatsman: { striker: true, nonStriker: true },
        pendingNewBowler: true,
    },

    batsmen: {
        batsmenA: {
            id: "",
            name: "",
            runs: "",
            balls: "",
            fours: "",
            sixes: "",
            strikeRate: "140.62",
            isStriker: false,
        },

        batsmenB: {
            id: "",
            name: "",
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
        isIningsStarted: false,
        show_prevMatch_popup: false

    }

};
// INITIAL STATE
const initialState = loadMatchState() || defaultState





// SLICE

const matchSlice = createSlice({
    name: "match",
    initialState,

    reducers: {

        // // ADD BALL
        // addBall: (state, action) => {
        //     const { runs = 0, wicket = false } = action.payload;

        //     const innings = state.innings;

        //     // function will return that object 
        //     const ball = {
        //         matchId: state.match.id,

        //         inningsNumber: state.innings.isFirstInnings ? 1 : 2,

        //         over: state.innings.score.overs,
        //         ballInOver: state.innings.score.balls,

        //         isLegalDelivery:
        //             action.payload.extraType !== "Wide" &&
        //             action.payload.extraType !== "NB",

        //         strikerId: state.innings.strikerId,
        //         nonStrikerId: state.innings.nonStrikerId,
        //         bowlerId: state.innings.currentBowlerId,

        //         runs: action.payload.runs || 0,

        //         extraType: action.payload.extraType || null,
        //         extraRuns: action.payload.extraRuns || 0,

        //         isWicket: action.payload.wicket || false,
        //     };

        //     // state shange 
        //     innings.balls.push(ball);


        //     innings.score.runs += runs;

        //     // legal delivery
        //     innings.score.balls += 1;

        //     // wicket
        //     if (wicket) {
        //         innings.score.wickets += 1;
        //         innings.pendingNewBatsman = true;
        //     }

        //     // over completed
        //     if (innings.score.balls === 5) {
        //         innings.score.overs += 1;
        //         innings.score.balls = 0;

        //         swapStrike(state);

        //         innings.pendingBowlerChange = true;
        //     }

        //     // strike rotation
        //     if (runs % 2 === 1) {
        //         swapStrike(state);
        //     }
        // },






        setMatch_id(state, action) {
            if (!action.payload) return
            state.match.id = action.payload
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

        startInnings_fn(state) {
            state.flags.isIningsStarted = true;
        },
        resetMatch(state) {
            localStorage.removeItem("match");
            return defaultState;
        },

        setInings(state, action) {
            if (!action.payload || typeof action.payload != "boolean") return
            state.innings.isFirstInings = action.payload
        },

        chnageBatsmen_OR_Bowler(state, action) {
            //  State Flags indicate what we need
            const { striker, nonStriker, bowler } = action.payload;
            // Thats the info for new players (id's ad name)

            const needBothBatsmen =
                state.innings.pendingNewBatsman.striker &&
                state.innings.pendingNewBatsman.nonStriker;

            const needStriker =
                state.innings.pendingNewBatsman.striker &&
                !needBothBatsmen;

            const needNonStriker =
                state.innings.pendingNewBatsman.nonStriker &&
                !needBothBatsmen;

            const needBowler = state.innings.pendingNewBowler;

            // Validation
            if (needBothBatsmen && (!striker?.id || !nonStriker?.id)) return;
            if (needStriker && !striker?.id) return;
            if (needNonStriker && !nonStriker?.id) return;
            if (needBowler && !bowler?.id) return;

            const strikerBatsman = Object.values(state.batsmen).find(
                batsman => batsman.isStriker
            );

            const nonStrikerBatsman = Object.values(state.batsmen).find(
                batsman => !batsman.isStriker
            );

            if (needStriker) resetBatsman(strikerBatsman, striker);
            if (needNonStriker) resetBatsman(nonStrikerBatsman, nonStriker);
            if (needBothBatsmen) {
                resetBatsman(strikerBatsman, striker);
                resetBatsman(nonStrikerBatsman, nonStriker);
            }
            if (needBowler) {
                resetBowler(state.bowler.currentBowler, bowler);
            }

            state.innings.pendingNewBatsman.striker = false;
            state.innings.pendingNewBatsman.nonStriker = false;
            state.innings.pendingNewBowler = false;
        },

        deliverBall(state, action) {
            if (!action.payload) return
            const ballObject = action.payload
            state.innings.balls.push(ballObject)
        },

        update_TotalRuns(state) {
            const balls = state?.innings?.balls || []
            const calculatedRuns = balls.reduce((total, ball) => {
                return total + ball.runs + ball.extraRuns;
            }, 0);
            state.innings.score.runs = calculatedRuns
        },
        update_TotalWickets(state) {
            const balls = state?.innings?.balls || []
            const calculatingWickets = balls.reduce((wickets, ball) => {
                return wickets + (ball.isWicket ? 1 : 0)
            }, 0)
            state.innings.score.wickets = calculatingWickets
        },
        update_overAndBallInOver(state, action) {
            const { isLegalDelivery } = action.payload
            const currentBall = state.innings.score.ballsInOver

            if (currentBall < 5 && isLegalDelivery) {
                state.innings.score.ballsInOver++
            }

            if (currentBall === 5 && isLegalDelivery) {
                state.innings.score.over++
                state.innings.score.ballsInOver = 0
            }
        },
        update_CRRandRRR(state) {
            const balls = state.innings?.balls || []
            const legalDeliveries = balls.filter(b => b.isLegalDelivery).length
            const runs = state.innings?.score?.runs || 0

            state.innings.score.CRR =
                legalDeliveries === 0
                    ? "0.00"
                    : ((runs * 6) / legalDeliveries).toFixed(2)
        },
        Update_Strike(state, action) {
            if (!action.payload) return;

            const ballObject = action.payload;

            const isLastBall = ballObject.isLegalDelivery && ballObject.ballInOver === 5;
            const isOddRuns = ballObject.runs % 2 !== 0;

            if (
                (isOddRuns && !isLastBall) ||
                (!isOddRuns && isLastBall)
            ) {
                swapStriker(state.batsmen)
            }

        },

        update_pendingPlayersFlag(state, action) {
            if (!action.payload) return
            const ballObject = action.payload
            const isWicket = ballObject.isWicket
            const isOverEnd = ballObject.isLegalDelivery ? ballObject.ballInOver === 5 : false

            if (isWicket) state.innings.pendingNewBatsman = { ...state.innings.pendingNewBatsman, striker: true }
            if (isOverEnd) state.innings.pendingNewBowler = true

        },

        update_isDissmissedFlag(state, action) {
            if (!action.payload) return;
            const ballObject = action.payload;
            if (!ballObject.isWicket) return;
            const striker = [
                ...state.match.teams.teamA.players,
                ...state.match.teams.teamB.players,
            ].find(p => p._id === ballObject.strikerId);
            if (!striker) return;
            striker.isDismissed = true;
        },

        update_isSelectedBatsmen_Flag(state, action) {
            if (!action.payload) return;
            const id = action.payload;
            const selectedPlayer = [
                ...state.match.teams.teamA.players,
                ...state.match.teams.teamB.players,
            ].find(p => p._id === id);
            if (!selectedPlayer) return;
            striker.isSelected = true;
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
    setMatch_id,
    addBall,
    tossWinner_fn,
    tossDecision_fn,
    startInnings_fn,
    resetMatch,
    setInings,
    chnageBatsmen_OR_Bowler,
    deliverBall,
    // mutating score board
    update_TotalRuns,
    update_TotalWickets,
    update_overAndBallInOver,
    update_CRRandRRR,
    Update_Strike,
    update_pendingPlayersFlag,
    update_isDissmissedFlag,
    update_isSelectedBatsmen_Flag
} = matchSlice.actions;

export default matchSlice.reducer;


// Ytility Functions
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
                isBatting: false,
            })),
        },

        teamB: {
            ...params.teamB, isBatting: false,
            players: params.teamB.players.map((player) => ({
                ...player,
                isDismissed: false,
                isBatting: false,
            })),
        },
    };
}

const resetBatsman = (batsman, player) => {
    batsman.id = player.id;
    batsman.name = player.name;
    batsman.runs = 0;
    batsman.balls = 0;
    batsman.fours = 0;
    batsman.sixes = 0;
    batsman.strikeRate = 0;
};

const resetBowler = (currentBowler, player) => {
    currentBowler.id = player.id;
    currentBowler.name = player.name;
    currentBowler.over = 0;
    currentBowler.ballInOver = 0;
    currentBowler.runsOnThatBall = 0;
    currentBowler.Econ = 0;
    currentBowler.TotalWickets = 0;
    currentBowler.TotalOver = 0;
    currentBowler.TotalRunsConceded = 0;
};

function swapStriker(batsmen) {
    const strikerKey = Object.keys(batsmen).find(
        key => batsmen[key].isStriker
    )

    const nonStrikerKey = Object.keys(batsmen).find(
        key => !batsmen[key].isStriker
    )

    if (!strikerKey || !nonStrikerKey) return

    batsmen[strikerKey].isStriker = false
    batsmen[nonStrikerKey].isStriker = true
}