# Simple Project Management Tool

A full-stack project and task management web application built as part of the **Developer Assessment Task**. 

This application provides a workspace where teams can manage multi-project workflows, interactively track tasks across a drag-and-drop Kanban board or tabular view, monitor real-time task status transitions through an audit change log, and manage user credentials—all powered by a serverless API layer integrated with the **Dowinnsys Backend API**.

---

## 🚀 Live Demo & Deployed Version

- **Deployed URL (Vercel)**: `https://your-deployed-project-url.vercel.app` *(Replace with your Vercel URL)*
- **Default Test User**:
  - **User ID**: `demo_user`
  - **Password**: `Password123!`

> **Security Note**: Any production API keys, test credentials, and environment secrets are shared securely via **Discord** directly.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **State Management & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) & [`nuqs`](https://nuqs.47ng.com/) (URL query state)
- **Interactive Drag & Drop**: `@hello-pangea/dnd`
- **Icons & Notifications**: `lucide-react`, `sonner` (Toasts)

### **Backend & API Layer**
- **API Framework**: [Hono](https://hono.dev/) with `@hono/zod-validator` (executed serverlessly within Next.js API route handlers)
- **Session Management**: Secure, HTTP-Only Cookie Middleware
- **Type-Safe RPC**: Hono RPC client (`client.api.*`) ensuring end-to-end type safety between backend endpoints and frontend hooks
- **Validation**: [Zod](https://zod.dev/)

---

## ✨ Core Features

1. **Authentication & Profile Management**:
   - Sign up with validation and duplicate username/email prevention.
   - Secure sign-in with HTTP-only session cookies.
   - Profile settings to update registered email and verify/change passwords.

2. **Project Workspace**:
   - Create and update project metadata (Title, Description).
   - Dynamic project switcher and user-isolated workspace views.

3. **Task Management (Multi-View & Drag-and-Drop)**:
   - Create tasks linked to specific projects with title, status, and description/contents.
   - **Interactive Kanban Board**: Move task cards between `Todo`, `In Progress`, and `Done` columns with live optimistic updates.
   - **Table View**: Sortable list with status indicators and creation timestamps.
   - Status and search keyword filtering.

4. **Live Change History & Audit Logs**:
   - Every status transition (via Kanban drag-and-drop or modal updates) automatically generates an audit record.
   - Modal view with real-time polling to display chronological status transitions with color-coded badges.

5. **Database Initialization (Pre-defined Dataset)**:
   - Dedicated endpoint to seed initial members, sample projects, tasks, and historical changelog entries.

---

## 💻 Running the Project Locally

### Prerequisites
- **Node.js**: v18.18.0 or later
- **Package Manager**: npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/simple-project-management-tool.git
cd simple-project-management-tool

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install

### 3. Setup Environment Variables
- ** Create a .env.local file
```env
# Local Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dowinnsys Backend API Base URL
NEXT_PUBLIC_BACKEND_API_URL=https://your-dowinnsys-api-url.com

### 4. Run the Development Server
```bash
npm run dev

- ** Open http://localhost:3000 in your browser to view the application.

🗄️ Database Initialization (Pre-defined Dataset)
To bootstrap the backend database with sample projects, tasks across different statuses, and initial change logs, trigger the initialization endpoint:

Via cURL / POST request:
bash


curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"user_id": "demo_user", "email": "demo@example.com", "password": "Password123!"}'
Or via Browser:
Navigate directly to:

http://localhost:3000/api/init


⚠️ Known Issues & Technical Considerations
First-Time Account Project Creation & Immediate Redirect:

Behavior: When a brand-new user registers and creates their very first project, the project is created successfully on the backend, but the client may not immediately redirect to that specific project view until the user selects it from the switcher or refreshes the page.
Cause: On newly provisioned accounts, the Dowinnsys backend assigns a numeric ID to the member record asynchronously in /test01/get_all_member. Because /test02/create_project accepts a string user_id while project listing filters against both string usernames and numeric IDs, the newly created project may take a moment to synchronize with the cache before the router can resolve the initial active project ID.
Workaround: Selecting the project from the sidebar/switcher or refreshing the page immediately loads the new project and all associated tasks.
No Backend Deletion Endpoints in Dowinnsys API:

The provided Dowinnsys API does not expose delete_task or delete_project endpoints. To maintain data integrity with the backend, deletion options are omitted from the UI.
dueDate Field Omission:

Task creation and update payloads in Dowinnsys API (/test03/create_task and /test03/patch_task) only support name, status, and contents. The UI focuses on task status tracking and uses creation timestamps (created_at) for date references.