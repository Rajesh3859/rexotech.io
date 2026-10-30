"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Sparkles,
  Check,
  ChevronDown,
  Globe,
  Wand2,
  Volume2,
  Scissors,
  Layers,
  Film,
  Smartphone,
  Monitor,
  Square,
  Search,
  ArrowRight,
  Menu,
  X,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Video,
  FileCheck,
  Activity,
} from "lucide-react";

// Types
type CaptionPreset = "editorial" | "bold" | "creator" | "flow" | "minimal";
type AspectRatio = "9:16" | "16:9" | "1:1";

interface Language {
  name: string;
  native: string;
  code: string;
  accuracy: string;
  flag: string;
  region: "All" | "Popular" | "Europe" | "Asia" | "Americas" | "Middle East";
}

const LANGUAGES: Language[] = [
  { name: "English (US & UK)", native: "English", code: "en", accuracy: "99.8%", flag: "🇺🇸", region: "Popular" },
  { name: "Spanish", native: "Español", code: "es", accuracy: "99.5%", flag: "🇪🇸", region: "Popular" },
  { name: "French", native: "Français", code: "fr", accuracy: "99.2%", flag: "🇫🇷", region: "Europe" },
  { name: "German", native: "Deutsch", code: "de", accuracy: "99.4%", flag: "🇩🇪", region: "Europe" },
  { name: "Japanese", native: "日本語", code: "ja", accuracy: "98.9%", flag: "🇯🇵", region: "Asia" },
  { name: "Portuguese", native: "Português", code: "pt", accuracy: "99.3%", flag: "🇧🇷", region: "Americas" },
  { name: "Hindi", native: "हिन्दी", code: "hi", accuracy: "98.8%", flag: "🇮🇳", region: "Popular" },
  { name: "Arabic", native: "العربية", code: "ar", accuracy: "98.7%", flag: "🇸🇦", region: "Middle East" },
  { name: "Korean", native: "한국어", code: "ko", accuracy: "99.0%", flag: "🇰🇷", region: "Asia" },
  { name: "Italian", native: "Italiano", code: "it", accuracy: "99.1%", flag: "🇮🇹", region: "Europe" },
  { name: "Dutch", native: "Nederlands", code: "nl", accuracy: "99.2%", flag: "🇳🇱", region: "Europe" },
  { name: "Mandarin Chinese", native: "中文", code: "zh", accuracy: "98.9%", flag: "🇨🇳", region: "Asia" },
];

const PREVIEW_PHRASE = [
  { word: "Deliver", emphasis: false },
  { word: "engaging", emphasis: true },
  { word: "video", emphasis: false },
  { word: "content", emphasis: false },
  { word: "in", emphasis: false },
  { word: "minutes,", emphasis: false },
  { word: "not", emphasis: false },
  { word: "hours.", emphasis: true },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [preset, setPreset] = useState<CaptionPreset>("bold");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [highlightActive, setHighlightActive] = useState(true);

  // Motion physics tab
  const [activeMotionTab, setActiveMotionTab] = useState(0);

  // Language filter
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("All");

  // Pricing
  const [annualBilling, setAnnualBilling] = useState(true);

  // FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Word stepper simulation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % PREVIEW_PHRASE.length);
    }, 550);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const filteredLanguages = LANGUAGES.filter((lang) => {
    const matchesQuery =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion =
      regionFilter === "All" ||
      lang.region === regionFilter ||
      (regionFilter === "Popular" && lang.region === "Popular");
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f1f3f7] selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-purple-700/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 -left-20 w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* ---------------- NAVIGATION ---------------- */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b0c10]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              captions<span className="text-purple-500">.</span>ai
            </span>
          </a>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#motion" className="hover:text-white transition-colors">Motion Engine</a>
            <a href="#languages" className="hover:text-white transition-colors">Languages</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#0e0f14]/98 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 text-base font-medium text-zinc-200">
              <a onClick={() => setMobileMenuOpen(false)} href="#features" className="py-1.5 hover:text-purple-400">Features</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#demo" className="py-1.5 hover:text-purple-400">Interactive Demo</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#motion" className="py-1.5 hover:text-purple-400">Motion Engine</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#languages" className="py-1.5 hover:text-purple-400">Languages</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#pricing" className="py-1.5 hover:text-purple-400">Pricing</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#faq" className="py-1.5 hover:text-purple-400">FAQ</a>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              <a
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-zinc-200"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md"
              >
                Get Started Free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Precision speech-to-caption studio</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                The complete <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
                  AI video studio
                </span> <br />
                for modern creators
              </h1>

              <p className="text-xl sm:text-2xl font-bold text-zinc-200">
                Transform raw talking footage into high-retention stories.
              </p>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                Captions automatically transcribes, times, and styles kinetic subtitles, cuts silent pauses,
                and reformats your videos across platforms — saving hours of tedious timeline editing.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="/register"
                  className="px-8 py-4 rounded-full text-base font-bold text-zinc-950 bg-white hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  Start creating for free
                  <ArrowRight className="w-4 h-4 text-zinc-950" />
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 rounded-full text-base font-semibold text-white border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                  Explore interactive preview
                </a>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-white/[0.08] max-w-lg">
                <div>
                  <div className="text-2xl font-extrabold text-white">99.4%</div>
                  <div className="text-xs text-zinc-400">Transcription accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">60+</div>
                  <div className="text-xs text-zinc-400">Global languages</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">&lt; 30s</div>
                  <div className="text-xs text-zinc-400">Average render time</div>
                </div>
              </div>
            </div>

            {/* Right Visual Composition (Matching screenshot architecture) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[460px] flex flex-col gap-4">
                
                {/* Top Row: Creator pill + Violet teardrop accent */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-32 rounded-[36px] bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 p-5 shadow-xl flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900/15 backdrop-blur-md flex items-center justify-center">
                      <Activity className="w-7 h-7 text-slate-950" />
                    </div>
                    <div className="ml-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900/70">Audience Retention</div>
                      <div className="text-base font-black text-slate-950">+68% Watch-Through</div>
                      <div className="text-xs font-medium text-slate-800">Dynamic kinetic cadence</div>
                    </div>
                  </div>

                  <div className="w-24 h-32 rounded-[32px] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-600/30">
                    <Sparkles className="w-9 h-9 text-white/90" />
                  </div>
                </div>

                {/* Middle Row: Purple circle + Amber capsule */}
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center shadow-xl shadow-purple-600/25">
                    <Volume2 className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 h-28 rounded-[36px] bg-[#fed049] flex items-center px-6 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-amber-950/10 flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-amber-950" />
                    </div>
                    <div className="ml-4">
                      <div className="text-xs font-bold text-amber-950/70 uppercase tracking-wide">Automated Pacing</div>
                      <div className="text-base font-extrabold text-amber-950">Zero Awkward Pauses</div>
                      <div className="text-xs font-medium text-amber-900">Seamless silence snip</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Wide pill card with active caption preview */}
                <div className="h-32 rounded-[36px] bg-gradient-to-r from-zinc-200 via-slate-100 to-indigo-100 p-6 flex items-center justify-between shadow-2xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      SYNC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Word-By-Word Timing</div>
                      <div className="text-sm font-extrabold text-slate-900">
                        <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md mr-1.5 font-bold">ACCURATE</span>
                        TO THE MILLISECOND
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wider">
                    PRO RES
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 2. INTERACTIVE DEMO ---------------- */}
      <section id="demo" className="relative z-10 py-20 border-t border-white/[0.08] bg-[#0e0f14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase">
              <Film className="w-3.5 h-3.5" />
              Interactive Editor Preview
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Experience the kinetic subtitle engine
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Test typography presets, switch aspect ratios, and see how intelligent pacing enhances viewer focus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Editor Controls Panel */}
            <div className="lg:col-span-5 space-y-6 bg-[#13151e] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div>
                <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase block mb-3">
                  1. Select Subtitle Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "bold", name: "High Contrast Bold", desc: "Black banner with vivid pop" },
                    { id: "editorial", name: "Clean Editorial", desc: "Minimal white with soft pill" },
                    { id: "creator", name: "Dynamic Punch", desc: "High-impact spring bounce" },
                    { id: "flow", name: "Continuous Flow", desc: "Fluid gradient word reveal" },
                    { id: "minimal", name: "Understated Lower-Third", desc: "Subtle professional bar" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPreset(item.id as CaptionPreset)}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        preset === item.id
                          ? "bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-600/20"
                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Switcher */}
              <div>
                <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase block mb-3">
                  2. Destination Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "9:16", label: "9:16 Vertical", sub: "TikTok / Reels", icon: Smartphone },
                    { id: "16:9", label: "16:9 Landscape", sub: "YouTube / Web", icon: Monitor },
                    { id: "1:1", label: "1:1 Square", sub: "LinkedIn / Feed", icon: Square },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAspectRatio(item.id as AspectRatio)}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                          aspectRatio === item.id
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                            : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span>{item.label}</span>
                        <span className="text-[10px] font-normal text-zinc-300 opacity-75">{item.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Highlighting Toggle */}
              <div className="pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-200">Millisecond Word Tracking</div>
                    <div className="text-xs text-zinc-400">Highlights exactly as spoken words sound</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={highlightActive}
                    onChange={(e) => setHighlightActive(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> Pause Preview
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Resume Preview
                  </>
                )}
              </button>
            </div>

            {/* Video Player Display */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className={`relative transition-all duration-300 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl flex flex-col justify-between p-6 ${
                  aspectRatio === "9:16"
                    ? "w-[310px] sm:w-[340px] h-[540px]"
                    : aspectRatio === "16:9"
                    ? "w-full max-w-[540px] h-[340px]"
                    : "w-[340px] sm:w-[400px] h-[400px]"
                }`}
              >
                {/* Header status bar */}
                <div className="flex items-center justify-between text-xs text-zinc-400 z-10">
                  <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-[11px] text-zinc-200">PREVIEW TIMELINE</span>
                  </div>
                  <div className="bg-black/60 px-3 py-1 rounded-full backdrop-blur-md text-[11px] text-zinc-300 font-mono">
                    4K PRO RES
                  </div>
                </div>

                {/* Video backdrop representation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-blue-500/10 blur-3xl" />
                  <Video className="w-20 h-20 text-white/40" />
                </div>

                {/* Subtitle Render */}
                <div className="z-10 text-center px-4 my-auto">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                    {PREVIEW_PHRASE.map((item, idx) => {
                      const isActive = idx === activeWordIndex;

                      let style = "text-xl sm:text-2xl font-black uppercase tracking-wide transition-all duration-150 ";

                      if (preset === "bold") {
                        style += isActive && highlightActive
                          ? "scale-110 text-yellow-300 bg-black/85 px-2.5 py-1 rounded-lg drop-shadow-md"
                          : "text-white opacity-85";
                      } else if (preset === "editorial") {
                        style += isActive && highlightActive
                          ? "text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-semibold"
                          : "text-zinc-300 opacity-75 font-medium";
                      } else if (preset === "creator") {
                        style += isActive && highlightActive
                          ? "scale-120 text-emerald-400 font-black"
                          : "text-white opacity-70";
                      } else if (preset === "flow") {
                        style += isActive && highlightActive
                          ? "text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-0.5 rounded-full shadow-lg"
                          : "text-zinc-400 opacity-70";
                      } else if (preset === "minimal") {
                        style += isActive && highlightActive
                          ? "text-white border-b-2 border-purple-400 font-bold"
                          : "text-zinc-400";
                      }

                      return (
                        <span key={idx} className={style}>
                          {item.word}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline progress indicator */}
                <div className="z-10 bg-black/70 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="text-[11px] font-mono text-purple-400">AUDIO CADENCE</div>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${((activeWordIndex + 1) / PREVIEW_PHRASE.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">00:0{activeWordIndex + 1}</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. CORE PRODUCT PILLARS ---------------- */}
      <section id="features" className="relative z-10 py-24 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Engineered for Creators & Teams
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              A streamlined studio for every stage of your clip
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Eliminate repetitive editing tasks so you can focus on storytelling, audience growth, and production.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#12141c] border border-white/[0.08] hover:border-purple-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Context-Aware Speech Recognition</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Trained on technical terminology, industry acronyms, and global accents. Accurately applies punctuation, capitalizes brand names, and formats numbers automatically.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Intelligent Silence & Pause Trimming</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Detects unnatural gaps, breaths, and hesitation pauses. Automatically tightens pacing without cutting off natural word endings or sounding robotic.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/[0.08] hover:border-blue-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Contextual B-Roll Overlay Suggestions</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The engine analyzes conversational topics and highlights opportunities to insert relevant visual cutaways, maintaining high visual engagement throughout your hook.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/[0.08] hover:border-teal-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Acoustic Enhancement & Noise Removal</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Isolates vocal frequencies from background air noise, traffic rumble, and room echo. Delivers crisp, broadcast-quality vocal presence on standard smartphone recordings.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/[0.08] hover:border-amber-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Custom Brand Kit Integration</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Upload proprietary brand typefaces, specify primary and secondary hex colors, and define standardized margins to keep all published videos strictly on-brand.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/[0.08] hover:border-pink-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Platform Batch Export</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Generate vertical (9:16), horizontal (16:9), and square (1:1) video exports in parallel with tailored bitrates for YouTube, TikTok, Instagram, and LinkedIn.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 4. MOTION ENGINE PRINCIPLES ---------------- */}
      <section id="motion" className="relative z-10 py-24 border-t border-white/[0.08] bg-[#0d0e13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase">
              <Activity className="w-3.5 h-3.5" />
              Kinetic Typography
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Pacing designed for viewer retention
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Dynamic visual cues guide viewer attention and dramatically reduce drop-off on sound-off autoplay feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Cadence Synchronization",
                category: "Pacing",
                preview: "ACCURATE TO AUDIO",
                description: "Subtitles appear in micro-cadence chunks matching human speech bursts.",
              },
              {
                title: "Fluid Gradient Fill",
                category: "Karaoke",
                preview: "SMOOTH COLOR SWEEP",
                description: "Smooth horizontal color fill that guides reading flow in real-time.",
              },
              {
                title: "Key Assertion Accent",
                category: "Emphasis",
                preview: "TARGETED HIGHLIGHT",
                description: "Selectively highlights verbs and metrics to reinforce comprehension.",
              },
              {
                title: "Dynamic Lower-Thirds",
                category: "Editorial",
                preview: "BALANCED SPACING",
                description: "Optimized safe-zone positioning so titles never overlap platform UI overlays.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMotionTab(idx)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  activeMotionTab === idx
                    ? "bg-[#181a25] border-purple-500 shadow-xl shadow-purple-500/15"
                    : "bg-[#12131b] border-white/10 hover:border-white/20 hover:bg-[#151620]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset 0{idx + 1}</span>
                  </div>

                  <div className="h-28 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center p-4 mb-4">
                    <div
                      className={`font-black text-sm text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 ${
                        activeMotionTab === idx ? "scale-105" : ""
                      }`}
                    >
                      {item.preview}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
                  <span className={activeMotionTab === idx ? "text-purple-400" : "text-zinc-500"}>
                    {activeMotionTab === idx ? "Active preset" : "Select to inspect"}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 ${activeMotionTab === idx ? "text-purple-400" : "text-zinc-600"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 5. SUPPORTED LANGUAGES ---------------- */}
      <section id="languages" className="relative z-10 py-24 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold uppercase">
              <Globe className="w-3.5 h-3.5" />
              Global Reach
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Built for international creators & audiences
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Transcribe native dialects or auto-translate your videos into 60+ global languages.
            </p>
          </div>

          {/* Search & Region Filters */}
          <div className="max-w-2xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search languages by name or native script..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#14161f] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["All", "Popular", "Europe", "Asia"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegionFilter(reg)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    regionFilter === reg
                      ? "bg-purple-600 text-white"
                      : "bg-[#14161f] border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredLanguages.map((lang, idx) => (
              <div
                key={idx}
                className="bg-[#12141c] border border-white/[0.08] hover:border-purple-500/40 rounded-2xl p-4 transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lang.accuracy}
                  </span>
                </div>
                <div className="font-bold text-white text-sm truncate">{lang.name}</div>
                <div className="text-zinc-500 text-xs font-medium truncate mt-0.5">{lang.native}</div>
              </div>
            ))}
          </div>

          {/* Localization callout */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-blue-900/20 border border-purple-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-lg font-bold text-white">Looking to localize complete voiceovers?</div>
              <div className="text-sm text-zinc-400">
                AI Voice Dubbing accurately preserves your tone and vocal timbre in over 20 destination languages.
              </div>
            </div>
            <a
              href="/register"
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shrink-0"
            >
              Learn about Voice Dubbing
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 6. TRANSPARENT PRICING ---------------- */}
      <section id="pricing" className="relative z-10 py-24 border-t border-white/[0.08] bg-[#0c0d12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Predictable plans for every stage
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Start with our full-featured free plan. Upgrade when you need unlimited exports and team collaboration.
            </p>

            {/* Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-sm font-semibold ${!annualBilling ? "text-white" : "text-zinc-500"}`}>
                Monthly billing
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-14 h-8 rounded-full bg-zinc-800 p-1 border border-white/10 relative transition-colors focus:outline-none"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-purple-500 shadow-md transform transition-transform ${
                    annualBilling ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold ${annualBilling ? "text-white" : "text-zinc-500"}`}>
                Annual billing
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Save 20%
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Starter */}
            <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-8 flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold text-white mb-1">Starter</div>
                <div className="text-xs text-zinc-400 mb-6">For casual creators evaluating accuracy</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-zinc-500 text-sm font-medium">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-300 border-t border-white/[0.08] pt-6 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>3 video exports per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>720p HD rendering</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Standard subtitle presets</span>
                  </li>
                  <li className="flex items-center gap-3 text-zinc-500">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>Watermark on exports</span>
                  </li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full text-center py-3.5 rounded-full text-sm font-bold border border-white/15 text-white hover:bg-white/5 transition-all"
              >
                Get Started Free
              </a>
            </div>

            {/* Pro Creator (Featured) */}
            <div className="rounded-3xl bg-gradient-to-b from-[#1b192c] to-[#12131d] border-2 border-purple-500 p-8 flex flex-col justify-between shadow-2xl shadow-purple-600/20 relative scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase shadow-md">
                Most Popular
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-1">Pro Creator</div>
                <div className="text-xs text-purple-300 mb-6">For full-time creators and editors</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    ${annualBilling ? "15" : "19"}
                  </span>
                  <span className="text-zinc-400 text-sm font-medium">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-200 border-t border-purple-500/20 pt-6 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-semibold text-white">Unlimited exports (Zero watermark)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>4K 60FPS Ultra HD exports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Automated silence and filler trimmer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Vocal isolation & noise reduction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Custom brand kits & typography</span>
                  </li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full text-center py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 14-Day Pro Trial
              </a>
            </div>

            {/* Studio / Agency */}
            <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-8 flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold text-white mb-1">Studio & Team</div>
                <div className="text-xs text-zinc-400 mb-6">For editing agencies and production houses</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    ${annualBilling ? "39" : "49"}
                  </span>
                  <span className="text-zinc-500 text-sm font-medium">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-300 border-t border-white/[0.08] pt-6 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Everything in Pro Creator</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>5 team member seats included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Prioritized GPU transcription queue</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Shared workspace & brand asset library</span>
                  </li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full text-center py-3.5 rounded-full text-sm font-bold border border-white/15 text-white hover:bg-white/5 transition-all"
              >
                Contact Team Sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 7. FAQ ---------------- */}
      <section id="faq" className="relative z-10 py-24 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Answers to common questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How accurate is the transcription on noisy or accented speech?",
                a: "Our speech recognition is powered by custom fine-tuned Whisper architectures achieving 99.4% benchmark accuracy on conversational audio. It automatically parses technical terms, slang, and dialect variations without requiring extensive manual transcript corrections.",
              },
              {
                q: "Can I customize the typography and color palettes to match my brand?",
                a: "Yes. You have complete control over font family, weights, letter-spacing, uppercase transformation, drop shadows, borders, and active highlight colors. Pro and Studio plans allow direct TTF and WOFF2 font file uploads.",
              },
              {
                q: "What video formats and aspect ratios are supported?",
                a: "We support MP4, MOV, WEBM, MKV, and AVI uploads up to 4K resolution at 60 frames per second. With one click, videos reframe seamlessly for 9:16 (Shorts and Reels), 16:9 (YouTube and Web), and 1:1 (LinkedIn and Instagram Feed).",
              },
              {
                q: "Are my uploaded videos and data kept private?",
                a: "Your video files are encrypted in transit and at rest using enterprise-grade AES-256 standards. We never train public foundation models on your private media.",
              },
              {
                q: "Will my exported videos have any watermarks?",
                a: "Exports generated on our Pro Creator and Studio & Team plans are 100% watermark-free with full commercial ownership rights.",
              },
              {
                q: "Can I cancel or change plans at any time?",
                a: "Yes. You can upgrade, downgrade, or cancel your subscription directly from your account dashboard with zero lock-in or cancellation penalties.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#12141c] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-base sm:text-lg font-bold text-white hover:text-purple-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transform transition-transform duration-200 ${
                      openFaqIndex === idx ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BOTTOM CTA ---------------- */}
      <section className="relative z-10 py-20 border-t border-white/[0.08] bg-gradient-to-b from-[#0b0c10] to-[#120f24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Elevate your video content today
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of creators and teams who produce polished, captioned talking-head videos in minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-4 rounded-full text-base font-bold text-zinc-950 bg-white hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Get Started for Free
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-full text-base font-semibold text-white border border-white/20 hover:bg-white/5 transition-all"
            >
              Explore Pricing Plans
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#090a0d] py-12 text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                captions<span className="text-purple-500">.</span>ai
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#demo" className="hover:text-white">Interactive Demo</a>
              <a href="#motion" className="hover:text-white">Motion Engine</a>
              <a href="#languages" className="hover:text-white">60+ Languages</a>
              <a href="#pricing" className="hover:text-white">Pricing</a>
              <a href="#faq" className="hover:text-white">FAQ</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>© 2026 Captions AI Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-300">Terms of Service</a>
              <a href="#" className="hover:text-zinc-300">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
