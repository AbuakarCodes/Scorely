"use client";

import { useState, useMemo } from "react";
// import TeamHeader from "./components/componsnts";
// import StatisticsGrid from "./components/componsnts";
// import SquadManagement from "./components/componsnts";
// import StickyActionBar from "./components/componsnts";
// import RemovalModal from "./components/componsnts";

import {RemovalModal, StickyActionBar, SquadManagement, StatisticsGrid, TeamHeader}  from "./components/componsnts"; 
    import { fromTheme } from "tailwind-merge";


const TEAM = {
  name: "The Pavilion",
  handle: "@thepavilion_cricket",
  division: "Division I",
  established: "EST. 2018",
  logo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB1bIvGG3MMyOC1BgmRVE4aNHUBOeEux2RyCxPTp4_ZbH-_asSKdHi7NfAklAbHGcf9rzzo4VStxav49q7uQTGVfaZfkYO3OPGtkAMHyi2gk9AsMUDpPzMLYjpaWIc6GxpjXeJZnWj-TIm0kUAYVH3FouE3KRJiquL7zaSSZF9oechRwOSuWDw6PKoDCKdNqd1SFCaIPxlwCJm2lCHv2TrHME7HZssNcsjL8uff21g6rnnNViEDc1upuRXQEM3Ytuvu2EXyDdQJcas",
};

const INITIAL_STATS = [
  { key: "matches", label: "Matches", value: 24 },
  { key: "won", label: "Won", value: 18 },
  { key: "lost", label: "Lost", value: 6 },
  { key: "winRate", label: "Win Rate", value: "75%" },
  { key: "squad", label: "Squad", value: 18 },
  { key: "playingXI", label: "Playing XI", value: 11 },
];

const INITIAL_PLAYERS = [
  {
    id: 1,
    name: "Virat Kohli",
    role: "Top-order Batsman",
    number: 18,
    category: "batsman",
    selected: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSIiGlhfhy6TvKLl5de7ArR4E0GkZuT_1-xjXiINrXd9E66BBRiSwu_wVU5vJYPvCovxkyuuNchc3hXocRZ-HAarLPexIR1WX-sxO-HmFtJMKN9y1YdebT_8pCNy5NUsTpGfsMTrMQivVj3YM3UecO_bQIRUMQZdgMFVpMvSmdHlkkIKeP9jWgLJX41gK35fIeiWDl9ZB_Gmu-xcLGM-8APImqKpP0tuE_UuYsmuNbSD-YyVYZYtq3D1q-PmFE9grUWi2MpfrhCz0",
  },
  {
    id: 2,
    name: "Hardik Pandya",
    role: "All-rounder",
    number: 33,
    category: "allrounder",
    selected: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrwbbtGPxH10FSAmFHSALIy8yj-lv7dPd61W0Qq6hr4nsV_-y5Z4ulZdzz2IHJ6PKeNZmeb6oilkUQKJIai_MQAdMyIqsA1zdpztVDeQJmg4KZ7MvZcGejdS8-sHVNL4mcLQkB1S2T7mkRjP7MXAUxoNjNVoMEh3u_5PmuBvAOu1bY6O65YvVzzt1ZPokQVMlQ_C-BdgjjSWEqdc8obULkdw5jOPBNUEX3qlYQz27pyyq5zVe3CHANhBm9zwea0EoFQGs8eqTS64M",
  },
  {
    id: 3,
    name: "Jasprit Bumrah",
    role: "Fast Bowler",
    number: 93,
    category: "bowler",
    selected: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_R2bq5RFWGxFBeM9FYgXipxJF6ClOsP9uv-q-pX7nO2H6fFglnrphDLitn1TflIOax6iSt7aFMe8Oz4aoEtLYaPy6AIOTP_XSw7Djl2cmDTU3vSAj_Bl9_SwhT-klVBu1WOJLpJZtzMY4-ELiUEhHvS15enNVYGbwNQAMEok0B04soTMBqt200alx8UYQojXA0GzH_C8J9BZT4RES7anua0H0IVgNWgveQ-aEiPVExmg4QsyDrEmFtPMuatH0y_uQHI4z-1OzzN8",
  },
];

export default function TeamPage() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [activeTab, setActiveTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [playerPendingRemoval, setPlayerPendingRemoval] = useState(null);

  const selectedCount = useMemo(
    () => players.filter((p) => p.selected).length,
    [players]
  );

  const toggleSelection = (id) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleMore = (player) => {
    setPlayerPendingRemoval(player);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPlayerPendingRemoval(null);
  };

  const confirmRemoval = () => {
    if (playerPendingRemoval) {
      setPlayers((prev) =>
        prev.filter((p) => p.id !== playerPendingRemoval.id)
      );
    }
    closeModal();
  };

  return (
    <main className="min-h-screen py-12 md:py-20 bg-surface font-body text-on-surface">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
        <TeamHeader team={TEAM} onEdit={() => console.log("Edit team")} />

        <StatisticsGrid stats={INITIAL_STATS} />

        <SquadManagement
          players={players}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleSelect={toggleSelection}
          onNewPlayer={() => console.log("New player")}
          onMore={handleMore}
        />

        <StickyActionBar
          selectedCount={selectedCount}
          total={11}
          onConfirm={() => console.log("Confirm squad")}
        />
      </div>

      <RemovalModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmRemoval}
      />
    </main>
  );
}