"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [defaultOvers, setDefaultOvers] = useState(20);
  const [winFactor, setWinFactor] = useState(true);
  const [strikeRate, setStrikeRate] = useState(65);
  const [economyRate, setEconomyRate] = useState(40);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" className="w-10 h-10 p-0 rounded-full">
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </Button>
          <h1 className="text-lg font-bold tracking-tight">Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* App Preferences */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3 px-1">
            App Preferences
          </h2>
          <Card className="bg-white dark:bg-slate-900 border border-primary/5">
            <CardContent>
              {/* Appearance */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    dark_mode
                  </span>
                  <div>
                    <p className="font-medium">Appearance</p>
                    <p className="text-xs text-slate-500">System Default</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  Switch
                </Button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    translate
                  </span>
                  <p className="font-medium">Language</p>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-sm">English</span>
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    notifications
                  </span>
                  <p className="font-medium">Push Notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  className="peer-checked:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Match Defaults */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3 px-1">
            Match Defaults
          </h2>
          <Card className="bg-white dark:bg-slate-900 border border-primary/5 space-y-4">
            <CardContent>
              {/* Default Overs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    sports_cricket
                  </span>
                  <p className="font-medium">Default Overs</p>
                </div>
                <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-1">
                  <Button
                    className="w-8 h-8 p-0 rounded-md bg-white dark:bg-slate-800 text-primary shadow-sm"
                    onClick={() =>
                      setDefaultOvers((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    -
                  </Button>
                  <span className="font-bold w-6 text-center">{defaultOvers}</span>
                  <Button
                    className="w-8 h-8 p-0 rounded-md bg-primary text-white shadow-sm"
                    onClick={() => setDefaultOvers((prev) => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Match Format */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    groups
                  </span>
                  <p className="font-medium">Match Format</p>
                </div>
                <select className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-400 border-none focus:ring-0">
                  <option>T20</option>
                  <option>ODI</option>
                  <option>Test</option>
                  <option>The Hundred</option>
                </select>
              </div>

              {/* Wickets */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    reorder
                  </span>
                  <p className="font-medium">Wickets per Side</p>
                </div>
                <span className="text-slate-500 font-medium">10</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ranking Engine */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/70">
              Ranking Engine
            </h2>
            <span className="material-symbols-outlined text-primary/40 text-sm">
              info
            </span>
          </div>
          <Card className="bg-white dark:bg-slate-900 border border-primary/5 p-4 space-y-6">
            <CardContent>
              {/* Strike Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Strike Rate Weighting</p>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {strikeRate}%
                  </span>
                </div>
                <input
                  type="range"
                  value={strikeRate}
                  onChange={(e) => setStrikeRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  Affects how batting speed influences overall player ranking.
                </p>
              </div>

              {/* Economy Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Economy Rate Weighting</p>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {economyRate}%
                  </span>
                </div>
                <input
                  type="range"
                  value={economyRate}
                  onChange={(e) => setEconomyRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Win Contribution */}
              <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                <p className="text-sm font-medium">Win Contribution Factor</p>
                <Switch
                  checked={winFactor}
                  onCheckedChange={setWinFactor}
                  className="peer-checked:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}