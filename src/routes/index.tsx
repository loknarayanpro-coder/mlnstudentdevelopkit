import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowRight,
  Code2,
  Brain,
  Layers,
  Briefcase,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Clock,
  BarChart3,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Mail,
  MessageSquare,
  HeartHandshake,
  GraduationCap,
  ExternalLink,
  Globe,
  Linkedin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot — Learn Today, Build Tomorrow" },
      {
        name: "description",
        content:
          "Your all-in-one platform to learn, practice, and track your placement journey — explore all features and platform capabilities.",
      },
      { property: "og:title", content: "CareerPilot — Complete Features & Placement Suite" },
      {
        property: "og:description",
        content: "Track every step of your placement and engineering career journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const featuresLog = [
  {
    category: "Roadmap & Planning",
    badge: "Milestone Engine",
    icon: Compass,
    color: "blue",
    title: "36-Week Structured Placement Roadmap",
    description:
      "An adaptive week-by-week curriculum taking students from programming foundations through mock placement drives.",
    capabilities: [
      "Editable weekly milestone targets & custom task checklists",
      "Target finish date calculator based on your personalized start day",
      "Overdue milestone alerting with automatic catch-up scheduling",
      "Weekly reflection logs (Went well, Improvements, Rating 1–5)",
    ],
  },
  {
    category: "DSA & Coding",
    badge: "Spaced Repetition",
    icon: Code2,
    color: "emerald",
    title: "DSA Repository & Intelligent Revision Scheduler",
    description:
      "Systematic coding practice tracker with an automated Leitner-style spaced repetition algorithm.",
    capabilities: [
      "18+ Algorithm & Data Structure topic classifications (Arrays to Graphs)",
      "Automatic spaced revisions scheduled at 1, 3, 7, 14, and 30 days",
      "LeetCode, Codeforces, GFG, and HackerRank direct problem linking",
      "Difficulty-weighted scoring (Easy 1x, Medium 1.5x, Hard 2x)",
      "Solution notes, algorithmic approaches, and time-to-solve logging",
    ],
  },
  {
    category: "Roadmap & Planning",
    badge: "Focus Engine",
    icon: Clock,
    color: "amber",
    title: "Daily Study Planner & Live Focus Timer",
    description:
      "Turn broad placement ambitions into daily executable tasks with integrated stopwatch tracking.",
    capabilities: [
      "Pomodoro / Stopwatch study session timer with pause & resume",
      "Task categories: DSA, Java, Aptitude, CS Core, Projects, Resume",
      "Priority queues (High, Medium, Low) and daily planned minutes",
      "Unfinished task roll-over queue with 1-click 'Move to Today'",
      "Visual drag & drop position reordering",
    ],
  },
  {
    category: "CS Core & Aptitude",
    badge: "Core Knowledge",
    icon: BookOpen,
    color: "purple",
    title: "Technical Subjects & Interview Q&A Bank",
    description:
      "Comprehensive subject mastery trackers for engineering interviews and campus assessments.",
    capabilities: [
      "Java & Object-Oriented Programming (OOP) core concepts",
      "DBMS: SQL queries, normalization, ACID properties, indexing",
      "Operating Systems & Computer Networks interview modules",
      "Interactive technical interview Q&A bank with 'Confident' toggles",
      "Confidence ratings from 1 to 5 per subject",
    ],
  },
  {
    category: "CS Core & Aptitude",
    badge: "Assessment Ready",
    icon: Brain,
    color: "orange",
    title: "Quantitative & Reasoning Aptitude Drills",
    description:
      "Speed and accuracy training designed for preliminary company placement tests and exams.",
    capabilities: [
      "Quantitative Aptitude, Logical Reasoning, and Verbal drills",
      "Timed attempt logger tracking total questions vs correct answers",
      "Real-time accuracy percentage and time-per-question benchmarks",
      "Historical test logs with date-wise performance analytics",
    ],
  },
  {
    category: "Placement Pipeline",
    badge: "Drive Tracker",
    icon: Briefcase,
    color: "amber",
    title: "Placement Pipeline & Company Kanban",
    description:
      "End-to-end management for campus placement drives and off-campus tech applications.",
    capabilities: [
      "Multi-stage Kanban: Saved → Applied → OA → Interview → Offer",
      "Company categorization: Service-based, Product-based, Startups",
      "Eligibility criteria & application deadline countdown reminders",
      "Multi-round interview event schedule logger with notes",
      "Resume version controller with ATS checklist validator",
    ],
  },
  {
    category: "Analytics & Security",
    badge: "Scoring Algorithm",
    icon: BarChart3,
    color: "blue",
    title: "Multi-Factor Preparation Score (/100)",
    description:
      "An honest, weighted readiness score that calculates true placement probability.",
    capabilities: [
      "Balanced 5-factor formula: Roadmap 30%, DSA 25%, Topics 20%, Projects 15%, Consistency 10%",
      "Live student streak tracking with milestone badges",
      "Readiness tiers: Getting Started, Foundation, Momentum, Placement Ready",
      "Weekly study consistency comparison against your daily hour goal",
    ],
  },
  {
    category: "Analytics & Security",
    badge: "Enterprise Security",
    icon: ShieldCheck,
    color: "emerald",
    title: "Multi-Tenant Auth & PostgreSQL Row Level Security",
    description:
      "Bank-grade data isolation ensuring your career plan, notes, and records are 100% private.",
    capabilities: [
      "Supabase Authentication with encrypted sessions",
      "PostgreSQL Row Level Security (RLS) on all 20+ database tables",
      "Zero vendor lock-in with 1-click JSON full data export",
      "Zero third-party tracking or advertising scripts",
    ],
  },
];

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Roadmap & Planning",
    "DSA & Coding",
    "CS Core & Aptitude",
    "Placement Pipeline",
    "Analytics & Security",
  ];

  const filteredFeatures =
    selectedCategory === "All"
      ? featuresLog
      : featuresLog.filter((f) => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#182232] flex flex-col font-sans selection:bg-[#EAA82C]/30 selection:text-[#182232] overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADBCA]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* MLN Monogram Logo with warm underline highlight */}
          <Link to="/" className="group flex flex-col items-start cursor-pointer">
            <div className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-[#182232]">
              <img
                src="/mln-logo.jpg"
                alt="MLN Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-sm border border-[#EADBCA] transform group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-[#182232]">MLN</span>
                <span className="font-semibold text-[#182232]/80 text-lg">CAREERPILOT</span>
              </div>
            </div>
            <div className="h-1 w-full bg-[#EAA82C] rounded-full mt-0.5 transform origin-left transition-transform group-hover:scale-x-110" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#182232]/80">
            <Link
              to="/"
              className="relative text-[#182232] font-semibold transition-colors after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#EAA82C] after:rounded-full"
            >
              Home
            </Link>
            <a href="#about" className="hover:text-[#EAA82C] transition-colors font-medium">
              About
            </a>
            <a href="#features" className="hover:text-[#EAA82C] transition-colors font-medium">
              Features
            </a>
            <a href="#pillars" className="hover:text-[#EAA82C] transition-colors font-medium">
              Pillars
            </a>
            <a href="#roadmap" className="hover:text-[#EAA82C] transition-colors font-medium">
              Roadmap
            </a>
            <a href="#contact" className="hover:text-[#EAA82C] transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex rounded-full text-[#182232] hover:bg-[#F2EDE4] font-medium"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white px-5 py-2 font-medium shadow-md transition-all hover:scale-105"
            >
              <Link to="/auth">Start Learning &rarr;</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-6 md:pt-14 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: 4K Illustration with floating doodle badges */}
            <div className="lg:col-span-7 relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#F8D886]/40 via-amber-100/30 to-transparent rounded-3xl blur-2xl -z-10" />

              <div className="relative rounded-2xl overflow-hidden border border-[#EADBCA]/80 bg-white shadow-xl">
                <img
                  src="/hero-illustration.jpg"
                  alt="Students studying and coding together with laptops and books"
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-500"
                  loading="eager"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-md border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                  <span className="text-[#2563EB] font-mono font-bold">&lt;/&gt;</span>
                  <span>Code · Practice · Improve</span>
                </div>

                <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-md border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                  <span className="flex h-2 w-2 rounded-full bg-[#EAA82C] animate-pulse" />
                  <span>DSA · Aptitude · System Design</span>
                </div>

                <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 bg-[#182232] text-white px-3 py-1.5 rounded-full shadow-md text-xs font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-[#EAA82C]" />
                  <span>Better Skills, Bigger Dreams</span>
                </div>
              </div>

              {/* Mobile doodle pills */}
              <div className="flex sm:hidden flex-wrap gap-2 mt-4 justify-center">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-[#EADBCA]">
                  &lt;/&gt; Code · Practice · Improve
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-[#EADBCA]">
                  Plan · Prepare · Place
                </span>
              </div>
            </div>

            {/* Right Column: Hero Content */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 lg:pl-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
                <Sparkles className="h-3.5 w-3.5 text-[#EAA82C]" />
                Career & Placement Management
              </div>

              <div className="relative">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#182232] leading-[1.12]">
                  Learn Today, <br />
                  <span className="text-[#EAA82C] relative inline-block">
                    Build Tomorrow
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#EAA82C]/70"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 9.5C50 3.5 150 2 198 8"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              <p className="text-lg text-[#182232]/80 leading-relaxed font-normal max-w-lg">
                Your all-in-one platform to learn, practice, and track your placement journey —
                because your future deserves a plan.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white px-8 py-6 text-base font-semibold shadow-xl shadow-[#182232]/15 transition-all hover:scale-105 group"
                >
                  <Link to="/auth">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-[#182232] text-[#182232] hover:bg-[#182232] hover:text-white px-6 py-6 text-base font-semibold transition-all"
                >
                  <a href="#features">Explore Features &darr;</a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#EADBCA] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-display text-2xl font-bold text-[#182232]">36</div>
                  <div className="text-xs text-[#182232]/70">Weeks Roadmap</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#EAA82C]">450+</div>
                  <div className="text-xs text-[#182232]/70">Curated Problems</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#182232]">100%</div>
                  <div className="text-xs text-[#182232]/70">For All Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Golden Wave Divider */}
        <div className="w-full mt-16 leading-none">
          <svg
            className="w-full h-16 md:h-24 text-[#F8D886]/40"
            viewBox="0 0 1440 100"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,26.7C840,21,960,43,1080,53.3C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-[#FAF7F2] border-t border-[#EADBCA] relative scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story & Vision */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
                <GraduationCap className="h-3.5 w-3.5 text-[#EAA82C]" />
                Built by a Student, for the Students
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#182232] tracking-tight leading-tight">
                Built by a Student, for the Students. <br />
                <span className="text-[#EAA82C]">Designed for Engineering Excellence.</span>
              </h2>

              <p className="text-base sm:text-lg text-[#182232]/80 leading-relaxed font-normal">
                Every year, millions of engineering students embark on their career journey with
                scattered spreadsheets, lost browser bookmarks, and last-minute interview panic in
                their final semester.
              </p>

              <p className="text-base text-[#182232]/80 leading-relaxed font-normal">
                <strong>MLN CareerPilot</strong> was created by an engineering student for fellow engineering students to replace chaotic preparation with a
                structured, data-backed flight deck. We break down the four-year engineering journey
                into manageable daily study sessions, systematic spaced repetition for coding
                problems, and real-time readiness scoring.
              </p>

              {/* Core Tenets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#EADBCA] shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#182232]">Daily Momentum</h4>
                  <p className="text-xs text-[#182232]/70 mt-1">
                    Small daily tasks compound into mastery before campus placements start.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EADBCA] shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    <Brain className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#182232]">Spaced Repetition</h4>
                  <p className="text-xs text-[#182232]/70 mt-1">
                    Retain solved problems with automatic 1, 3, 7, 14 & 30-day revisions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EADBCA] shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                    <BarChart3 className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#182232]">Honest Score</h4>
                  <p className="text-xs text-[#182232]/70 mt-1">
                    A genuine 0–100 score reflecting true readiness across all placement pillars.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: MLN Monogram Emblem Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-[#182232] text-white p-8 sm:p-10 border border-[#2A3B54] shadow-2xl relative overflow-hidden text-center space-y-6">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#EAA82C]/15 blur-3xl pointer-events-none" />

                <div className="flex justify-center">
                  <img
                    src="/mln-logo.jpg"
                    alt="MLN Emblem"
                    className="h-28 w-28 rounded-3xl object-cover shadow-xl border-2 border-[#EAA82C] transform hover:rotate-3 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#EAA82C] font-bold">
                    MLN STUDENT DEVELOPER KIT
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Better Skills, Bigger Dreams
                  </h3>
                  <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                    Designed for engineering students across all branches and semesters — from Computer
                    Science and IT to Electronics and Electrical.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A3B54] grid grid-cols-2 gap-3 text-left">
                  <div className="bg-[#233147] p-3 rounded-xl border border-[#2A3B54]">
                    <div className="text-xs text-white/60">Target Roles</div>
                    <div className="text-sm font-bold text-white mt-0.5">Product & Service</div>
                  </div>
                  <div className="bg-[#233147] p-3 rounded-xl border border-[#2A3B54]">
                    <div className="text-xs text-white/60">Platform Access</div>
                    <div className="text-sm font-bold text-[#EAA82C] mt-0.5">100% Free Forever</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & CREATOR SECTION */}
      <section
        id="creator"
        className="py-20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-t border-[#EADBCA] relative scroll-mt-20 overflow-hidden"
      >
        {/* Ambient decorative blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#EAA82C]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-[#182232]/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
              <Sparkles className="h-3.5 w-3.5 text-[#EAA82C]" />
              Architect &amp; Founder Spotlight
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#182232] tracking-tight">
              About the Creator &amp; Platform
            </h2>
            <p className="text-base sm:text-lg text-[#182232]/75">
              Built by an engineering student for engineering students. Driven by real placement
              challenges, modern system design, and AI-accelerated learning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Creator Image & Bold "MADE BY LOK" banner */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md relative group">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#EAA82C]/30 via-amber-200/20 to-[#182232]/20 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl pointer-events-none -z-10" />

                <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-[#EADBCA] bg-white p-3 shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#182232]">
                    <img
                      src="/lok-profile.jpeg"
                      alt="M. Lok Narayan"
                      className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating badges */}
                    <div className="absolute top-3 left-3 bg-[#182232]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/10 flex items-center gap-1.5 shadow-md">
                      <Code2 className="h-3.5 w-3.5 text-[#EAA82C]" />
                      <span>Full-Stack Architect</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#182232] px-3 py-1 rounded-full text-xs font-bold border border-[#EADBCA] shadow-md">
                      Chennai, India 📍
                    </div>
                  </div>

                  {/* MANDATORY BOLD TEXT USER REQUIREMENT: "MADE BY LOK" */}
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#182232] via-[#202d42] to-[#182232] text-center border-2 border-[#EAA82C] shadow-lg">
                    <div className="text-2xl sm:text-3xl font-black tracking-widest text-[#EAA82C] uppercase drop-shadow-md">
                      <b>MADE BY LOK</b>
                    </div>
                    <p className="text-xs text-white/90 font-semibold tracking-wider uppercase mt-1">
                      M. Lok Narayan &bull; Developer &amp; Architect
                    </p>
                  </div>
                </div>

                {/* Direct Portfolio & Social CTA Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3 w-full relative z-30">
                  <a
                    href="https://modellokporftolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] text-xs font-bold text-[#182232] hover:text-[#EAA82C] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    <ExternalLink className="h-4 w-4 text-[#EAA82C] shrink-0" />
                    <span>Lok Portfolio</span>
                  </a>
                  <a
                    href="https://lokportfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] text-xs font-bold text-[#182232] hover:text-[#EAA82C] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    <Globe className="h-4 w-4 text-[#2563EB] shrink-0" />
                    <span>AI Portfolio</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lok-narayan-m-610a463b6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] text-xs font-bold text-[#182232] hover:text-[#EAA82C] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    <Linkedin className="h-4 w-4 text-[#0A66C2] shrink-0" />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href="https://github.com/loknarayanpro-coder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] text-xs font-bold text-[#182232] hover:text-[#EAA82C] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    <Code2 className="h-4 w-4 text-[#182232] shrink-0" />
                    <span>GitHub Hub</span>
                  </a>
                  <a
                    href="https://loknarayanpro-gwaaw87o0-loknarayanpro-7270s-projects.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#FEF3D6] border border-[#F8D886] hover:border-[#EAA82C] text-xs font-bold text-[#9A6208] hover:text-[#182232] shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#EAA82C] shrink-0" />
                    <span>Live Projects &amp; Deployments &rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Bio, Philosophy, Education, Experience */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EAA82C]">
                  <span>Vision &amp; Engineering Philosophy</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#182232] leading-tight">
                  &ldquo;I don't just write code. I design ecosystems.&rdquo;
                </h3>
                <p className="text-base text-[#182232]/80 leading-relaxed">
                  CareerPilot is crafted by <b>M. Lok Narayan</b>, an AI-enhanced full-stack
                  developer and engineering undergraduate at{" "}
                  <b>Velammal Institute of Technology</b> (B.E. Computer Science &amp;
                  Engineering, ETA 2028).
                </p>
                <p className="text-sm text-[#182232]/75 leading-relaxed">
                  Recognizing the overwhelming fragmentation of campus placement prep &mdash; where
                  students juggle disparate spreadsheets, LeetCode tabs, aptitude PDFs, and interview
                  flashcards &mdash; Lok engineered CareerPilot to bring the entire placement journey
                  under one unified, high-performance cockpit.
                </p>
              </div>

              {/* Education & Core Background Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#EADBCA] shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    <GraduationCap className="h-4 w-4" />
                    <span>Education</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#182232]">
                    B.E. Computer Science &amp; Engineering
                  </h4>
                  <p className="text-xs text-[#182232]/70">
                    Velammal Institute of Technology &bull; Expected 2028
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EADBCA] shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EAA82C]">
                    <Briefcase className="h-4 w-4" />
                    <span>Industry Experience</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#182232]">
                    Software Engineering Intern
                  </h4>
                  <p className="text-xs text-[#182232]/70">
                    Infosys Technologies &bull; REST APIs &amp; Scalable Services
                  </p>
                </div>
              </div>

              {/* Experience Badges */}
              <div className="p-5 rounded-2xl bg-white border border-[#EADBCA] shadow-sm space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#182232]/80">
                  Internships &amp; Technical Engagements
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                    🏢 Infosys Technologies (SWE Intern)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                    💻 Indiwebpros (Full Stack)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                    ☁️ SystemTron (AWS Cloud Architecture)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EADBCA] text-xs font-semibold text-[#182232]">
                    ⚡ Thiranex &amp; Orivionar
                  </span>
                </div>
              </div>

              {/* Key Highlights / Mindset Pills */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCA]">
                  <div className="text-xs font-bold text-[#EAA82C] uppercase tracking-wider">
                    Mindset
                  </div>
                  <div className="text-sm font-extrabold text-[#182232] mt-0.5">
                    Problem Solver
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCA]">
                  <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    Approach
                  </div>
                  <div className="text-sm font-extrabold text-[#182232] mt-0.5">
                    Vibe Coder
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCA]">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Focus
                  </div>
                  <div className="text-sm font-extrabold text-[#182232] mt-0.5">
                    Zero Friction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-t border-b border-[#EADBCA] relative scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
              <Zap className="h-3.5 w-3.5 text-[#EAA82C]" />
              Platform Release & Capabilities Matrix
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#182232] tracking-tight">
              Platform Features
            </h2>
            <p className="text-base sm:text-lg text-[#182232]/75">
              Explore all 8 dedicated modules and built-in capabilities engineered to take you from
              first-year fundamentals to top-tier company offers.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  selectedCategory === cat
                    ? "bg-[#182232] text-white scale-105 shadow-md"
                    : "bg-[#FAF7F2] text-[#182232]/80 hover:bg-[#EADBCA]/60 border border-[#EADBCA]"
                }`}
              >
                {cat}
                {cat === "All" && ` (${featuresLog.length})`}
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-[#EADBCA] bg-[#FAF7F2]/60 p-7 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#EADBCA] shadow-sm text-[#182232] group-hover:bg-[#EAA82C] group-hover:border-[#EAA82C] transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        &check; Built & Live
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#182232]/5 text-[#182232]/70 border border-[#EADBCA]">
                        {feat.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#182232] group-hover:text-[#EAA82C] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#182232]/75 leading-relaxed font-normal">
                    {feat.description}
                  </p>

                  {/* Capabilities Checklist */}
                  <div className="mt-6 pt-5 border-t border-[#EADBCA]/70 space-y-2.5">
                    {feat.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#182232]/85">
                        <CheckCircle2 className="h-4 w-4 text-[#EAA82C] shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Call to Action Bar */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#FEF3D6] via-amber-100/50 to-[#FEF3D6] border border-[#F8D886] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182232] text-white shrink-0">
                <Sparkles className="h-6 w-6 text-[#EAA82C]" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-[#182232]">
                  Ready to test all features live?
                </h4>
                <p className="text-xs sm:text-sm text-[#182232]/75">
                  Log in or sign up to experience the 36-week roadmap, spaced repetition DSA tracker, and study timer.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white px-8 py-5 text-sm font-semibold shrink-0 shadow-md"
            >
              <Link to="/auth">Open Dashboard &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Preparation Pillars Section */}
      <section id="pillars" className="py-16 bg-[#F5EFE6]/60 border-t border-[#EADBCA]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EAA82C]">
              Built for Engineering Students
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#182232]">
              Everything on Your Desk, Now in One Platform
            </h2>
            <p className="mt-3 text-base text-[#182232]/75">
              Just like the textbooks and notebooks in your study group — organize every dimension
              of placement readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: DSA */}
            <div className="group rounded-2xl bg-white p-6 border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB] mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Pillar 01
              </span>
              <h3 className="text-xl font-bold text-[#182232] mt-1">DSA & Algorithms</h3>
              <p className="text-sm text-[#182232]/70 mt-2">
                Problem tracking with difficulty ratings, tags, revision intervals, and solution
                approaches.
              </p>
              <div className="mt-4 pt-4 border-t border-[#F2EDE4] flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
                <span>Arrays to Graphs</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 2: Aptitude */}
            <div className="group rounded-2xl bg-white p-6 border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EA580C]/10 text-[#EA580C] mb-5 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Pillar 02
              </span>
              <h3 className="text-xl font-bold text-[#182232] mt-1">Quantitative Aptitude</h3>
              <p className="text-sm text-[#182232]/70 mt-2">
                Speed and accuracy tests across quantitative, logical reasoning, and verbal topics.
              </p>
              <div className="mt-4 pt-4 border-t border-[#F2EDE4] flex items-center gap-1.5 text-xs font-semibold text-[#EA580C]">
                <span>Timed Practice Sets</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 3: System Design & CS Core */}
            <div className="group rounded-2xl bg-white p-6 border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D9488]/10 text-[#0D9488] mb-5 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                Pillar 03
              </span>
              <h3 className="text-xl font-bold text-[#182232] mt-1">System Design & Core</h3>
              <p className="text-sm text-[#182232]/70 mt-2">
                DBMS, Operating Systems, Computer Networks, and System Architecture interview
                question banks.
              </p>
              <div className="mt-4 pt-4 border-t border-[#F2EDE4] flex items-center gap-1.5 text-xs font-semibold text-[#0D9488]">
                <span>Topic Mastery</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 4: Placement Pipeline */}
            <div className="group rounded-2xl bg-white p-6 border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAA82C]/20 text-[#B47408] mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B47408]">
                Pillar 04
              </span>
              <h3 className="text-xl font-bold text-[#182232] mt-1">Placement Pipeline</h3>
              <p className="text-sm text-[#182232]/70 mt-2">
                Kanban status for on-campus & off-campus drives: OA rounds, technical interviews, and
                offers.
              </p>
              <div className="mt-4 pt-4 border-t border-[#F2EDE4] flex items-center gap-1.5 text-xs font-semibold text-[#B47408]">
                <span>Offer Letter Tracking</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Roadmap Showcase */}
      <section id="roadmap" className="py-20 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-[#182232] text-white p-8 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#EAA82C]/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAA82C]/20 text-[#EAA82C] text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  Structured Progression
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
                  From First Year Foundations to Final Interview Offers
                </h2>
                <p className="text-white/80 text-base leading-relaxed max-w-xl">
                  Whether you are starting in your 1st year exploring programming languages or in your
                  pre-final year preparing for summer internships and day-one placements, your roadmap
                  adapts to your semester goals.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#EAA82C]" />
                    <span>Editable 36-Week Milestones</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#EAA82C]" />
                    <span>Daily Study Sessions Timer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#EAA82C]" />
                    <span>Instant Preparation Score /100</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-[#EAA82C] hover:bg-[#d9961f] text-[#182232] font-bold px-8 shadow-lg shadow-[#EAA82C]/20"
                  >
                    <Link to="/auth">Explore Your Plan &rarr;</Link>
                  </Button>
                </div>
              </div>

              {/* Interactive preview box */}
              <div className="lg:col-span-5 bg-[#233147] border border-[#2A3B54] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A3B54] pb-3">
                  <span className="text-xs uppercase tracking-wider text-white/60">
                    Active Roadmap Progress
                  </span>
                  <span className="text-xs font-bold text-[#EAA82C] bg-[#EAA82C]/10 px-2.5 py-0.5 rounded-full">
                    Week 14 of 36
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#182232]/60 border border-[#2A3B54]">
                    <CheckCircle2 className="h-5 w-5 text-[#EAA82C] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Binary Trees & BST Traversals</div>
                      <div className="text-xs text-white/60">Solved 12 / 15 practice problems</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#182232]/60 border border-[#2A3B54]">
                    <CheckCircle2 className="h-5 w-5 text-[#EAA82C] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">DBMS Normalization & SQL Queries</div>
                      <div className="text-xs text-white/60">Completed review flashcards</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#182232]/30 border border-[#2A3B54]/50 opacity-80">
                    <Calendar className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Mock Technical Interview Prep</div>
                      <div className="text-xs text-white/50">Scheduled for Saturday</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & COMMUNITY SECTION */}
      <section id="contact" className="py-20 bg-white border-t border-[#EADBCA] relative scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#FEF3D6] via-amber-100/40 to-[#FEF3D6] border border-[#F8D886] p-8 sm:p-14 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182232] text-white text-xs font-bold tracking-wider uppercase">
                  <HeartHandshake className="h-3.5 w-3.5 text-[#EAA82C]" />
                  Contact & Student Support
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#182232] tracking-tight">
                  Have Questions or Suggestions? We are Here to Help.
                </h2>

                <p className="text-base text-[#182232]/75 max-w-lg">
                  CareerPilot is continuously updated for engineering students. Connect with us for
                  curriculum recommendations, bug reports, or study plan guidance.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-sm font-semibold text-[#182232]">
                  <a
                    href="mailto:loknarayanpro@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#EAA82C]" />
                    loknarayanpro@gmail.com
                  </a>

                  <a
                    href="https://github.com/loknarayanpro-coder/mlnstudentdevelopkit"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-[#2563EB]" />
                    GitHub Repository
                  </a>

                  <a
                    href="https://www.linkedin.com/in/lok-narayan-m-610a463b6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EADBCA] hover:border-[#EAA82C] transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    LinkedIn (Lok Narayan)
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#EADBCA] shadow-md space-y-4">
                <h4 className="font-display text-lg font-bold text-[#182232]">Send a Quick Note</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name / College"
                    className="w-full text-xs p-3 rounded-xl border border-[#EADBCA] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#EAA82C]"
                  />
                  <textarea
                    rows={3}
                    placeholder="Tell us what feature or roadmap milestone you would like added..."
                    className="w-full text-xs p-3 rounded-xl border border-[#EADBCA] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#EAA82C]"
                  />
                  <Button
                    onClick={() => alert("Thank you for your feedback! It has been noted.")}
                    className="w-full rounded-full bg-[#182232] hover:bg-[#25344c] text-white text-xs font-bold py-5"
                  >
                    Send Feedback &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-[#FAF7F2] border-t border-[#EADBCA]/60">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#EAA82C] text-[#182232] shadow-md mx-auto">
            <Award className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#182232]">
            Ready to plan your path to placement offers?
          </h2>
          <p className="text-[#182232]/80 text-lg max-w-2xl mx-auto">
            Take small daily steps with a visible plan you can trust. Join engineering students
            turning their preparation into real offers.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white px-9 py-6 text-base font-semibold shadow-xl shadow-[#182232]/15 hover:scale-105 transition-all"
            >
              <Link to="/auth">Get Started Now &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#182232] text-white py-12 border-t border-[#2A3B54]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold">
            <img
              src="/mln-logo.jpg"
              alt="MLN Logo"
              className="h-8 w-8 rounded-lg object-cover shadow-sm border border-[#2A3B54]"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-[#EAA82C] font-extrabold">MLN</span>
              <span>CareerPilot</span>
            </div>
          </div>

          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} MLN CareerPilot. Learn Today, Build Tomorrow. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-white/80">
            <Link to="/auth" className="hover:text-[#EAA82C] transition-colors">
              Sign In
            </Link>
            <a href="#about" className="hover:text-[#EAA82C] transition-colors">
              About
            </a>
            <a href="#features" className="hover:text-[#EAA82C] transition-colors">
              Features
            </a>
            <a href="#pillars" className="hover:text-[#EAA82C] transition-colors">
              Pillars
            </a>
            <a href="#roadmap" className="hover:text-[#EAA82C] transition-colors">
              Roadmap
            </a>
            <a href="#contact" className="hover:text-[#EAA82C] transition-colors">
              Contact
            </a>
            <a
              href="https://www.linkedin.com/in/lok-narayan-m-610a463b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EAA82C] transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
              LinkedIn
            </a>
            <a
              href="mailto:loknarayanpro@gmail.com"
              className="hover:text-[#EAA82C] transition-colors flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-[#EAA82C]" />
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
