export function getPlayerBowlingRankingStats(balls, player) {
  if (!Array.isArray(balls) || typeof player !== "object") {
    return {
      nmae: player?.name,
      team:player?.currentTeam,
      wickets: 0,
      economy: 0,
      strikeRate: 0,
      overs: "0.0",
      avatar: "",
      role: "",
    }
  }

  const playerId = player?._id

  const playerBalls = balls.filter((ball) => ball.bowlerId === playerId)

  let wickets = 0
  let legalBalls = 0
  let runsConceded = 0

  for (const ball of playerBalls) {
    if (ball.isLegalDelivery) {
      legalBalls++
    }

    const isBye = ball.extraType === "bye" || ball.extraType === "legbye"

    if (!isBye) {
      runsConceded += (ball.runs || 0) + (ball.extraRuns || 0)
    }

    if (ball.isWicket) {
      wickets++
    }
  }

  const overs = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`

  const decimalOvers = legalBalls / 6

  const economy = decimalOvers > 0 ? runsConceded / decimalOvers : 0

  const strikeRate = wickets > 0 ? legalBalls / wickets : 0

  return {
    name: player?.name,
    team:player?.currentTeam,
    wickets,
    economy: Number(economy.toFixed(2)),
    strikeRate: Number(strikeRate.toFixed(2)),
    overs,
    avtar: player?.avatar,
    role: player?.role,
  }
}

export function getPlayerBattingRankingStats(balls, player) {
  if (!Array.isArray(balls) || typeof player !== "object") {
    return {
      name: player?.name,
      team:player?.currentTeam,
      runs: 0,
      average: 0,
      strikeRate: 0,
      fours: 0,
      avatar: "",
      role: "",
    }
  }

  const playerId = player?._id

  const playerBalls = balls.filter((ball) => ball.strikerId === playerId)

  let runs = 0
  let ballsFaced = 0
  let fours = 0
  let dismissals = 0

  for (const ball of playerBalls) {
    const faced = ball.isLegalDelivery && ball.extraType !== "bye" && ball.extraType !== "legbye"

    if (faced) ballsFaced++

    runs += ball.runs || 0

    if (ball.runs === 4) fours++

    if (ball.isWicket) dismissals++
  }

  const average = dismissals > 0 ? runs / dismissals : runs

  const strikeRate = ballsFaced > 0 ? (runs / ballsFaced) * 100 : 0

  return {
    name: player.name,
    team:player?.currentTeam,
    runs,
    average: Number(average.toFixed(2)),
    strikeRate: Number(strikeRate.toFixed(2)),
    fours,
    avtar: player?.avatar,
    role: player?.role,
  }
}

export function getplayesStats(balls, validPlayers, type) {
  if (!Array.isArray(balls) || !Array.isArray(validPlayers) || type == undefined) return

  if (type == "batting") {
    return validPlayers.map((_, idx) => {
      return getPlayerBattingRankingStats(balls, validPlayers[idx])
    })
  }
  if (type === "bowling") {
    return validPlayers.map((_, idx) => {
      return getPlayerBowlingRankingStats(balls, validPlayers[idx])
    })
  }
}
