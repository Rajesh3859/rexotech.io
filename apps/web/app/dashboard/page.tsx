"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  Search,
  Bell,
  User,
  Plus,
  UploadCloud,
  Video,
  MoreVertical,
  Clock,
  ArrowUpRight,
  Download,
  Trash2,
  HardDrive,
  Gauge,
  Zap,
  Crown,
  LogOut,
  Check,
  X,
  Menu,
  ChevronRight,
  Filter,
  Play,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Navigation tabs
type Tab = "overview" | "projects" | "templates" | "usage" | "subscription" | "settings";

interface ProjectItem {
  id: string;
  title: string;
  duration: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
  status: "Ready" | "Transcribing" | "Rendering" | "Draft";
  updatedAt: string;
  preset: string;
  wordsCount: number;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "10 Proven Habits of High Performers",
    duration: "00:58",
    aspectRatio: "9:16",
    status: "Ready",
    updatedAt: "10 mins ago",
    preset: "High Contrast Bold",
    wordsCount: 142,
  },
  {
    id: "proj-2",
    title: "SaaS Product Breakdown & Teardown",
    duration: "03:24",
    aspectRatio: "16:9",
    status: "Rendering",
    updatedAt: "1 hour ago",
    preset: "Clean Editorial",
    wordsCount: 468,
  },
  {
    id: "proj-3",
    title: "Why Most Creators Fail in Year One",
    duration: "00:45",
    aspectRatio: "9:16",
    status: "Ready",
    updatedAt: "Yesterday",
    preset: "Dynamic Punch",
    wordsCount: 118,
  },
  {
    id: "proj-4",
    title: "Weekly Market Insights & Forecast",
    duration: "01:12",
    aspectRatio: "1:1",
    status: "Transcribing",
    updatedAt: "2 days ago",
    preset: "Continuous Flow",
    wordsCount: 195,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentTab, setCurrentTab] = useState<Tab>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // User state
  const [userEmail, setUserEmail] = useState<string>("alex.creator@rexotech.io");
  const [userName, setUserName] = useState<string>("Alex Morgan");
  const [userPlan] = useState<string>("Starter");

  // Create Project Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectRatio, setNewProjectRatio] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [newProjectLanguage, setNewProjectLanguage] = useState("English (US)");
  const [newProjectPreset, setNewProjectPreset] = useState("High Contrast Bold");
  const [isUploading, setIsUploading] = useState(false);

  // Projects list state
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  // Load real Supabase user if session exists
  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUserEmail(session.user.email || "creator@captionstudio.io");
          if (session.user.user_metadata?.full_name) {
            setUserName(session.user.user_metadata.full_name);
          }
        }
      } catch (err) {
        console.warn("Could not retrieve session:", err);
      }
    }
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: newProjectTitle.trim(),
        duration: "00:45",
        aspectRatio: newProjectRatio,
        status: "Transcribing",
        updatedAt: "Just now",
        preset: newProjectPreset,
        wordsCount: 95,
      };

      setProjects([newProj, ...projects]);
      setIsUploading(false);
      setIsCreateModalOpen(false);
      setNewProjectTitle("");
    }, 1200);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f1f3f7] flex relative selection:bg-purple-600 selection:text-white">
      {/* ---------------- 1. SIDEBAR (Desktop) ---------------- */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.08] bg-[#0c0d12] p-5 justify-between shrink-0 h-screen sticky top-0 z-30">
        <div>
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              captions<span className="text-purple-500">.</span>ai
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "projects", label: "My Projects", icon: FolderKanban, badge: projects.length },
              { id: "templates", label: "Templates", icon: Sparkles },
              { id: "usage", label: "Usage", icon: BarChart3 },
              { id: "subscription", label: "Subscription", icon: CreditCard },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as Tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Plan Info & Sign Out */}
        <div className="pt-4 border-t border-white/[0.08] space-y-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                {userPlan} Plan
              </span>
              <Crown className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xs text-zinc-300 mb-2">2 of 3 monthly exports used</div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div className="w-2/3 h-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            </div>
            <button
              onClick={() => setCurrentTab("subscription")}
              className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shadow-sm"
            >
              Upgrade to Pro
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ---------------- MOBILE SIDEBAR DRAWER ---------------- */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#0e0f14] p-5 border-r border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">captions.ai</span>
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard },
                  { id: "projects", label: "My Projects", icon: FolderKanban },
                  { id: "templates", label: "Templates", icon: Sparkles },
                  { id: "usage", label: "Usage", icon: BarChart3 },
                  { id: "subscription", label: "Subscription", icon: CreditCard },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id as Tab);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 2. MAIN APP CONTAINER ---------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="sticky top-0 z-20 h-18 border-b border-white/[0.08] bg-[#0b0c10]/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, transcripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#14161f] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Right Header: Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-1.5 right-1.5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#14161f] border border-white/10 p-4 shadow-2xl z-30 space-y-2">
                  <div className="text-xs font-bold text-white mb-2">Notifications</div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-xs">
                    <div className="font-semibold text-zinc-200">Transcription Complete</div>
                    <div className="text-[11px] text-zinc-400">Habits of High Performers is ready.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-xs">
                    <div className="font-semibold text-zinc-200">New Feature Released</div>
                    <div className="text-[11px] text-zinc-400">Automated AI B-Roll Suggestions are live!</div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-white/5 border border-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {userName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">{userName}</div>
                  <div className="text-[10px] text-zinc-400 leading-tight truncate max-w-[120px]">
                    {userEmail}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#14161f] border border-white/10 p-2 shadow-2xl z-30 space-y-1">
                  <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                    <div className="text-xs font-bold text-white">{userName}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{userEmail}</div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab("settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab("subscription");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Subscription Plan</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------------- 3. MAIN CONTENT AREA ---------------- */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {currentTab === "overview" && (
            <>
              {/* Header Title & Create Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome back, {userName.split(" ")[0]}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Manage your video captions, create new projects, and monitor generation usage.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Project</span>
                </button>
              </div>

              {/* 1. USAGE SUMMARY STAT CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#12141c] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-3">
                    <span>Transcription Used</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">42 / 120 <span className="text-xs font-normal text-zinc-400">mins</span></div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[35%] h-full bg-purple-500" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#12141c] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-3">
                    <span>Monthly Exports</span>
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white">2 / 3 <span className="text-xs font-normal text-zinc-400">clips</span></div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[66%] h-full bg-indigo-500" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#12141c] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-3">
                    <span>Storage Consumed</span>
                    <HardDrive className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white">1.8 / 10 <span className="text-xs font-normal text-zinc-400">GB</span></div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[18%] h-full bg-teal-500" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#12141c] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-3">
                    <span>Average Speed</span>
                    <Gauge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">&lt; 28s <span className="text-xs font-normal text-zinc-400">per min</span></div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-3">Whisper GPU accelerated</div>
                </div>
              </div>

              {/* 2. UPGRADE PROMO BANNER */}
              <div className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/25 to-blue-900/20 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    Unlock Unlimited Creator Powers
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Remove watermarks and export in 4K 60FPS
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                    Get unlimited video exports, AI B-Roll suggestions, automated silence snips, and 60+ global languages on the Pro Creator plan.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab("subscription")}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0"
                >
                  Upgrade to Pro ($15/mo)
                </button>
              </div>

              {/* 3. RECENT PROJECTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Recent Projects</h2>
                    <p className="text-xs text-zinc-400">Your latest uploaded videos and caption sessions</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab("projects")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <span>View all projects</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {projects.slice(0, 4).map((proj) => (
                    <div
                      key={proj.id}
                      className="group p-4 rounded-3xl bg-[#12141c] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Video Mockup Thumbnail */}
                        <div className="h-36 rounded-2xl bg-black/60 border border-white/5 relative overflow-hidden flex items-center justify-center mb-3">
                          <div className="text-center p-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block mb-1">
                              {proj.preset}
                            </span>
                            <div className="text-xs font-bold text-white/90 line-clamp-2">
                              &ldquo;{proj.title}&rdquo;
                            </div>
                          </div>

                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                            {proj.aspectRatio}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 font-mono text-[10px] text-zinc-300">
                            {proj.duration}
                          </div>

                          {/* Hover Play Button */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Title and metadata */}
                        <h4 className="text-sm font-bold text-white truncate mb-1">{proj.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-3">
                          <span>{proj.wordsCount} words</span>
                          <span>•</span>
                          <span>{proj.updatedAt}</span>
                        </div>
                      </div>

                      {/* Status pill & Actions */}
                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            proj.status === "Ready"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : proj.status === "Rendering"
                              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {proj.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            title="Export Video"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY PROJECTS */}
          {currentTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">My Projects</h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    All created videos, saved drafts, and exported captions.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-2 shadow-md shadow-purple-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-3xl bg-[#12141c] border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                          {proj.aspectRatio}
                        </span>
                        <span className="text-xs text-zinc-400">{proj.updatedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-xs text-zinc-400 mb-4">
                        Preset: <span className="text-zinc-200 font-medium">{proj.preset}</span> • Duration: {proj.duration}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">{proj.status}</span>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-bold transition-all">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES */}
          {currentTab === "templates" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Caption Presets & Templates</h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Choose your typography style or build custom brand templates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "High Contrast Bold", desc: "Black pill background with vibrant yellow pop.", style: "bg-black/90 text-yellow-300 px-3 py-1 rounded-lg font-black" },
                  { title: "Clean Editorial", desc: "Subtle purple pill with understated elegant tracking.", style: "bg-purple-950/80 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-md font-semibold" },
                  { title: "Dynamic Punch", desc: "Kinetic green emphasis for viral short-form hooks.", style: "text-emerald-400 font-extrabold tracking-wide" },
                  { title: "Continuous Flow", desc: "Fluid gradient karaoke reveal.", style: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full font-bold" },
                  { title: "Cyber Accent", desc: "Glowing neon cyan outline effect.", style: "text-cyan-300 underline font-bold" },
                  { title: "Minimal Lower-Third", desc: "Safe-zone aligned clean subtitle banner.", style: "border-b-2 border-purple-400 text-white font-bold" },
                ].map((tpl, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="h-28 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center p-4 mb-4">
                        <span className={tpl.style}>SAMPLE CAPTION</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{tpl.title}</h3>
                      <p className="text-xs text-zinc-400">{tpl.desc}</p>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white transition-colors">
                      Apply Preset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USAGE */}
          {currentTab === "usage" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Usage & Billing Analytics</h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Monitor transcription minutes, export quotas, and storage consumption.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-3">
                  <div className="text-xs text-zinc-400 font-semibold uppercase">Transcription Minutes</div>
                  <div className="text-3xl font-black text-white">42 / 120</div>
                  <div className="text-xs text-zinc-400">78 minutes remaining this billing cycle</div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[35%] h-full bg-purple-500" />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-3">
                  <div className="text-xs text-zinc-400 font-semibold uppercase">Render Quota</div>
                  <div className="text-3xl font-black text-white">2 / 3 Exports</div>
                  <div className="text-xs text-zinc-400">Resets on the 1st of next month</div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[66%] h-full bg-indigo-500" />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-3">
                  <div className="text-xs text-zinc-400 font-semibold uppercase">Cloud Storage</div>
                  <div className="text-3xl font-black text-white">1.8 / 10 GB</div>
                  <div className="text-xs text-zinc-400">Stored on encrypted R2 buckets</div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[18%] h-full bg-teal-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUBSCRIPTION */}
          {currentTab === "subscription" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Subscription Plans</h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage your subscription, billing method, and invoice history.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                <div className="p-7 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Starter</div>
                    <div className="text-3xl font-black text-white mt-2">$0 <span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                    <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 3 exports per month</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 720p HD resolution</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Standard styles</li>
                    </ul>
                  </div>
                  <div className="mt-8 py-2 text-center text-xs font-bold text-zinc-400 bg-white/5 rounded-xl">Current Plan</div>
                </div>

                <div className="p-7 rounded-3xl bg-gradient-to-b from-[#1c1a2e] to-[#12131d] border-2 border-purple-500 shadow-xl shadow-purple-600/20 flex flex-col justify-between relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] uppercase">
                    Recommended
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Pro Creator</div>
                    <div className="text-3xl font-black text-white mt-2">$15 <span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                    <ul className="mt-6 space-y-2.5 text-xs text-zinc-200">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Unlimited exports (Zero watermark)</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 4K 60FPS Ultra HD</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> AI Silence & Filler Trimmer</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Semantic AI B-Roll suggestions</li>
                    </ul>
                  </div>
                  <button className="mt-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all">
                    Upgrade to Pro
                  </button>
                </div>

                <div className="p-7 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Studio & Agency</div>
                    <div className="text-3xl font-black text-white mt-2">$39 <span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                    <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Everything in Pro</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 5 team seats</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Priority GPU queue</li>
                    </ul>
                  </div>
                  <button className="mt-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {currentTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account Settings</h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage your personal profile, credentials, and notification preferences.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Profile Information</h3>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171923] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171923] border border-white/5 text-zinc-400 text-xs cursor-not-allowed"
                  />
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ---------------- 4. CREATE NEW PROJECT MODAL ---------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isUploading && setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-[#12141c] border border-white/10 p-7 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Create New Video Project</h2>
                <p className="text-xs text-zinc-400">Upload talking-head video for automatic captioning</p>
              </div>
              <button
                disabled={isUploading}
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 5 Rules for Scaling Content"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#171923] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors bg-white/[0.02]">
                <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-white">Drag & drop your video file here</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">MP4, MOV, WEBM up to 4K 60FPS</div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Destination Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "9:16", label: "9:16 Vertical", sub: "TikTok / Shorts" },
                    { id: "16:9", label: "16:9 Landscape", sub: "YouTube / Web" },
                    { id: "1:1", label: "1:1 Square", sub: "LinkedIn / Feed" },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setNewProjectRatio(r.id as "9:16" | "16:9" | "1:1")}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        newProjectRatio === r.id
                          ? "bg-purple-600 text-white border-purple-500 shadow-md"
                          : "bg-[#171923] border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{r.label}</div>
                      <div className="text-[10px] opacity-75">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language & Style Preset */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Primary Language</label>
                  <select
                    value={newProjectLanguage}
                    onChange={(e) => setNewProjectLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171923] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option>English (US)</option>
                    <option>Spanish (Español)</option>
                    <option>French (Français)</option>
                    <option>German (Deutsch)</option>
                    <option>Japanese (日本語)</option>
                    <option>Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Subtitle Style</label>
                  <select
                    value={newProjectPreset}
                    onChange={(e) => setNewProjectPreset(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171923] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option>High Contrast Bold</option>
                    <option>Clean Editorial</option>
                    <option>Dynamic Punch</option>
                    <option>Continuous Flow</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading & Transcribing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & Generate Captions</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

