"use client";

import { Pencil } from "lucide-react";
import { MoreVertical, Plus, CheckCircle2 } from "lucide-react";
import { UserPlus } from "lucide-react";
import { AlertTriangle } from "lucide-react";


import {
  Target,
  Trophy,
  X,
  TrendingUp,
  Users,
  Landmark,
} from "lucide-react";

const ICONS = {
  matches: Target,
  won: Trophy,
  lost: X,
  winRate: TrendingUp,
  squad: Users,
  playingXI: Landmark,
};


const TABS = [
  { key: "all", label: "All Squad" },
  { key: "batsman", label: "Batsmen" },
  { key: "bowler", label: "Bowlers" },
  { key: "allrounder", label: "All-rounders" },
];


 function TeamHeader({ team, onEdit }) {
  return (
    <section className="relative group" id="team-header">
      <div className="bg-surface-container-lowest rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0px_4px_24px_rgba(25,28,30,0.04)] overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 z-10 w-full md:w-auto">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-primary-container flex items-center justify-center border-4 border-surface shadow-xl">
              <img
                className="w-full h-full object-cover"
                alt={team.name}
                src={team.logo}
              />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-black text-on-surface tracking-tighter">
              {team.name}
            </h2>
            <p className="text-on-secondary-container font-medium">
              {team.handle}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {team.division}
              </span>
              <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
                {team.established}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-all active:scale-95 shadow-md"
          >
            <Pencil className="w-[18px] h-[18px]" />
            Edit Team
          </button>
        </div>

        {/* Decorative Element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}





 function StatisticsGrid({ stats }) {
  return (
    <section id="statistics">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = ICONS[stat.key] || Target;
          const isLost = stat.key === "lost";
          const isWinRate = stat.key === "winRate";

          return (
            <div
              key={stat.key}
              className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group border border-outline-variant/5"
            >
              <div
                className={
                  isWinRate
                    ? "w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center"
                    : isLost
                    ? "w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-error group-hover:bg-error-container transition-colors"
                    : "w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-fixed transition-colors"
                }
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-on-surface tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[9px] font-bold text-on-secondary-container uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}



 function SquadManagement({
  players,
  activeTab,
  onTabChange,
  onToggleSelect,
  onNewPlayer,
  onMore,
}) {
  const filteredPlayers =
    activeTab === "all"
      ? players
      : players.filter((p) => p.category === activeTab);

  return (
    <section className="space-y-8" id="squad-management">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-on-surface tracking-tight">
            Squad Selection
          </h3>
          <p className="text-on-secondary-container text-sm">
            Select players to build your active playing XI for the next
            match.
          </p>
        </div>
        <button
          onClick={onNewPlayer}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-container text-on-primary-fixed font-bold rounded-xl hover:bg-primary transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          New Player
        </button>
      </div>

      {/* Tabs */}
      <div className="relative border-b border-surface-container-highest">
        <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={
                  isActive
                    ? "relative py-4 text-primary font-bold transition-colors whitespace-nowrap"
                    : "relative py-4 text-on-secondary-container font-medium hover:text-primary transition-colors whitespace-nowrap"
                }
              >
                {tab.label}
                {isActive && (
                  <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onToggleSelect={onToggleSelect}
            onMore={onMore}
          />
        ))}
      </div>
    </section>
  );
}



 function PlayerCard({ player, onToggleSelect, onMore }) {
  const { name, role, number, image, selected } = player;

  return (
    <div
      className={
        selected
          ? "bg-surface-container-lowest rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-primary/20 flex flex-col gap-6 relative overflow-hidden group"
          : "bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 flex flex-col gap-6 relative overflow-hidden group"
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div
            className={
              selected
                ? "w-20 h-20 rounded-2xl overflow-hidden bg-surface-container border-2 border-primary-fixed shadow-inner"
                : "w-20 h-20 rounded-2xl overflow-hidden bg-surface-container border-2 border-outline-variant/20 shadow-inner"
            }
          >
            <img className="w-full h-full object-cover" alt={name} src={image} />
          </div>
          <div>
            <h4 className="font-bold text-xl text-on-surface">{name}</h4>
            <p className="text-sm text-on-secondary-container font-medium">
              {role}
            </p>
            <div className="mt-1">
              <span className="text-primary font-black text-2xl tracking-tighter">
                #{number}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onMore?.(player)}
          className="p-2 hover:bg-surface-container text-on-secondary-container rounded-full transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => onToggleSelect(player.id)}
        className={
          selected
            ? "w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-primary text-on-primary shadow-lg active:scale-[0.98]"
            : "w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary active:scale-[0.98]"
        }
      >
        {selected ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        <span>{selected ? "Added to Team" : "Add to Team"}</span>
      </button>

      {selected && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full pointer-events-none" />
      )}
    </div>
  );
}



 function StickyActionBar({ selectedCount, total = 11, onConfirm }) {
  return (
    <div className="sticky bottom-8 z-40 max-w-xl mx-auto">
      <div className="bg-inverse-surface text-inverse-on-surface rounded-full p-4 pl-8 pr-4 shadow-2xl flex items-center justify-between backdrop-blur-md bg-opacity-95">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
            Playing XI Status
          </span>
          <span className="text-sm font-medium">
            {selectedCount} / {total} Players Selected
          </span>
        </div>
        <button
          onClick={onConfirm}
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-black tracking-tight hover:bg-primary-container transition-all active:scale-95 shadow-lg"
        >
          CONFIRM SQUAD
        </button>
      </div>
    </div>
  );
}


 function RemovalModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center text-error mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-on-surface tracking-tight">
            Remove Player?
          </h3>
          <p className="text-on-secondary-container text-sm">
            Are you sure you want to remove this player from the squad? This
            action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-error text-on-error font-bold rounded-xl active:scale-95 transition-transform shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}


export {RemovalModal, StickyActionBar, SquadManagement, StatisticsGrid, TeamHeader} 