export function getBowlingRankings(balls, players) {
  const stats = {}

  players.forEach((player) => {
    stats[String(player._id)] = {
      playerId: player._id,
      name: player.name,
      role: player.role,
      country: player.country,
      wickets: 0,
      runsConceded: 0,
      balls: 0,
      overs: 0,
      economy: 0,
      average: 0,
      strikeRate: 0,
    }
  })

  balls.forEach((ball) => {
    const playerId = String(ball.bowlerId)
    const player = stats[playerId]

    if (!player) return

    const runs = Number(ball.runs || 0)
    const extraRuns = Number(ball.extraRuns || 0)

    if (ball.isLegalDelivery) {
      player.balls += 1
    }

    if (
      ball.extraType !== "Bye" &&
      ball.extraType !== "Legbye"
    ) {
      player.runsConceded += runs + extraRuns
    }

    if (
      ball.isWicket &&
      ball.extraType !== "Run Out" &&
      ball.extraType !== "Retired Hurt"
    ) {
      player.wickets += 1
    }
  })

  Object.values(stats).forEach((player) => {
    player.overs = Number(
      `${Math.floor(player.balls / 6)}.${player.balls % 6}`
    )

    player.economy = player.balls
      ? Number(
          ((player.runsConceded / player.balls) * 6).toFixed(2)
        )
      : 0

    player.average = player.wickets
      ? Number(
          (player.runsConceded / player.wickets).toFixed(2)
        )
      : 0

    player.strikeRate = player.wickets
      ? Number(
          (player.balls / player.wickets).toFixed(2)
        )
      : 0
  })

  return Object.values(stats)
}

export function getBattingRankings(balls, players) {
  const stats = {}

  players.forEach((player) => {
    stats[String(player._id)] = {
      playerId: player._id,
      name: player.name,
      role: player.role,
      country: player.country,
      runs: 0,
      balls: 0,
      average: 0,
      strikeRate: 0,
      best: 0,
      fours: 0,
      sixes: 0,
      dismissals: 0,
    }
  })

  balls.forEach((ball) => {
    const playerId = String(ball.strikerId)
    const player = stats[playerId]

    if (!player) return

    const runs = Number(ball.runs || 0)
    const extraRuns = Number(ball.extraRuns || 0)

    if (ball.extraType !== "Wide") {
      player.runs += runs
    }

    if (ball.isLegalDelivery) {
      player.balls += 1
    }

    if (runs === 4) {
      player.fours += 1
    }

    if (runs === 6) {
      player.sixes += 1
    }

    if (ball.isWicket) {
      player.dismissals += 1
    }
  })

  Object.values(stats).forEach((player) => {
    player.average = player.dismissals
      ? Number((player.runs / player.dismissals).toFixed(2))
      : player.runs

    player.strikeRate = player.balls
      ? Number(((player.runs / player.balls) * 100).toFixed(2))
      : 0

    player.best = Math.max(
      player.best,
      ...balls
        .filter(
          (ball) =>
            String(ball.strikerId) === String(player.playerId)
        )
        .map((ball) => Number(ball.runs || 0))
    )
  })

  return Object.values(stats)
}