import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    match: {
        id: "match_1",

        teams: {
            teamA: {
                id: "teamA",
                name: "Australia",

                players: [
                    { id: "p1", name: "Steve Smith" },
                    { id: "p2", name: "Alex Carey" },
                    { id: "p3", name: "Maxwell" },
                    { id: "p4", name: "Marsh" },
                ],
            },

            teamB: {
                id: "teamB",
                name: "England",

                players: [
                    { id: "p10", name: "Mark Wood" },
                    { id: "p11", name: "Adil Rashid" },
                    { id: "p12", name: "Archer" },
                ],
            },
        },
    },

    innings: {
        battingTeamId: "teamA",
        bowlingTeamId: "teamB",

        strikerId: "p1",
        nonStrikerId: "p2",

        currentBowlerId: "p10",

        yetToBat: ["p3", "p4"],

        availableBowlers: ["p10", "p11", "p12"],

        score: {
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
        },

        currentOver: [],

        balls: [],

        pendingNewBatsman: false,

        pendingBowlerChange: false,
    },

    playerStats: {
        batting: {
            p1: {
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
            },

            p2: {
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
            },
        },

        bowling: {
            p10: {
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
            },
        },
    },
};

const swapStrike = (state) => {
    const temp = state.innings.strikerId;

    state.innings.strikerId =
        state.innings.nonStrikerId;

    state.innings.nonStrikerId = temp;
};

const matchSlice = createSlice({
    name: "match",

    initialState,

    reducers: {
        // ------------------------------------------------------------------
        // ADD BALL
        // ------------------------------------------------------------------

        addBall: (state, action) => {
            const {
                runs,
                wicket = false,
                extraType = null,
            } = action.payload;

            const innings = state.innings;

            const strikerId = innings.strikerId;

            const bowlerId = innings.currentBowlerId;

            // --------------------------------------------------------------
            // CREATE BALL OBJECT
            // --------------------------------------------------------------

            const ballObject = {
                id: crypto.randomUUID(),

                over: innings.score.overs,

                ball: innings.score.balls,

                strikerId,

                bowlerId,

                runs,

                wicket,

                extraType,

                timestamp: Date.now(),
            };

            innings.balls.push(ballObject);

            innings.currentOver.push(ballObject);

            // --------------------------------------------------------------
            // SCORE UPDATE
            // --------------------------------------------------------------

            innings.score.runs += runs;

            // --------------------------------------------------------------
            // BATSMAN STATS
            // --------------------------------------------------------------

            if (
                !extraType ||
                extraType === "bye" ||
                extraType === "legbye"
            ) {
                state.playerStats.batting[
                    strikerId
                ].balls += 1;
            }

            if (
                extraType !== "bye" &&
                extraType !== "legbye"
            ) {
                state.playerStats.batting[
                    strikerId
                ].runs += runs;
            }

            if (runs === 4) {
                state.playerStats.batting[
                    strikerId
                ].fours += 1;
            }

            if (runs === 6) {
                state.playerStats.batting[
                    strikerId
                ].sixes += 1;
            }

            // --------------------------------------------------------------
            // BOWLER STATS
            // --------------------------------------------------------------

            state.playerStats.bowling[
                bowlerId
            ].runs += runs;

            if (
                !extraType ||
                extraType === "bye" ||
                extraType === "legbye"
            ) {
                state.playerStats.bowling[
                    bowlerId
                ].balls += 1;
            }

            // --------------------------------------------------------------
            // LEGAL DELIVERY
            // --------------------------------------------------------------

            const legalDelivery =
                !extraType ||
                extraType === "bye" ||
                extraType === "legbye";

            if (legalDelivery) {
                innings.score.balls += 1;
            }

            // --------------------------------------------------------------
            // OVER COMPLETE
            // --------------------------------------------------------------

            if (innings.score.balls === 6) {
                innings.score.overs += 1;

                innings.score.balls = 0;

                innings.currentOver = [];

                swapStrike(state);

                innings.pendingBowlerChange = true;
            }

            // --------------------------------------------------------------
            // STRIKE ROTATION
            // --------------------------------------------------------------

            if (runs % 2 === 1) {
                swapStrike(state);
            }

            // --------------------------------------------------------------
            // WICKET
            // --------------------------------------------------------------

            if (wicket) {
                innings.score.wickets += 1;

                state.playerStats.bowling[
                    bowlerId
                ].wickets += 1;

                innings.pendingNewBatsman = true;
            }
        },

        // ------------------------------------------------------------------
        // SELECT NEW BATSMAN
        // ------------------------------------------------------------------

        selectNewBatsman: (state, action) => {
            const playerId = action.payload;

            state.innings.strikerId = playerId;

            state.innings.yetToBat =
                state.innings.yetToBat.filter(
                    (id) => id !== playerId
                );

            state.innings.pendingNewBatsman = false;

            // initialize stats
            if (
                !state.playerStats.batting[playerId]
            ) {
                state.playerStats.batting[playerId] = {
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                };
            }
        },

        // ------------------------------------------------------------------
        // CHANGE BOWLER
        // ------------------------------------------------------------------

        changeBowler: (state, action) => {
            const bowlerId = action.payload;

            state.innings.currentBowlerId =
                bowlerId;

            state.innings.pendingBowlerChange =
                false;

            // initialize stats
            if (
                !state.playerStats.bowling[bowlerId]
            ) {
                state.playerStats.bowling[bowlerId] = {
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    wickets: 0,
                };
            }
        },

        // ------------------------------------------------------------------
        // UNDO LAST BALL
        // ------------------------------------------------------------------

        undoBall: (state) => {
            /*
            Real undo is complex.
      
            Best architecture:
            - remove last ball
            - replay all balls
            - regenerate innings state
      
            Professional systems use replay reducers.
            */
        },

        // ------------------------------------------------------------------
        // RESET MATCH
        // ------------------------------------------------------------------

        resetMatch: () => initialState,
    },
});

export const {
    addBall,
    selectNewBatsman,
    changeBowler,
    undoBall,
    resetMatch,
} = matchSlice.actions;

export default matchSlice.reducer;