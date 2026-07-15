// <!DOCTYPE html><html lang="en" class="dark"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0" name="viewport"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=block" rel="stylesheet"><script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script><script id="tailwind-config">try{
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     colors: {
//                         "primary": "#10b981", // Emerald 500
//                         "primary-dark": "#059669",
//                         "surface-light": "#f8fafc",
//                         "surface-dark": "#0f172a",
//                         "card-dark": "#1e293b",
//                     },
//                     fontFamily: {
//                         "sans": ["Inter", "sans-serif"]
//                     },
//                 },
//             },
//         }
//     }catch(_e){}</script></head><body class="bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200">
// <!-- Header Section -->
// <header class="sticky top-0 z-50 bg-emerald-900 text-white shadow-2xl px-5 pt-6 pb-4">
// <!-- Top Row: Teams & Target -->
// <div class="flex items-start justify-between mb-4">
// <div class="flex items-center gap-3">
// <span class="material-symbols-outlined cursor-pointer hover:bg-white/10 p-1 rounded-full transition-colors" data-original-icon="arrow_back">circle</span>
// <div>
// <h1 class="font-bold text-lg leading-tight flex items-center gap-2">
//                     Australia <span class="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Batting</span>
// </h1>
// <p class="text-xs opacity-70 flex items-center gap-1.5 mt-0.5">
//                     vs England <span class="text-[10px] border border-white/30 text-white/70 px-1.5 py-0.5 rounded uppercase tracking-wider">Bowling</span>
// </p>
// </div>
// </div>
// <div class="text-right">
// <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Target: 185</p>
// <p class="text-xs font-medium opacity-80 mt-0.5">Need 43 off 26</p>
// </div>
// </div>
// <!-- Score & Overs -->
// <div class="flex items-end justify-between">
// <div class="flex items-baseline gap-2">
// <span class="text-5xl font-black italic tracking-tighter">142/3</span>
// <span class="text-lg font-medium opacity-80">15.4 <span class="text-xs uppercase tracking-widest opacity-60 ml-0.5">Overs</span></span>
// </div>
// <div class="flex flex-col items-end">
// <div class="flex items-center gap-2 mb-1">
// <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
// <span class="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">LIVE</span>
// </div>
// </div>
// </div>
// <!-- Live Metrics Bar -->
// <div class="mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
// <div class="text-center">
// <p class="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">CRR</p>
// <p class="text-sm font-black text-emerald-400">9.06</p>
// </div>
// <div class="text-center">
// <p class="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">RRR</p>
// <p class="text-sm font-black text-emerald-400">10.12</p>
// </div>
// <div class="text-center">
// <p class="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">Target</p>
// <p class="text-sm font-black">185</p>
// </div>
// <div class="text-center">
// <p class="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">Left</p>
// <p class="text-sm font-black">43</p>
// </div>
// </div>
// </header>
// <main class="flex-1 overflow-y-auto pb-72 max-w-lg mx-auto w-full px-4">
// <!-- Recent Deliveries -->
// <div class="mt-4 p-3 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
// <div class="flex items-center justify-between mb-3 px-1">
// <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recent Balls</span>
// <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">This Over: 11 runs</span>
// </div>
// <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
// <div class="min-w-[32px] h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center font-bold text-sm">1</div>
// <div class="min-w-[32px] h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center font-bold text-sm">0</div>
// <div class="min-w-[32px] h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">4</div>
// <div class="min-w-[32px] h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">W</div>
// <div class="min-w-[32px] h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center font-bold text-sm">0</div>
// <div class="min-w-[32px] h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">6</div>
// <div class="min-w-[32px] h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm italic">1nb</div>
// <div class="min-w-[32px] h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
// </div>
// </div>
// <!-- Batters Section -->
// <section class="mt-4">
// <div class="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
// <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-800">
// <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Batting</span>
// </div>
// <!-- Striker -->
// <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
// <div class="flex items-center justify-between mb-3">
// <div class="flex items-center gap-2">
// <span class="font-black text-slate-900 dark:text-emerald-400">Steve Smith</span>
// <span class="text-emerald-600 dark:text-emerald-400 text-xs font-bold leading-none">*</span>
// </div>
// <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full uppercase tracking-tighter">Striker</span>
// </div>
// <div class="grid grid-cols-5 text-center">
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">R</p><p class="font-black text-lg">45</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">B</p><p class="font-bold text-slate-600 dark:text-slate-400">32</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">4s</p><p class="font-bold text-slate-600 dark:text-slate-400">4</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">6s</p><p class="font-bold text-slate-600 dark:text-slate-400">1</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">SR</p><p class="font-black text-slate-900 dark:text-slate-200">140.6</p></div>
// </div>
// </div>
// <!-- Non-Striker -->
// <div class="p-4">
// <div class="flex items-center justify-between mb-3">
// <span class="font-bold text-slate-700 dark:text-slate-300">Alex Carey</span>
// </div>
// <div class="grid grid-cols-5 text-center">
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">R</p><p class="font-bold text-slate-700 dark:text-slate-200">12</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">B</p><p class="font-medium text-slate-500 dark:text-slate-500">8</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">4s</p><p class="font-medium text-slate-500 dark:text-slate-500">1</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">6s</p><p class="font-medium text-slate-500 dark:text-slate-500">0</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">SR</p><p class="font-bold text-slate-700 dark:text-slate-400">150.0</p></div>
// </div>
// </div>
// </div>
// </section>
// <!-- Bowler Section -->
// <section class="mt-4">
// <div class="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
// <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-800">
// <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Bowling</span>
// </div>
// <div class="p-4">
// <div class="flex items-baseline justify-between mb-3">
// <div class="flex flex-col">
// <span class="font-black text-slate-900 dark:text-slate-200">Mark Wood</span>
// <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Fast • Over the Wicket</span>
// </div>
// </div>
// <div class="grid grid-cols-5 text-center">
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">O</p><p class="font-black text-slate-900 dark:text-slate-200">3.4</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">M</p><p class="font-bold text-slate-500 dark:text-slate-500">0</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">R</p><p class="font-bold text-slate-500 dark:text-slate-500">32</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold text-red-500">W</p><p class="font-black text-red-600">1</p></div>
// <div><p class="text-[9px] text-slate-400 uppercase font-bold">Econ</p><p class="font-black text-emerald-600 dark:text-emerald-400">8.73</p></div>
// </div>
// </div>
// </div>
// </section>
// <!-- Match Meta -->
// <div class="mt-4 grid grid-cols-2 gap-4">
// <div class="bg-white dark:bg-card-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800">
// <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Partnership</p>
// <p class="text-sm font-black text-slate-800 dark:text-slate-200">28 <span class="text-xs font-medium text-slate-500 ml-1">(14 balls)</span></p>
// </div>
// <div class="bg-white dark:bg-card-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800">
// <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Last Wicket</p>
// <p class="text-sm font-black text-slate-800 dark:text-slate-200">M. Marsh <span class="text-xs font-medium text-slate-500 ml-1">22 (15)</span></p>
// </div>
// </div>
// </main>
// <!-- Bottom Scoring Panel -->
// <div class="fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
// <!-- Quick Actions -->
// <div class="grid grid-cols-6 gap-2 mb-3">
// <button class="h-12 rounded-xl bg-red-600 text-white text-xs font-black border-b-4 border-red-800 uppercase flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all">Wkt</button>
// <button class="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 uppercase flex items-center justify-center">Wide</button>
// <button class="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 uppercase flex items-center justify-center">NB</button>
// <button class="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 uppercase flex items-center justify-center">Bye</button>
// <button class="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 uppercase flex items-center justify-center">LBye</button>
// <button class="h-12 rounded-xl bg-slate-800 dark:bg-emerald-600 text-white text-xs font-bold border-b-4 border-slate-950 dark:border-emerald-800 uppercase flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all">
// <span class="material-symbols-outlined text-lg">undo</span>
// </button>
// </div>
// <!-- Run Controls -->
// <div class="grid grid-cols-6 gap-2">
// <button class="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border-b-4 border-slate-300 dark:border-slate-700 text-2xl font-black text-slate-400 flex items-center justify-center active:translate-y-1 active:border-b-0">0</button>
// <button class="h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-b-4 border-emerald-200 dark:border-emerald-900/60 text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center active:translate-y-1 active:border-b-0">1</button>
// <button class="h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-b-4 border-emerald-200 dark:border-emerald-900/60 text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center active:translate-y-1 active:border-b-0">2</button>
// <button class="h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-b-4 border-emerald-200 dark:border-emerald-900/60 text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center active:translate-y-1 active:border-b-0">3</button>
// <button class="h-14 rounded-xl bg-emerald-600 border-b-4 border-emerald-800 text-2xl font-black text-white flex items-center justify-center active:translate-y-1 active:border-b-0">4</button>
// <button class="h-14 rounded-xl bg-emerald-600 border-b-4 border-emerald-800 text-2xl font-black text-white flex items-center justify-center active:translate-y-1 active:border-b-0">6</button>
// </div>
// </div>
// <!-- Tab Navigation -->
// <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 h-16 flex items-center justify-around px-2">
// <a class="flex flex-col items-center gap-0.5 text-slate-400" href="#">
// <span class="material-symbols-outlined text-[22px]" data-original-icon="play_circle">circle</span>
// <span class="text-[9px] font-black uppercase tracking-tighter">Start</span>
// </a>
// <a class="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400" href="#">
// <span class="material-symbols-outlined text-[22px] fill-1" data-original-icon="assignment">circle</span>
// <span class="text-[9px] font-black uppercase tracking-tighter">Live</span>
// </a>
// <a class="flex flex-col items-center gap-0.5 text-slate-400" href="#">
// <span class="material-symbols-outlined text-[22px]" data-original-icon="trending_up">circle</span>
// <span class="text-[9px] font-black uppercase tracking-tighter">Analysis</span>
// </a>
// <a class="flex flex-col items-center gap-0.5 text-slate-400" href="#">
// <span class="material-symbols-outlined text-[22px]">analytics</span>
// <span class="text-[9px] font-black uppercase tracking-tighter">Stats</span>
// </a>
// <a class="flex flex-col items-center gap-0.5 text-slate-400" href="#">
// <span class="material-symbols-outlined text-[22px]">settings</span>
// <span class="text-[9px] font-black uppercase tracking-tighter">Setup</span>
// </a>
// </nav>
// <!-- Over Action FAB -->
// <button class="fixed bottom-64 right-4 z-40 bg-emerald-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform">
// <span class="material-symbols-outlined" data-original-icon="swap_horiz">circle</span>
// </button>
// </body></html>