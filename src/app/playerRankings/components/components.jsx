"use client";

import {
  ArrowDown,
  ArrowUp,
  Minus,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePlayerRankings } from "../hooks/hooks"; 
function PageHeader() {
  return (
    <div className="mb-12">
      <h1 className="mt-2 text-5xl font-bold tracking-tight text-on-surface">
        Player Rankings
      </h1>
      <p className="mt-3 text-sm text-on-surface-variant">
        Compare the best performers across batting and bowling.
      </p>
    </div>
  );
}

function ModeSwitcher({ mode, onChange }) {
  return (
    <div className="flex w-fit gap-1 rounded-full bg-surface-container-low p-1.5">
      <Button
        onClick={() => onChange("batting")}
        variant="ghost"
        className={`rounded-full px-8 py-2.5 text-sm font-medium ${
          mode === "batting"
            ? "bg-primary text-on-primary shadow-sm hover:bg-primary"
            : "text-on-surface-variant hover:bg-transparent hover:text-on-surface"
        }`}
      >
        Batting
      </Button>

      <Button
        onClick={() => onChange("bowling")}
        variant="ghost"
        className={`rounded-full px-8 py-2.5 text-sm font-medium ${
          mode === "bowling"
            ? "bg-primary text-on-primary shadow-sm hover:bg-primary"
            : "text-on-surface-variant hover:bg-transparent hover:text-on-surface"
        }`}
      >
        Bowling
      </Button>
    </div>
  );
}

function FilterBar({
  filters,
  rankBy,
  setRankBy,
  mode,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl bg-surface-container-low p-6 md:grid-cols-5">
      <div className="space-y-2">
        <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Rank By
        </label>

        <Select value={rankBy} onValueChange={setRankBy}>
          <SelectTrigger className="h-12 rounded-xl border-none bg-surface-container-lowest px-4 text-sm shadow-none focus:ring-2 focus:ring-primary/20">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-lowest px-4 text-sm text-on-surface-variant">
          <Shield className="h-4 w-4" />
          <span className="capitalize">{mode} rankings</span>
        </div>
      </div>
    </div>
  );
}

function HeroPlayer({ hero, mode }) {
  return (
    <div className="mb-16">
      <div className="group relative overflow-hidden rounded-[2rem] border border-on-primary/5 bg-primary p-8 shadow-xl transition-all duration-500 hover:shadow-2xl md:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg
            className="h-full w-full fill-current text-on-primary"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M0 100 L50 20 L100 100 Z" />
          </svg>
        </div>

        <div className="absolute right-0 top-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
          <span className="select-none text-[16rem] font-black italic leading-none text-on-primary">
            1
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:gap-16">
          <div className="relative shrink-0">
            <div className="h-48 w-48 overflow-hidden rounded-full border-8 border-on-primary/10 bg-primary-container shadow-2xl transition-transform duration-500 group-hover:scale-105 md:h-64 md:w-64">
              {hero.image ? (
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Shield className="h-20 w-20 text-on-primary/50" />
                </div>
              )}
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-fixed px-6 py-2 text-sm font-bold uppercase tracking-widest text-on-primary-fixed-variant shadow-xl">
              World Number One
            </div>
          </div>

          <div className="flex flex-col items-center text-center text-on-primary md:items-start md:text-left">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-fixed" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-on-primary/60">
                Current Leader
              </span>
            </div>

            <h2 className="text-5xl font-black tracking-tight md:text-7xl">
              {hero.name}
            </h2>

            <p className="mb-8 mt-2 text-xl font-medium text-on-primary-container md:text-2xl">
              {hero.team}
            </p>

            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter md:text-6xl">
                  {hero.stat}
                </span>

                <span className="mt-1 text-xs font-bold uppercase tracking-widest text-on-primary/50">
                  {hero.label}
                </span>
              </div>

              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center gap-2 text-primary-fixed">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-bold">+2.4</span>
                </div>

                <span className="mt-1 text-xs font-bold uppercase tracking-widest text-on-primary/50">
                  Growth
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Trend({ type, value }) {
  if (type === "up") {
    return (
      <span className="flex items-center justify-end gap-1 text-xs font-bold text-primary">
        <ArrowUp className="h-4 w-4" />
        {value}
      </span>
    );
  }

  if (type === "down") {
    return (
      <span className="flex items-center justify-end gap-1 text-xs font-bold text-error">
        <ArrowDown className="h-4 w-4" />
        {value}
      </span>
    );
  }

  return (
    <span className="flex items-center justify-end gap-1 text-xs font-bold text-on-surface-variant">
      <Minus className="h-4 w-4" />
      {value}
    </span>
  );
}

function PlayerTable({
  players,
  headers,
  getStats,
  mode,
}) {
  if (!players.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-surface-container-high/50 bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Rank
              </th>

              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Player
              </th>

              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Team
              </th>

              {headers.map((header, index) => (
                <th
                  key={header}
                  className="px-6 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  {header}
                </th>
              ))}

              <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Trend
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container-high/50">
            {players.map((player) => {
              const stats = getStats(player);

              return (
                <tr
                  key={player.name}
                  className="group transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-8 py-6">
                    <span className="text-xl font-black text-on-surface-variant transition-colors group-hover:text-primary">
                      {String(player.rank).padStart(2, "0")}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                        {player.image ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Shield className="h-5 w-5 text-on-surface-variant" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-bold leading-none text-on-surface">
                          {player.name}
                        </p>

                        <p className="mt-1 text-xs text-on-surface-variant">
                          {mode === "batting" ? "Batsman" : "Bowler"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-sm font-medium text-on-surface">
                    {player.team}
                  </td>

                  {stats.map((stat, index) => (
                    <td
                      key={`${player.name}-${index}`}
                      className={`px-6 py-6 text-center text-sm font-bold text-on-surface ${
                        index === 1 ? "bg-primary-container/5" : ""
                      }`}
                    >
                      {stat}
                    </td>
                  ))}

                  <td className="px-8 py-6 text-right">
                    <Trend
                      type={player.trend}
                      value={player.trendValue}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-surface-container-lowest py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low">
        <Search className="h-10 w-10 text-on-surface-variant" />
      </div>

      <h3 className="text-2xl font-bold text-on-surface">
        No players found
      </h3>

      <p className="mt-2 max-w-sm text-on-surface-variant">
        We couldn't find any players matching your current filters.
      </p>

      {onReset && (
        <Button
          onClick={onReset}
          className="mt-8 rounded-xl bg-primary px-6 py-3 text-on-primary hover:bg-primary/90"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export default function PlayerRankings() {
  const {
    mode,
    rankBy,
    filters,
    headers,
    players,
    hero,
    getStats,
    setRankBy,
    handleModeChange,
    resetFilters,
  } = usePlayerRankings();

  return (
    <main className="min-h-screen bg-surface px-6 pb-12 pt-12 text-on-surface md:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <PageHeader />

        <section className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <ModeSwitcher
              mode={mode}
              onChange={handleModeChange}
            />
          </div>

          <FilterBar
            mode={mode}
            filters={filters}
            rankBy={rankBy}
            setRankBy={setRankBy}
          />
        </section>

        <HeroPlayer
          hero={hero}
          mode={mode}
        />

        <PlayerTable
          players={players}
          headers={headers}
          getStats={getStats}
          mode={mode}
        />
      </div>
    </main>
  );
}