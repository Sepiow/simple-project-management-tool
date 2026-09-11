# Simple Project Management Tool

A full-stack project and task management web application built as part of the Developer Assessment Task.

This application provides a workspace where users can manage multiple projects, track tasks through a drag-and-drop Kanban board or table view, monitor task status transitions through audit logs, and manage account credentials. The application is powered by a serverless API layer integrated with the Dowinnsys Backend API.

---

## 🚀 Live Demo & Deployed Version

- **Deployed Application:** https://simple-project-management-tool-beryl.vercel.app
- **Local Application:** http://localhost:3000

### Demo Credentials

| Field | Value |
|---|---|
| User ID | `demo_user` |
| Password | `Password123!` |

> **Security Note:** The credentials above are intended for demo purposes only. Production API keys, backend credentials, and environment secrets are shared securely via Discord and are not stored in this repository.

---

## ✨ Core Features

### 1. Authentication & Profile Management
- User registration with input validation
- Duplicate username and email prevention
- Secure sign-in using HTTP-only session cookies
- Account settings for updating email and password
- Current password verification before password changes

### 2. Project Workspace
- Create and update projects
- Project title and description management
- Multi-project workspace with a project switcher
- User-isolated project views
- Dedicated project settings page

### 3. Task Management
- Create and update project tasks
- Tasks are associated with individual projects
- Task status workflow:
  - Todo
  - In Progress
  - Done
- Search tasks by keyword
- Filter tasks by project and status
- Optimistic UI updates

### 4. Kanban Board
- Drag and drop tasks between status columns
- Immediate optimistic UI feedback
- Backend synchronization after status changes
- Automatic audit log creation when task status changes

### 5. Table View
- Structured task list
- Sortable columns
- Status indicators
- Task creation timestamps
- Search and filtering support

### 6. Task Change History
- Tracks task status transitions
- Displays previous and new statuses
- Records timestamps and change remarks
- Individual task change history
- Project-wide audit history
- Background polling for updated logs

**Example:**
```
Todo ➔ In Progress | Status changed from Todo to In Progress | Sept 10, 2026, 3:45 PM
```

### 7. Database Initialization
A dedicated `/api/init` endpoint can bootstrap the application with:
- Demo users
- Sample projects
- Sample tasks
- Tasks across multiple statuses
- Initial changelog records

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) using the App Router
- **Language:** TypeScript
- **UI:** [Shadcn UI](https://ui.shadcn.com/) with Radix UI primitives
- **Styling:** Tailwind CSS
- **State & Data Fetching:** TanStack React Query v5
- **URL Query State:** nuqs
- **Drag & Drop:** `@hello-pangea/dnd`
- **Forms:** react-hook-form
- **Validation:** Zod
- **Notifications:** sonner
- **Icons:** lucide-react and react-icons

### Backend & API
- **API Framework:** Hono
- **Validation:** Zod and `@hono/zod-validator`
- **Execution:** Serverless API routes through Next.js
- **Authentication:** Secure HTTP-only session cookies
- **Type Safety:** Hono RPC client
- **Database:** Dowinnsys Cloud Relational API

### Deployment
- **Platform:** Vercel
- **Repository:** GitHub
- **Backend:** Dowinnsys Cloud Backend Services

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                       │
│ Next.js + React + TypeScript                         │
│ Tailwind CSS + Shadcn UI                              │
│ TanStack React Query + nuqs + Drag & Drop             │
└───────────────────────┬───────────────────────────────┘
                         │
                         │ Type-Safe RPC / HTTP
                         ▼
┌─────────────────────────────────────────────────────┐
│                  BACKEND API                          │
│                                                       │
│ Hono + Zod Validation                                 │
│ HTTP-Only Session Authentication                      │
└───────────────────────┬───────────────────────────────┘
                         │
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────┐
│              DOWINNSYS CLOUD BACKEND                  │
│                                                       │
│ Relational API: test01 - test04                       │
└─────────────────────────────────────────────────────┘
```

### Application Data Flow

```
User
  │
  ▼
Next.js UI
  │
  ▼
TanStack React Query
  │
  ▼
Hono API
  │
  ├── Authentication
  ├── Zod Validation
  └── Business Logic
  │
  ▼
Dowinnsys Cloud API
  │
  ▼
Persistent Data
```

---

## 🔐 Authentication & Security

Authentication uses secure HTTP-only session cookies.

The session configuration includes:

```js
{
  httpOnly: true,
  secure: true,        // Production
  sameSite: "strict"
}
```

The application also implements:
- Server-side authentication checks
- Runtime request validation using Zod
- Duplicate username/email detection
- Current-password verification for sensitive account changes
- Environment variables for backend configuration
- No production credentials committed to GitHub

---

## 🗄️ Database Structure

The application uses four Dowinnsys Cloud relational datasets:

| Dataset | Purpose |
|---|---|
| `test01` | Members and user information |
| `test02` | Projects and ownership |
| `test03` | Tasks and project relationships |
| `test04` | Task audit logs and status transitions |

### Entity Relationship

```
Member
  │
  └── Projects
        │
        └── Tasks
              │
              └── Change Logs
```

---

## 📡 API Overview

### Authentication & Members

Base route: `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/current` | Returns the current authenticated user |
| POST | `/api/auth/login` | Authenticates user credentials |
| POST | `/api/auth/register` | Creates a new user account |
| PATCH | `/api/auth/update-member` | Updates email or password |
| POST | `/api/auth/logout` | Clears the authentication session |

### Projects

Base route: `/api/projects`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Lists the user's projects |
| POST | `/api/projects` | Creates a project |
| PATCH | `/api/projects/:projectId` | Updates project information |

### Tasks

Base route: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Lists and filters tasks |
| GET | `/api/tasks/:taskId` | Fetches a single task |
| POST | `/api/tasks` | Creates a task |
| PATCH | `/api/tasks/:taskId` | Updates a task |
| GET | `/api/tasks/:taskId/changelogs` | Returns task change history |
| GET | `/api/tasks/project/:projectId/changelogs` | Returns project-wide change history |

### Database Initialization

| Method | Endpoint | Description |
|---|---|---|
| GET / POST | `/api/init` | Initializes demo data |

---

## 💻 Running the Project Locally

### Prerequisites
- **Node.js:** v18.18.0 or later
- **Package Manager:** npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/Sepiow/simple-project-management-tool.git
cd simple-project-management-tool
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or:

```bash
yarn install
```

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
# Local Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dowinnsys Backend API Base URL
Sent via Discord
```

> **Note:** Production backend credentials and any additional environment secrets are provided separately via Discord.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Initialization

To bootstrap the application with the predefined demo dataset, use the initialization endpoint.

**Local**
```
http://localhost:3000/api/init
```

**Production**
```
https://simple-project-management-tool-beryl.vercel.app/api/init
```

**cURL**
```bash
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "demo_user",
    "email": "demo@example.com",
    "password": "Password123!"
  }'
```

---

## ⚠️ Known Issues & Technical Considerations

### First-Time Account Project Creation

When a newly registered user creates their first project, the project may be successfully created on the backend but may not immediately appear as the active project.

This is caused by asynchronous synchronization between the newly created member ID and the project ownership data returned by the Dowinnsys API.

**Workaround:** Select the project from the sidebar/project switcher or refresh the page.

### No Backend Delete Endpoints

The provided Dowinnsys API does not expose:
- `delete_task`
- `delete_project`

Because deletion cannot be safely synchronized with the provided backend API, delete functionality has been omitted from the UI.

### `dueDate` Field

The current Dowinnsys task endpoints:
- `/test03/create_task`
- `/test03/patch_task`

support task:
- Name
- Status
- Contents

A `dueDate` field is not currently persisted by the backend.

The application therefore uses `created_at` timestamps and status history for task tracking.

---

## 📏 Input Validation

The application enforces character limits to maintain consistent layouts across the Kanban and table views.

| Field | Maximum |
|---|---|
| Project title | 100 characters |
| Task title | 100 characters |
| Project description | 500 characters |
| Task description | 500 characters |

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates the optimized production build |
| `npm run start` | Runs the production server |
| `npm run lint` | Runs ESLint |

---

## 🚀 Deployment

The application is deployed using [Vercel](https://vercel.com/).

The production build is generated using:

```bash
npm run build
```

### Required Environment Variables

Configure the following variables in the Vercel project settings:

```env
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_BACKEND_API_URL= Sent via Discord
```

> Production credentials and secrets should be configured through Vercel Environment Variables and should never be committed to the repository.

---

## 📌 Project Highlights

This project demonstrates practical experience with:

- Full-stack TypeScript development
- Next.js App Router
- Serverless API architecture
- Hono REST APIs
- Type-safe Hono RPC
- Zod runtime validation
- Secure cookie-based authentication
- TanStack React Query
- Optimistic UI updates
- Background polling
- Drag-and-drop interfaces
- URL query-state management
- Audit logging
- Responsive UI development
- Vercel deployment

---

## 📄 License

This project was created for educational, assessment, demonstration, and portfolio purposes.
