import axios from "axios";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

let count = 0

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
        matchWinner: { id: null, name: null },

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
        isFirstInings: null, // null = match not started, true = 1st innings, false = 2nd innings

        battingTeamId: "",
        bowlingTeamId: "",



        score: {
            runs: 0,
            wickets: 0,
            over: 0,
            ballsInOver: 0,
            CRR: 0,
            RRR: 0,
            target: 0
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
            strikeRate: "",
            isStriker: true, // setting it true on purpose, as we are setting the striker batsmen on the basises
            // of is striker flag, if its false then at first time we'll not be able to find "strikerBatsman" at "chnageBatsmen_OR_Bowler"
            // so initialy math that flage true so the sleected striker place there    
        },

        batsmenB: {
            id: "",
            name: "",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isStriker: false,
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
            TotalOvers: 0,
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
            const param = action.payload
            chnageInnings_State(state.innings, param)
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

            const { strikerBatsman, nonStrikerBatsman } = findStrikertNonStriker(state.batsmen)

            if (needStriker) resetBatsman(strikerBatsman, striker);
            if (needNonStriker) resetBatsman(nonStrikerBatsman, nonStriker);
            if (needBowler) resetBowler(state.bowler.currentBowler, bowler);
            if (needBothBatsmen) {
                resetBatsman(strikerBatsman, striker);
                resetBatsman(nonStrikerBatsman, nonStriker);
            }

            chnagePendingBatsman_Bowler_flag(state, false);
        },
        handelLastPlayer_isLastPlayerTrue(state, action) {
            const { ballObject, lastPlayerPlayed } = action.payload

            const team = state?.match?.teams || []
            const tossDecision = state?.match?.tossDecision || ""
            const tossWinner = state.match.tossWinner
            const isFirstInings = state.innings.isFirstInings
            const isWicket = ballObject.isWicket
            const canContinueBat = numberOfPlayersCanBat({ team, tossDecision, tossWinner, isFirstInings, ballObject })
            const { strikerBatsman, nonStrikerBatsman } = findStrikertNonStriker(state.batsmen)

            if (lastPlayerPlayed && canContinueBat === 0 && isWicket) {
                if (nonStrikerBatsman.id) {
                    resetBatsman(strikerBatsman, nonStrikerBatsman)
                    resetBatsman(nonStrikerBatsman)
                }
            }

        },

        deliverBall(state, action) {
            if (!action.payload) return
            const { ballObject } = action.payload
            state.innings.balls.push(ballObject)
        },

        update_overAndBallInOver(state, action) {
            const { ballObject, TotalOvers } = action.payload
            const { isLegalDelivery, ballInOver, over } = ballObject

            const oversCompleted = hasOversCompleted({ over, TotalOvers, isLegalDelivery, ballInOver })
            if (oversCompleted) return

            if (ballInOver < 5 && isLegalDelivery) {
                state.innings.score.ballsInOver++
            }

            if (ballInOver === 5 && isLegalDelivery) {
                state.innings.score.over++
                state.innings.score.ballsInOver = 0
            }
        },

        update_TotalRuns(state) {
            const balls = state?.innings?.balls || []
            const Filteredballs = perInningBalls(balls, state.innings)
            const calculatedRuns = Filteredballs.reduce((total, ball) => {
                return total + ball.runs + ball.extraRuns;
            }, 0);
            state.innings.score.runs = calculatedRuns
        },
        update_TotalWickets(state) {
            const balls = state?.innings?.balls || []
            const Filteredballs = perInningBalls(balls, state.innings)
            const TotalWickets = calulateTotalWickets(Filteredballs)

            state.innings.score.wickets = !isNaN(TotalWickets) ? TotalWickets : 0
        },

        update_CRRandRRR(state, action) {
            const balls = state.innings?.balls || []
            const Filteredballs = perInningBalls(balls, state.innings)

            const isFirstInings = state.innings.isFirstInings
            const { TotalOvers } = action.payload
            const target = state.innings.score.target
            const currentRuns = state.innings.score.runs
            const over = state.innings.score.over
            const ballsInOver = state.innings.score.ballsInOver


            const legalDeliveries = Filteredballs.filter(b => b.isLegalDelivery).length
            const runs = state.innings?.score?.runs || 0

            const CRR = legalDeliveries === 0 ? "0.00" : ((runs * 6) / legalDeliveries).toFixed(2)
            const RRR = isFirstInings === false ? calculateRRR({ target, currentRuns, over, ballsInOver, TotalOvers }) : 0

            state.innings.score.CRR = CRR
            state.innings.score.RRR = RRR

            // 

        },
        Update_Strike(state, action) {
            if (!action.payload) return;

            const team = state?.match?.teams || []
            const tossDecision = state?.match?.tossDecision || ""
            const tossWinner = state.match.tossWinner
            const isFirstInings = state.innings.isFirstInings
            const { ballObject, lastPlayerPlayed } = action.payload;

            const canContinueBat = numberOfPlayersCanBat({ team, tossDecision, tossWinner, isFirstInings, ballObject })

            // when only one player is on crease then there will be no one to switch strike with
            if (lastPlayerPlayed && canContinueBat === 0) return

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
            const { ballObject, TotalOvers } = action.payload
            const { over, isLegalDelivery, ballInOver } = ballObject
            // parameters
            const team = state?.match?.teams || []
            const tossDecision = state?.match?.tossDecision || ""
            const tossWinner = state.match.tossWinner
            const isFirstInings = state.innings.isFirstInings

            const isWicket = ballObject.isWicket
            const isOverEnd = ballObject.isLegalDelivery ? ballObject.ballInOver === 5 : false
            const oversCompleted = hasOversCompleted({ over, TotalOvers, isLegalDelivery, ballInOver })
            const arePlayersLeft = numberOfPlayersCanBat({ team, tossDecision, tossWinner, isFirstInings, ballObject })
            if (isWicket && arePlayersLeft != 0) state.innings.pendingNewBatsman = { ...state.innings.pendingNewBatsman, striker: true }
            if (isOverEnd && !oversCompleted) state.innings.pendingNewBowler = true

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
        },

        Update_innings(state, action) {
            // we are just only dealing with changing innings from 1st to 2nd, 
            // if innings is already 2nd then dont need to update it simple end the match 
            const isFirstInings = state?.innings?.isFirstInings
            if (isFirstInings === false) return

            const { ballObject, TotalOvers, lastPlayerPlayed } = action.payload;
            const { over, isLegalDelivery, ballInOver } = ballObject
            // parameters
            const balls = state?.innings?.balls || []
            const team = state?.match?.teams || []
            const tossDecision = state?.match?.tossDecision || ""
            const tossWinner = state.match.tossWinner
            // Requried variables
            const TotalWickets = calulateTotalWickets(balls)
            const NumberOfBatters = batting_bowlingTeam({ team, tossDecision, tossWinner, isFirstInings })?.battingTeam?.players?.length || 0
            const isWicket = ballObject.isWicket

            const oversCompleted = hasOversCompleted({ over, TotalOvers, isLegalDelivery, ballInOver })
            const canContinueBat = numberOfPlayersCanBat({ team, tossDecision, tossWinner, isFirstInings, ballObject })


            // Innings ends because allotted overs are completed
            if (oversCompleted) {
                chnageInnings_State(state.innings, false);
                chnagePendingBatsman_Bowler_flag(state, true);
                Update_UI_afterInnings({ innings: state.innings, TotalOvers })
            }

            // Innings ends when all batters are dismissed (last batter not allowed)
            if (!lastPlayerPlayed) {
                if (canContinueBat === 0 && isWicket) {
                    chnageInnings_State(state.innings, false);
                    chnagePendingBatsman_Bowler_flag(state, true);
                    Update_UI_afterInnings({ innings: state.innings, TotalOvers })
                }
            }

            // Innings ends when the last batter is dismissed
            else {
                if (TotalWickets === NumberOfBatters) {
                    chnageInnings_State(state.innings, false);
                    chnagePendingBatsman_Bowler_flag(state, true);
                    Update_UI_afterInnings({ innings: state.innings, TotalOvers })
                }
            }
        },



        match_Decision(state, action) {
            const isFirstInings = state?.innings?.isFirstInings
            if (isFirstInings != false) return

            const { TotalOvers, ballObject, lastPlayerPlayed } = action.payload;

            if (!TotalOvers || !ballObject || lastPlayerPlayed === "undefined") return

            const { over, isLegalDelivery, ballInOver } = ballObject

            const target = state?.innings?.score?.target
            const runs = state?.innings?.score?.runs
            const balls = state?.innings?.balls || []
            const team = state?.match?.teams || []
            const tossDecision = state?.match?.tossDecision || ""
            const tossWinner = state.match.tossWinner
            // only comapre the results when the second innings started, other wise its started compareing zero score
            // with target and bowler wins without even started the 2nd innings
            const isSecondInningsStarted = balls.some(b => b?.inningsNumber === 2)

            const TotalWickets = calulateTotalWickets(balls)
            const NumberOfBatters = batting_bowlingTeam({ team, tossDecision, tossWinner, isFirstInings })?.battingTeam?.players?.length || 0

            const oversCompleted = hasOversCompleted({ over, TotalOvers, isLegalDelivery, ballInOver })
            const allWicketsDown = lastPlayerPlayed
                ? NumberOfBatters - TotalWickets === 0
                : NumberOfBatters - TotalWickets === TotalWickets - 1;

            if (!isSecondInningsStarted) return

            if (runs >= target) {
                const battingTeam = batting_bowlingTeam({ team, tossDecision, tossWinner, isFirstInings })?.battingTeam ?? { id: "", name: "" };
                state.match.matchWinner.id = battingTeam.id;
                state.match.matchWinner.name = battingTeam.name;
                console.log("Batting Team Wins");
            }
            else if (allWicketsDown || oversCompleted) {
                if (runs === target - 1) {
                    state.match.matchWinner.id = "Tie";
                    state.match.matchWinner.name = null;
                }
                else if (runs < target - 1) {
                    const bowlingTeam = batting_bowlingTeam({ team, tossDecision, tossWinner, isFirstInings })?.bowlingTeam ?? { id: "", name: "" };
                    state.match.matchWinner.id = bowlingTeam.id;
                    state.match.matchWinner.name = bowlingTeam.name;
                }
            }



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
    update_isSelectedBatsmen_Flag,
    Update_innings,
    handelLastPlayer_isLastPlayerTrue,
    match_Decision
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

const resetBatsman = (batsman, player = {}) => {
    // batsman = State object which shows batsman on UI (Object)
    // player = New player selected by user (Object)
    // dont need to set striker flag there, as that function is being used for setting striker and nonstriker
    batsman.id = player.id ?? "";
    batsman.name = player.name ?? "";
    batsman.runs = player.runs ?? 0;
    batsman.balls = player.balls ?? 0;
    batsman.fours = player.fours ?? 0;
    batsman.sixes = player.sixes ?? 0;
    batsman.strikeRate = player.strikeRate ?? 0;
};

const resetBowler = (currentBowler, player) => {
    currentBowler.id = player.id;
    currentBowler.name = player.name;
    currentBowler.over = 0;
    currentBowler.ballInOver = 0;
    currentBowler.runsOnThatBall = 0;
    currentBowler.Econ = 0;
    currentBowler.TotalWickets = 0;
    currentBowler.TotalOvers = 0;
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

export function batting_bowlingTeam({ team, tossWinner, tossDecision, isFirstInings }) {

    // console.log(current(team.teamA));

    if (!team || !team.teamA || !team.teamB) {
        return {
            battingTeam: null,
            bowlingTeam: null,
        };
    }

    if (!tossWinner?.id) {
        return {
            battingTeam: null,
            bowlingTeam: null,
        };
    }

    if (tossDecision !== "bat" && tossDecision !== "bowl") {
        return {
            battingTeam: null,
            bowlingTeam: null,
        };
    }

    const { teamA, teamB } = team;


    if (teamA.id !== tossWinner.id && teamB.id !== tossWinner.id) {
        console.log("4");
        return {
            battingTeam: null,
            bowlingTeam: null,
        };
    }

    const tossWinningTeam = teamA.id === tossWinner.id ? teamA : teamB;
    const tossLostTeam = teamA.id === tossWinner.id ? teamB : teamA;

    let battingTeam;
    let bowlingTeam;

    if (tossDecision === "bat") {
        battingTeam = tossWinningTeam;
        bowlingTeam = tossLostTeam;
    } else {
        battingTeam = tossLostTeam;
        bowlingTeam = tossWinningTeam;
    }

    // Swap for second innings
    if (isFirstInings === false) {
        [battingTeam, bowlingTeam] = [bowlingTeam, battingTeam];
    }

    return {

        battingTeam,
        bowlingTeam,
    };
}

function hasOversCompleted({ over, TotalOvers, isLegalDelivery, ballInOver }) {
    if (over == null || TotalOvers == null || ballInOver == null || typeof isLegalDelivery !== "boolean") return false;

    const isOverGrater = over + 1 > TotalOvers
    const isOverEqualToTotalOver = over + 1 === TotalOvers && isLegalDelivery && ballInOver === 5

    if (isOverEqualToTotalOver || isOverGrater) return true
    else return false


}

function numberOfPlayersCanBat({ team, tossDecision, tossWinner, isFirstInings, ballObject }) {
    const { battingTeam } = batting_bowlingTeam({ team, tossDecision, tossWinner, isFirstInings })
    const remaningPlayers = battingTeam.players.filter(p => !p.isDismissed && p._id !== ballObject.strikerId && p._id !== ballObject.nonStrikerId).length
    return remaningPlayers
}

function calulateTotalWickets(PlayedBalls) {
    if (!PlayedBalls || !Array.isArray(PlayedBalls)) return
    const balls = PlayedBalls
    const calculatingWickets = balls.reduce((wickets, ball) => {
        return wickets + (ball.isWicket ? 1 : 0)
    }, 0)
    return calculatingWickets
}

function chnageInnings_State(stateInnings, updateedState) {
    if (!stateInnings || typeof updateedState != "boolean") return
    stateInnings.isFirstInings = updateedState
}

function chnagePendingBatsman_Bowler_flag(state, decision) {
    if (!state?.innings || typeof decision != "boolean") return;
    state.innings.pendingNewBatsman.striker = decision;
    state.innings.pendingNewBatsman.nonStriker = decision;
    state.innings.pendingNewBowler = decision;
}

function findStrikertNonStriker(batsmen) {
    if (!batsmen) return
    const strikerBatsman = Object.values(batsmen).find(batsman => batsman.isStriker);
    const nonStrikerBatsman = Object.values(batsmen).find(batsman => !batsman.isStriker);
    return {
        strikerBatsman,
        nonStrikerBatsman
    }
}

function perInningBalls(balls, innings) {
    if (!balls || innings === undefined || !Array.isArray(balls)) return
    const inningsNumber = innings?.isFirstInings === null ? 0 : innings?.isFirstInings ? 1 : 2

    return balls.filter(b => b.inningsNumber === inningsNumber)
}



function calculateRRR({ target, currentRuns, over, ballsInOver, TotalOvers }) {
    if (target == null || currentRuns == null || over == null || ballsInOver == null || TotalOvers == null) return 0

    const runsRequired = target - currentRuns
    const ballsRemaining = TotalOvers * 6 - (over * 6 + ballsInOver)

    if (ballsRemaining <= 0) return 0

    const runrate = ((runsRequired * 6) / ballsRemaining).toFixed(2)
    return runrate
}

function Update_UI_afterInnings({ innings, TotalOvers }) {
    const { score } = innings;

    // score // totalOvers

    const target = score.runs + 1;

    score.target = target;
    score.runs = 0;
    score.wickets = 0;
    score.over = 0;
    score.ballsInOver = 0;
    score.CRR = 0;

    score.RRR = calculateRRR({
        target,
        currentRuns: score.runs,
        over: score.over,
        ballsInOver: score.ballsInOver,
        TotalOvers,
    });

}

