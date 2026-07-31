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

  // --------------------------------------------------
  // Only balls bowled by this player
  // --------------------------------------------------

  const playerBalls = balls.filter((ball) => ball.bowlerId === playerId)

  // --------------------------------------------------
  // Group by MATCH + INNINGS
  // --------------------------------------------------

  const inningsMap = new Map()

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
      })
    }

    const innings = inningsMap.get(key)

    innings.balls.push(ball)

    // --------------------------------------------------
    // Legal delivery
    // --------------------------------------------------

    if (ball.isLegalDelivery) {
      innings.legalBalls++
    }

    // --------------------------------------------------
    // Runs conceded
    //
    // Bye / leg-bye are NOT charged to bowler.
    //
    // Wide = extraRuns charged to bowler
    // No-ball = extraRuns charged to bowler
    // Normal runs = ball.runs
    // --------------------------------------------------

    const isBye = ball.extraType === "bye" || ball.extraType === "legbye"

    if (!isBye) {
      innings.runsConceded += (ball.runs || 0) + (ball.extraRuns || 0)
    }

    // --------------------------------------------------
    // Wickets
    // --------------------------------------------------

    if (ball.isWicket) {
      innings.wickets++
    }

    // --------------------------------------------------
    // Dot balls
    //
    // No runs conceded by bowler.
    // --------------------------------------------------

    if ((ball.runs || 0) === 0 && (ball.extraRuns || 0) === 0) {
      innings.dotBalls++
    }

    // --------------------------------------------------
    // Boundaries conceded
    //
    // Count 4s and 6s hit by batsman.
    // --------------------------------------------------

    if (ball.runs === 4) {
      innings.boundariesConceded++
    }

    if (ball.runs === 6) {
      innings.boundariesConceded++
    }
  }

  const inningsList = Array.from(inningsMap.values())

  // --------------------------------------------------
  // Aggregate values
  // --------------------------------------------------

  let totalWickets = 0
  let totalLegalBalls = 0
  let totalRunsConceded = 0
  let totalDotBalls = 0
  let totalBoundaries = 0

  let totalWides = 0
  let totalNoBalls = 0

  let maidens = 0

  let bestWickets = 0
  let bestRuns = Infinity

  // --------------------------------------------------
  // Process each innings
  // --------------------------------------------------

  for (const innings of inningsList) {
    totalWickets += innings.wickets
    totalLegalBalls += innings.legalBalls
    totalRunsConceded += innings.runsConceded
    totalDotBalls += innings.dotBalls
    totalBoundaries += innings.boundariesConceded

    // ----------------------------------------------
    // Maidens
    //
    // A maiden is a single OVER (6 consecutive legal
    // deliveries bowled by this player within this
    // innings) that conceded 0 runs. We must walk the
    // over-by-over sequence rather than looking at the
    // innings totals, since a bowler can bowl multiple
    // overs in one innings.
    // ----------------------------------------------

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

    // ----------------------------------------------
    // Best figures
    //
    // First prioritize wickets.
    // If wickets are equal, lower runs is better.
    // ----------------------------------------------

    if (
      innings.wickets > bestWickets ||
      (innings.wickets === bestWickets && innings.wickets > 0 && innings.runsConceded < bestRuns)
    ) {
      bestWickets = innings.wickets
      bestRuns = innings.runsConceded
    }

    // ----------------------------------------------
    // Wides / No-balls
    // ----------------------------------------------

    for (const ball of innings.balls) {
      if (ball.extraType === "wide") {
        totalWides += ball.extraRuns || 0
      }

      if (ball.extraType === "noball") {
        totalNoBalls += 1
      }
    }
  }

  // --------------------------------------------------
  // Overs
  //
  // Cricket overs are NOT decimal.
  //
  // 142 balls = 23.4 overs
  // 143 balls = 23.5 overs
  // 144 balls = 24.0 overs
  // --------------------------------------------------

  const completeOvers = Math.floor(totalLegalBalls / 6)

  const remainingBalls = totalLegalBalls % 6

  const oversBowled = `${completeOvers}.${remainingBalls}`

  // --------------------------------------------------
  // Decimal overs for calculations
  // --------------------------------------------------

  const decimalOvers = totalLegalBalls / 6

  // --------------------------------------------------
  // Economy
  // --------------------------------------------------

  const economy = decimalOvers > 0 ? totalRunsConceded / decimalOvers : 0

  // --------------------------------------------------
  // Bowling Average
  //
  // Runs conceded / wickets
  // --------------------------------------------------

  const bowlingAverage = totalWickets > 0 ? totalRunsConceded / totalWickets : 0

  // --------------------------------------------------
  // Bowling Strike Rate
  //
  // Legal balls / wickets
  // --------------------------------------------------

  const bowlingStrikeRate = totalWickets > 0 ? totalLegalBalls / totalWickets : 0

  // --------------------------------------------------
  // Matches
  // --------------------------------------------------

  const matches = new Set(playerBalls.map((ball) => ball.matchId)).size

  // --------------------------------------------------
  // Best Figures
  // --------------------------------------------------

  const bestFigures = bestWickets > 0 ? `${bestWickets}/${bestRuns}` : "0/0"

  // --------------------------------------------------
  // Return
  // --------------------------------------------------

  return {
    totalWickets,

    oversBowled,

    economy: Number(economy.toFixed(2)),

    bowlingAverage: Number(bowlingAverage.toFixed(2)),

    bowlingStrikeRate: Number(bowlingStrikeRate.toFixed(2)),

    bestFigures,

    matches,

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
      matchesPlayed: 0,
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

  // -----------------------------------------
  // Group balls by MATCH + INNINGS
  // -----------------------------------------

  const inningsMap = new Map()

  for (const ball of playerBalls) {
    const key = `${ball.matchId}-${ball.inningsNumber}`

    if (!inningsMap.has(key)) {
      inningsMap.set(key, {
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        dismissed: false,
        dotBalls: 0,
      })
    }

    const innings = inningsMap.get(key)

    const runs = ball.runs || 0

    // -----------------------------------------
    // Runs
    // -----------------------------------------

    innings.runs += runs

    // -----------------------------------------
    // Balls faced
    //
    // Wide = not a ball faced
    // No-ball = not a ball faced
    // Bye/legbye = ball happened but batsman
    // did not face it for batting stats
    // -----------------------------------------

    const isBallFaced = ball.isLegalDelivery && ball.extraType !== "bye" && ball.extraType !== "legbye"

    if (isBallFaced) {
      innings.ballsFaced++
    }

    // -----------------------------------------
    // Dot ball
    // -----------------------------------------

    if (isBallFaced && runs === 0) {
      innings.dotBalls++
    }

    // -----------------------------------------
    // Boundaries
    // -----------------------------------------

    if (runs === 4) {
      innings.fours++
    }

    if (runs === 6) {
      innings.sixes++
    }

    // -----------------------------------------
    // Wicket
    //
    // isWicket === true means striker got out.
    // -----------------------------------------

    if (ball.isWicket) {
      innings.dismissed = true
    }
  }

  const inningsList = Array.from(inningsMap.values())

  // -----------------------------------------
  // Matches played
  // -----------------------------------------

  const matchesPlayed = new Set(playerBalls.map((ball) => ball.matchId)).size

  // -----------------------------------------
  // Aggregate stats
  // -----------------------------------------

  let totalRuns = 0
  let totalBallsFaced = 0
  let totalFours = 0
  let totalSixes = 0
  let totalDismissals = 0
  let totalDotBalls = 0

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

    // Dismissals
    if (innings.dismissed) {
      totalDismissals++
    }

    // -----------------------------------------
    // Best score
    //
    // Prefer a strictly higher score. On a TIE in
    // runs, prefer the NOT OUT innings over the OUT
    // one (standard cricket convention: 75* ranks
    // above 75).
    // -----------------------------------------

    const isBetterScore =
      innings.runs > bestScore ||
      (innings.runs === bestScore && !innings.dismissed && !bestScoreNotOut)

    if (isBetterScore) {
      bestScore = innings.runs
      bestScoreNotOut = !innings.dismissed
    }

    // 50
    if (innings.runs >= 50 && innings.runs < 100) {
      fifties++
    }

    // 100
    if (innings.runs >= 100) {
      hundreds++
    }

    // Duck = 0 runs + dismissed
    if (innings.runs === 0 && innings.dismissed) {
      ducks++
    }
  }

  // -----------------------------------------
  // Strike Rate
  // -----------------------------------------

  const strikeRate = totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0

  // -----------------------------------------
  // Batting Average
  //
  // Runs / times dismissed
  // -----------------------------------------

  const average = totalDismissals > 0 ? totalRuns / totalDismissals : totalRuns

  // -----------------------------------------
  // Boundary %
  //
  // How much of player's runs came from
  // fours + sixes
  // -----------------------------------------

  const boundaryRuns = totalFours * 4 + totalSixes * 6

  const boundaryPercentage = totalRuns > 0 ? (boundaryRuns / totalRuns) * 100 : 0

  // -----------------------------------------
  // Runs / Match
  // -----------------------------------------

  const runsPerMatch = matchesPlayed > 0 ? totalRuns / matchesPlayed : 0

  // -----------------------------------------
  // Return
  // -----------------------------------------

  return {
    totalRuns,

    matchesPlayed,

    average: Number(average.toFixed(2)),

    strikeRate: Number(strikeRate.toFixed(2)),

    bestScore: `${bestScore}${bestScoreNotOut ? "*" : ""}`,

    boundaryPercentage: Number(boundaryPercentage.toFixed(2)),

    matches: matchesPlayed,

    fours: totalFours,

    sixes: totalSixes,

    fifties,

    hundreds,

    ducks,

    dotBalls: totalDotBalls,

    runsPerMatch: Number(runsPerMatch.toFixed(2)),
  }
}