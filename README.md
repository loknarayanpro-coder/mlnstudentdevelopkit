# CareerPilot — Career & Placement Management System

CareerPilot is a production-grade full-stack career preparation and placement management platform designed for engineering students. It empowers students to plan structured preparation roadmaps, track Data Structures & Algorithms (DSA) problem solving, manage core computer science subjects, and track placement application pipelines end-to-end.

---

## ✨ Features

- **🗺️ Structured Placement Roadmap**: A comprehensive 36-week placement preparation plan covering languages, DSA, core subjects, projects, and interview readiness.
- **💻 DSA & Technical Tracker**: Problem tracker with difficulty ratings, platform links, tags, and spaced revision scheduling.
- **📅 Daily Study Planner**: Log daily study goals, track study sessions, and monitor consistency over time.
- **💼 Placement Pipeline**: Track company applications, interview rounds, test dates, and offer letters in an organized workflow.
- **📊 Performance Analytics & Scoring**: Real-time progress metrics calculating overall placement readiness and topic mastery.
- **🔐 Secure Authentication & Data Isolation**: Supabase Auth with Row Level Security (RLS) ensuring strict user data isolation.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **TanStack Start & Router** for high-performance routing
- **Tailwind CSS v4** & **Radix UI** for modern, accessible UI components
- **TanStack Query** for client-side state and data fetching
- **Lucide React** for icons
- **Recharts** for analytics and data visualization

### Backend & Database
- **Supabase PostgreSQL** for persistent relational storage
- **Row Level Security (RLS)** for secure multi-tenant data isolation
- **Drizzle ORM** for schema definition and migrations
- **Supabase Auth** for session management and authentication

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) (v10 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/loknarayanpro-coder/mlnstudentdevelopkit.git
   cd mlnstudentdevelopkit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_PROJECT_ID="your-project-id"
   SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
   SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal) to view the app.

---

## 📜 Available Scripts

- `npm run dev` — Starts the development server with Hot Module Replacement.
- `npm run build` — Builds the application for production.
- `npm run preview` — Locally previews the production build.
- `npm run test` — Runs automated test suites using Vitest.
- `npm run lint` — Runs ESLint checks across the codebase.
- `npm run format` — Formats all project files using Prettier.

---

## 🗄️ Database & Migrations

Database schemas and migrations are managed using Drizzle ORM:

- Schema definitions: `drizzle/schema.ts`
- Migrations: `drizzle/migrations/`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
