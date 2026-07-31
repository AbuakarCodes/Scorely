"use client";

import { useMemo, useState } from "react";

const battingData = {
  hero: {
    name: "Virat Kohli",
    team: "India",
    stat: "89.1",
    label: "Rating Points",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7YAUGuyOtR5nMxqmqc0ZSZWAxyBfoyEQQWJl_d3k_IzIRJj5oQRD1-bENCaw8jqZSL9gHP0GRNKrnlWF_bEXEs8AJHTYVcGz6BD9XWvMqlMriVI6qr_Xqn6LC4bQNYT55RzMccJylKFbA67r-Tl096jHpH5SKxNoKSW1nTZ-RVQt6l4QSBfPoRLBDbIqKxSrhPmZjLnpR8CLTYOrhd0doi_8iqQDdQ_RbZLPbR56ru3wmNvPNdltu",
  },
  players: [
    {
      name: "Virat Kohli",
      team: "India",
      runs: 1420,
      average: 61.4,
      strikeRate: 92.8,
      fours: 132,
      sixes: 18,
      trend: "up",
      trendValue: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7YAUGuyOtR5nMxqmqc0ZSZWAxyBfoyEQQWJl_d3k_IzIRJj5oQRD1-bENCaw8jqZSL9gHP0GRNKrnlWF_bEXEs8AJHTYVcGz6BD9XWvMqlMriVI6qr_Xqn6LC4bQNYT55RzMccJylKFbA67r-Tl096jHpH5SKxNoKSW1nTZ-RVQt6l4QSBfPoRLBDbIqKxSrhPmZjLnpR8CLTYOrhd0doi_8iqQDdQ_RbZLPbR56ru3wmNvPNdltu",
    },
    {
      name: "Babar Azam",
      team: "Pakistan",
      runs: 1085,
      average: 52.14,
      strikeRate: 89.2,
      fours: 98,
      sixes: 12,
      trend: "neutral",
      trendValue: "-",
    },
    {
      name: "Joe Root",
      team: "England",
      runs: 954,
      average: 48.2,
      strikeRate: 78.5,
      fours: 84,
      sixes: 8,
      trend: "up",
      trendValue: 2,
    },
    {
      name: "Kane Williamson",
      team: "New Zealand",
      runs: 1245,
      average: 58.42,
      strikeRate: 88.4,
      fours: 112,
      sixes: 14,
      trend: "down",
      trendValue: 1,
    },
    {
      name: "David Warner",
      team: "Australia",
      runs: 982,
      average: 45.1,
      strikeRate: 142.9,
      fours: 98,
      sixes: 42,
      trend: "up",
      trendValue: 3,
    },
  ],
};

const bowlingData = {
  hero: {
    name: "Shaheen Afridi",
    team: "Pakistan",
    stat: "91.2",
    label: "Rating Points",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJiuM1sAwrByZazx0N18Ez78hG-dO_bwe-nwCWBPwFX54r58kF9kPlTu0kckewSyqHR4sGh7n0Y4h8N9Bnj2wU3QDPVSgiAytU8o6egOFNnxUAcK2JkAS-7hXmfmDHF0IJSJtKjaU6jkhPQ3EnOXJ6wkNVkkzYIkL7n1JzbrdJKQYGHozC50q91f7bBw3LrrStLsxZPinujg0to7V3YiKEsliXA5k-tU5tebshg_R-bKejC9IaXPZF",
  },
  players: [
    {
      name: "Shaheen Afridi",
      team: "Pakistan",
      wickets: 51,
      economy: 3.18,
      average: 17.2,
      strikeRate: 32.4,
      overs: 164,
      trend: "up",
      trendValue: 1,
    },
    {
      name: "Jasprit Bumrah",
      team: "India",
      wickets: 45,
      economy: 3.42,
      average: 18.1,
      strikeRate: 22.5,
      overs: 142,
      trend: "up",
      trendValue: 1,
    },
    {
      name: "Rashid Khan",
      team: "Afghanistan",
      wickets: 43,
      economy: 4.12,
      average: 19.4,
      strikeRate: 24.2,
      overs: 158,
      trend: "down",
      trendValue: 1,
    },
    {
      name: "Mitchell Starc",
      team: "Australia",
      wickets: 42,
      economy: 4.82,
      average: 22.4,
      strikeRate: 28.1,
      overs: 154,
      trend: "up",
      trendValue: 2,
    },
    {
      name: "Trent Boult",
      team: "New Zealand",
      wickets: 38,
      economy: 4.55,
      average: 24.1,
      strikeRate: 31.4,
      overs: 182,
      trend: "down",
      trendValue: 1,
    },
  ],
};

const battingFilters = [
  { value: "average", label: "Batting Average" },
  { value: "strikeRate", label: "Strike Rate" },
  { value: "runs", label: "Total Runs" },
  { value: "fours", label: "Most 4s" },
  { value: "sixes", label: "Most 6s" },
];

const bowlingFilters = [
  { value: "wickets", label: "Most Wickets" },
  { value: "economy", label: "Best Economy" },
  { value: "average", label: "Bowling Average" },
  { value: "strikeRate", label: "Bowling Strike Rate" },
  { value: "overs", label: "Most Overs" },
];

export function usePlayerRankings() {
  const [mode, setMode] = useState("batting");
  const [rankBy, setRankBy] = useState("average");

  const data = mode === "batting" ? battingData : bowlingData;

  const filters = mode === "batting" ? battingFilters : bowlingFilters;

  const players = useMemo(() => {
    const sorted = [...data.players].sort((a, b) => {
      if (rankBy === "economy" || rankBy === "average") {
        return a[rankBy] - b[rankBy];
      }

      return b[rankBy] - a[rankBy];
    });

    return sorted.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  }, [data.players, rankBy]);

  const headers =
    mode === "batting"
      ? ["Runs", "Avg", "SR", "4s", "6s"]
      : ["Wickets", "Econ", "Avg", "SR", "Overs"];

  const getStats = (player) => {
    if (mode === "batting") {
      return [
        player.runs,
        player.average.toFixed(2),
        player.strikeRate.toFixed(1),
        player.fours,
        player.sixes,
      ];
    }

    return [
      player.wickets,
      player.economy.toFixed(2),
      player.average.toFixed(1),
      player.strikeRate.toFixed(1),
      player.overs,
    ];
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setRankBy(newMode === "batting" ? "average" : "wickets");
  };

  const resetFilters = () => {
    setMode("batting");
    setRankBy("average");
  };

  return {
    mode,
    rankBy,
    filters,
    headers,
    players,
    hero: data.hero,
    getStats,
    setRankBy,
    handleModeChange,
    resetFilters,
  };
}