# Match State Management

This document explains how the **Match** component works, how a single ball is processed, how Redux updates the match state, and how the state is persisted in Local Storage.

---

# Overview

The match is completely driven by the Redux store.

Every delivery goes through the following lifecycle:

```
User clicks ball
      │
      ▼
addBall()
      │
      ▼
Dispatch multiple reducers
      │
      ▼
Redux updates state
      │
      ▼
React re-renders UI
      │
      ▼
Middleware persists state in Local Storage
```

The UI itself never performs calculations. It only dispatches actions and renders the latest Redux state.

---

# Match Component Flow

The Match component has three responsibilities:

1. Record a ball
2. Show player selection popups whenever required
3. Show match result popup once the game finishes

---

# Player Selection Popup

The component continuously watches whether a new batsman or bowler is required.

```jsx
useLayoutEffect(() => {
    if (
        pendingNewBowler ||
        pendingNewBatsman?.nonStriker ||
        pendingNewBatsman?.striker
    ) {
        setshowPopup(prev => ({
            ...prev,
            playerSelection: true
        }));
    } else {
        setshowPopup(prev => ({
            ...prev,
            playerSelection: false
        }));
    }
}, [pendingNewBowler, pendingNewBatsman]);
```

## When it opens

The popup appears whenever:

- Match starts (first two batsmen + first bowler)
- A wicket falls
- An over finishes
- Innings changes

The reducer updates these flags:

```
pendingNewBatsman
pendingNewBowler
```

The UI simply reacts to those flags.

---

# Match Result Popup

Another effect watches the match winner.

```jsx
useEffect(() => {
    if (matchWinner.id) {
        setshowPopup(prev => ({
            ...prev,
            matchDecision: true
        }));
    }
}, [matchWinner]);
```

Once the reducer determines a winner, the popup automatically opens.

---

# Ball Processing

Every delivery is handled through one function:

```jsx
addBall()
```

This function creates a complete `ballObject`.

Example:

```js
{
    matchId,
    battingTeam,
    bowlingTeam,

    inningsNumber,

    over,
    ballInOver,

    isLegalDelivery,

    strikerId,
    nonStrikerId,
    bowlerId,

    isWicket,

    runs,
    extraRuns,
    extraType
}
```

---

# Ball Object Fields

| Field | Description |
|--------|-------------|
| matchId | Current match id |
| battingTeam | Batting team id |
| bowlingTeam | Bowling team id |
| inningsNumber | 1 or 2 |
| over | Current over |
| ballInOver | Ball index (0-5) |
| isLegalDelivery | False for wides and no-balls |
| strikerId | Current striker |
| nonStrikerId | Current non-striker |
| bowlerId | Current bowler |
| isWicket | Whether wicket fell |
| runs | Runs credited to batsman |
| extraRuns | Runs credited as extras |
| extraType | wide / noBall / bye / legBye |

---

# Dispatch Order

After creating the ball object, reducers execute in a fixed order.

```
deliverBall()

↓

update_TotalRuns()

↓

update_TotalWickets()

↓

update_overAndBallInOver()

↓

update_CRRandRRR()

↓

Update_Strike()

↓

update_pendingPlayersFlag()

↓

update_isDissmissedFlag()

↓

Update_innings()

↓

handelLastPlayer_isLastPlayerTrue()

↓

match_Decision()
```

Each reducer depends on the updated state from the previous reducer.

Redux executes reducers synchronously, so every reducer always receives the latest state.

---

# Reducer Responsibilities

## 1. deliverBall()

Stores the delivery.

```
innings.balls.push(ballObject)
```

---

## 2. update_TotalRuns()

Calculates total score from every ball in the current innings.

Includes:

- batsman runs
- extras

Updates

```
innings.score.runs
```

---

## 3. update_TotalWickets()

Counts wickets in the current innings.

Updates

```
innings.score.wickets
```

---

## 4. update_overAndBallInOver()

Maintains

```
over
ballsInOver
```

Handles

- legal deliveries
- over completion

Illegal deliveries do not increase the ball count.

---

## 5. update_CRRandRRR()

Calculates

Current Run Rate

```
CRR
```

Required Run Rate

```
RRR
```

RRR only exists during the second innings.

---

## 6. Update_Strike()

Determines whether strike changes.

Rules:

- odd runs → swap strike
- end of over → swap strike
- last batter standing → no swap

---

## 7. update_pendingPlayersFlag()

Determines whether UI should ask for:

- new batsman
- new bowler

Updates

```
pendingNewBatsman
pendingNewBowler
```

---

## 8. update_isDissmissedFlag()

Marks the dismissed player.

```
player.isDismissed = true
```

---

## 9. Update_innings()

Checks whether first innings has finished.

Possible reasons:

- overs completed
- all wickets lost

When innings ends:

- switches innings
- creates target
- resets scoreboard
- requests new batsmen
- requests new bowler

---

## 10. handelLastPlayer_isLastPlayerTrue()

Handles the special case where only one batter remains.

Ensures the remaining batter occupies the striker position correctly.

---

## 11. match_Decision()

Determines whether the match has ended.

Possible outcomes:

- Batting team wins
- Bowling team wins
- Tie

Updates

```
match.matchWinner
```

The Match component then automatically opens the result popup.

---

# Popup Flow

```
Reducer

↓

pendingNewBowler

OR

pendingNewBatsman

↓

useLayoutEffect()

↓

PlayerSelectionModal
```

---

```
Reducer

↓

matchWinner

↓

useEffect()

↓

MatchDecisionPopup
```

---

# Local Storage Persistence

The match state is automatically saved after every successful Redux action.

Middleware:

```js
persistMatchMiddleware
```

Flow:

```
Redux Action

↓

Reducer updates state

↓

Middleware executes

↓

State saved to Local Storage
```

---

# Middleware Logic

The middleware ignores:

- pending async actions
- rejected async actions
- matches that haven't started

If the action is

```
resetMatch
```

the stored match is removed completely.

Otherwise,

```
localStorage.setItem(
    "match",
    JSON.stringify(state.match)
)
```

is executed after every successful action.

---

# Match Recovery

On application startup the slice initializes using:

```js
loadMatchState()
```

Flow:

```
Application Starts

↓

loadMatchState()

↓

Read Local Storage

↓

Restore Redux State

↓

Continue Match
```

If no saved match exists, the default state is used.

---

# Complete Match Flow

```
User clicks ball
        │
        ▼
Create ballObject
        │
        ▼
deliverBall
        │
        ▼
Update Score
        │
        ▼
Update Wickets
        │
        ▼
Update Overs
        │
        ▼
Update CRR/RRR
        │
        ▼
Update Strike
        │
        ▼
Need New Player?
        │
        ▼
Player Selection Popup
        │
        ▼
Check Innings End
        │
        ▼
Switch Innings (if needed)
        │
        ▼
Check Match Result
        │
        ▼
Winner Declared
        │
        ▼
Match Result Popup
        │
        ▼
Persist State to Local Storage
```

---

# Design Principles

- The Match component contains almost no business logic.
- Every cricket rule is handled inside Redux reducers.
- Reducers execute synchronously, allowing later reducers to rely on state changes made by earlier reducers.
- The UI is a pure reflection of Redux state.
- Local Storage persistence is handled entirely by middleware, keeping reducers focused on state transitions.
- A saved match can be restored seamlessly after a page refresh using the persisted Redux state.