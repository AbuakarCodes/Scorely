"use client";

import { useEffect } from "react";
import {
  ArrowLeft, Moon, CircleDot, AlignJustify,
  Users, ChevronRight, KeyRound, UserRound, UserX,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSelector, useDispatch } from 'react-redux'
import {  changeTotaltOvers,  toggleLastPlayerPlayed } from "../../utils/reduxSclices/settingsSclice"

export default function SettingsPage() {
  const dispatch = useDispatch()
  const { darkMode, TotalOvers,  lastPlayerPlayed } = useSelector(state => state?.settings||{})

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode)
  }, [darkMode])
  

  return (
    <div className="bg-background text-foreground min-h-screen pb-12">

      {/* Header */} 
                
      <header className="sticky top-0 z-50  bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* App Preferences */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary/60 mb-3 px-1">App Preferences</h2>
          <div className="bg-card rounded-xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="font-medium text-sm leading-tight">Dark Mode</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle dark interface</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={() => {}} />
            </div>
          </div>
        </section>

        {/* Match Defaults */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary/60 mb-3 px-1">Match Defaults</h2>
          <div className="bg-card rounded-xl shadow-sm border border-primary/5 overflow-hidden">

            {/* Default Overs */}
            <div className="flex items-center justify-between p-4 border-b border-primary/5">
              <div className="flex items-center gap-3">
                <CircleDot className="w-5 h-5 text-primary shrink-0" strokeWidth={1.8} />
                <p className="font-medium text-sm">Default Overs</p>
              </div>
              <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg p-1">
                <button
                  onClick={() => dispatch(changeTotaltOvers(TotalOvers-1))}
                  // disabled={TotalOvers <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-sm text-primary font-bold text-base hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >−</button>
                <input
                  type="number"
                  value={TotalOvers}
                  onChange={(e) => { const p = parseInt(e.target.value, 10); if (!isNaN(p)) dispatch(changeTotaltOvers(p)); }}
                  min={1} max={50}
                  className="w-12 text-center font-bold text-sm tabular-nums bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => dispatch(changeTotaltOvers(TotalOvers + 1))}
                  // disabled={TotalOvers >= 50}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white shadow-sm font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >+</button>
              </div>
            </div>




   
            {/* Last Player Played */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="font-medium text-sm leading-tight">Last Player Played</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Track the last player who batted</p>
                </div>
              </div>
              <Switch checked={lastPlayerPlayed} onCheckedChange={() => dispatch(toggleLastPlayerPlayed(!lastPlayerPlayed))} />
            </div>

          </div>
        </section>

        {/* User Account */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary/60 mb-3 px-1">User Account</h2>
          <div className="bg-card rounded-xl shadow-sm border border-primary/5 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-primary/5 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                <p className="font-medium text-sm">Change Password</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-primary/5 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <UserRound className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                <p className="font-medium text-sm">Log In with Another Account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 text-destructive hover:bg-destructive/5 transition-colors">
              <div className="flex items-center gap-3">
                <UserX className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                <p className="font-medium text-sm">Delete Account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-destructive/60" />
            </button>
          </div>
        </section>

        <p className="text-center text-[10px] text-muted-foreground font-medium tracking-widest">
          CRICKET ANALYTICS PRO v2.4.1
        </p>

      </main>
    </div>
  );
}