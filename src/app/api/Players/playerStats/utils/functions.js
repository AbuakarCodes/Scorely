// How these functions work
// "I have raw ball-by-ball data. I need to transform it into player statistics by looking
//  at only that player's actions, grouping them correctly, and then calculating
//  cricket formulas."

// -----------------------------------
// Raw Balls
//     ↓
// Filter player's balls
//     ↓
// Group balls into innings
//     ↓
// Calculate innings statistics
//     ↓
// Combine all innings
//     ↓
// Calculate final career statistics
// -----------------------------------

export function getPlayerBowlingStats(balls, playerId) {
  if (!Array.isArray(balls) || !playerId) {
    return {
      totalWickets: 0,
      oversBowled: "0.0",
      economy: 0,
      bowlingAverage: 0,
      bowlingStrikeRate: 0,
      bestFigures: "0/0",
      matches: 0,
      runsConceded: 0,
      maidens: 0,
      dotBalls: 0,
      wides: 0,
      noBalls: 0,
      boundariesConceded: 0,
    }
  }

  // Only balls bowled by this player

  const playerBalls = balls.filter((ball) => ball.bowlerId === playerId)

  // Group by MATCH + INNINGS

  const inningsMap = new Map()

  let consecutiveWicketTracker = 0

  for (const ball of playerBalls) {
    const key = `${ball.matchId}-${ball.inningsNumber}`

    if (!inningsMap.has(key)) {
      inningsMap.set(key, {
        legalBalls: 0,
        runsConceded: 0,
        wickets: 0,
        dotBalls: 0,
        boundariesConceded: 0,
        balls: [],
        hatTrick: 0,
      })
    }

    const innings = inningsMap.get(key)

    innings.balls.push(ball)

    if (ball.isLegalDelivery) {
      innings.legalBalls++
    }

    const isBye = ball.extraType === "bye" || ball.extraType === "legbye"

    if (!isBye) innings.runsConceded += (ball.runs || 0) + (ball.extraRuns || 0)

    if (ball.isWicket) {
      consecutiveWicketTracker++
      innings.wickets++
      if (consecutiveWicketTracker === 3) {
        innings.hatTrick++
        consecutiveWicketTracker = 0
      }
    }

    if ((ball.runs || 0) === 0 && (ball.extraRuns || 0) === 0) innings.dotBalls++

    if (ball.runs === 4) innings.boundariesConceded++
    if (ball.runs === 6) innings.boundariesConceded++
  }

  const inningsList = Array.from(inningsMap.values())

  let totalWickets = 0
  let totalLegalBalls = 0
  let totalRunsConceded = 0
  let totalDotBalls = 0
  let totalBoundaries = 0
  let totalHatTriks_W = 0

  let totalWides = 0
  let totalNoBalls = 0

  let maidens = 0

  let bestWickets = 0
  let bestRuns = Infinity

  // Process each innings
  for (const innings of inningsList) {
    totalWickets += innings.wickets
    totalLegalBalls += innings.legalBalls
    totalRunsConceded += innings.runsConceded
    totalDotBalls += innings.dotBalls
    totalBoundaries += innings.boundariesConceded
    totalHatTriks_W += innings.hatTrick

    // Maidens
    let legalInCurrentOver = 0
    let runsInCurrentOver = 0

    for (const ball of innings.balls) {
      if (ball.isLegalDelivery) {
        const isByeForRuns = ball.extraType === "bye" || ball.extraType === "legbye"
        const ballRuns = isByeForRuns ? 0 : (ball.runs || 0) + (ball.extraRuns || 0)

        legalInCurrentOver++
        runsInCurrentOver += ballRuns

        if (legalInCurrentOver === 6) {
          if (runsInCurrentOver === 0) {
            maidens++
          }
          legalInCurrentOver = 0
          runsInCurrentOver = 0
        }
      } else {
        // Wides/no-balls extend the over but still count
        // toward runs conceded for maiden purposes.
        const runsOnIllegalBall = (ball.runs || 0) + (ball.extraRuns || 0)
        runsInCurrentOver += runsOnIllegalBall
      }
    }

    if (
      innings.wickets > bestWickets ||
      (innings.wickets === bestWickets && innings.wickets > 0 && innings.runsConceded < bestRuns)
    ) {
      bestWickets = innings.wickets
      bestRuns = innings.runsConceded
    }

    // Wides / No-balls

    for (const ball of innings.balls) {
      if (ball.extraType === "wide") {
        totalWides += ball.extraRuns || 0
      }

      if (ball.extraType === "noball") {
        totalNoBalls += 1
      }
    }
  }

  // Overs

  const completeOvers = Math.floor(totalLegalBalls / 6)

  const remainingBalls = totalLegalBalls % 6

  const oversBowled = `${completeOvers}.${remainingBalls}`

  // Decimal overs for calculations
  const decimalOvers = totalLegalBalls / 6

  // Economy
  const economy = decimalOvers > 0 ? totalRunsConceded / decimalOvers : 0

  // Bowling Average
  //
  // Runs conceded / wickets
  const bowlingAverage = totalWickets > 0 ? totalRunsConceded / totalWickets : 0

  // Bowling Strike Rate
  //
  // Legal balls / wickets
  const bowlingStrikeRate = totalWickets > 0 ? totalLegalBalls / totalWickets : 0

  // Matches

  const matches = new Set(playerBalls.map((ball) => ball.matchId)).size

  // Best Figures

  const bestFigures = bestWickets > 0 ? `${bestWickets}/${bestRuns}` : "0/0"

  // Return

  console.log({ totalHatTriks_W })

  return {
    totalWickets,
    oversBowled,
    economy: Number(economy.toFixed(2)),
    bowlingAverage: Number(bowlingAverage.toFixed(2)),
    bowlingStrikeRate: Number(bowlingStrikeRate.toFixed(2)),
    bestFigures,
    matches,
    totalHatTriks_W,
    overs: oversBowled,
    runsConceded: totalRunsConceded,
    maidens,
    dotBalls: totalDotBalls,
    wides: totalWides,
    noBalls: totalNoBalls,
    boundariesConceded: totalBoundaries,
  }
}

export function getPlayerBattingStats(balls, playerId) {


  if (!Array.isArray(balls) || !playerId) {
    return {
      totalRuns: 0,
      numberOfmatchesPlayed: 0,
      average: 0,
      strikeRate: 0,
      bestScore: "0",
      boundaryPercentage: 0,
      fours: 0,
      sixes: 0,
      fifties: 0,
      hundreds: 0,
      ducks: 0,
      dotBalls: 0,
      runsPerMatch: 0,
    }
  }

  // Only balls where this player was batting
  const playerBalls = balls.filter((ball) => ball?.strikerId === playerId)

  // Group balls by MATCH + INNINGS
  const inningsMap = new Map()

  // helping variable
  let consecutiveFours = 0

  for (const ball of playerBalls) {
    const key = `${ball?.matchId}-${ball?.inningsNumber}`

    if (!inningsMap.has(key)) {
      inningsMap.set(key, {
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        dismissed: false,
        dotBalls: 0,
        hatTrick: 0,
      })
    }

    const innings = inningsMap.get(key)

    // variables
    const isBallFaced = ball.isLegalDelivery && ball.extraType !== "Bye" && ball.extraType !== "Legbye"
    const runs = ball.runs || 0

    innings.runs += runs
    if (isBallFaced) innings.ballsFaced++
    if (isBallFaced && runs === 0) innings.dotBalls++

    if (runs === 4) {
      consecutiveFours++
      innings.fours++
      if (consecutiveFours === 3) {
        innings.hatTrick++
        consecutiveFours = 0
      }
    }
    if (runs != 4) consecutiveFours = 0
    if (runs === 6) innings.sixes++
    if (ball.isWicket) innings.dismissed = true
  }

  const inningsList = Array.from(inningsMap.values())

  const numberOfmatchesPlayed = new Set(playerBalls.map((ball) => ball.matchId)).size

  let totalRuns = 0
  let totalBallsFaced = 0
  let totalFours = 0
  let totalSixes = 0
  let totalDismissals = 0
  let totalDotBalls = 0
  let totalHatTriks_4s = 0
  let bestScore = 0
  let bestScoreNotOut = false

  let fifties = 0
  let hundreds = 0
  let ducks = 0

  for (const innings of inningsList) {
    totalRuns += innings.runs
    totalBallsFaced += innings.ballsFaced

    totalFours += innings.fours
    totalSixes += innings.sixes
    totalDotBalls += innings.dotBalls
    totalHatTriks_4s += innings.hatTrick

    if (innings.dismissed) totalDismissals++

    // Best score
    const isBetterScore =
      innings.runs > bestScore || (innings.runs === bestScore && !innings.dismissed && !bestScoreNotOut)

    if (isBetterScore) {
      bestScore = innings.runs
      bestScoreNotOut = !innings.dismissed
    }

    if (innings.runs >= 50 && innings.runs < 100) fifties++
    if (innings.runs >= 100) hundreds++
    if (innings.runs === 0 && innings.dismissed) ducks++
  }

  const strikeRate = totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0

  const average = totalDismissals > 0 ? totalRuns / totalDismissals : totalRuns

  const boundaryRuns = totalFours * 4 + totalSixes * 6

  const boundaryPercentage = totalRuns > 0 ? (boundaryRuns / totalRuns) * 100 : 0

  const runsPerMatch = numberOfmatchesPlayed > 0 ? totalRuns / numberOfmatchesPlayed : 0

  return {
    totalRuns,
    numberOfmatchesPlayed,
    average: Number(average.toFixed(2)),
    strikeRate: Number(strikeRate.toFixed(2)),
    bestScore: `${bestScore}${bestScoreNotOut ? "*" : ""}`,
    boundaryPercentage: Number(boundaryPercentage.toFixed(2)),
    matches: numberOfmatchesPlayed,
    fours: totalFours,
    sixes: totalSixes,
    fifties,
    hundreds,
    totalHatTriks_4s,
    ducks,
    dotBalls: totalDotBalls,
    runsPerMatch: Number(runsPerMatch.toFixed(2)),
  }
}
