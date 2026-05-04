# Weekly Mission Tracker — App Spec

## Overview
A personal productivity app based on the framework from *The 7 Habits of Highly Effective People*. The user defines a personal mission statement, organizes their life into roles, sets weekly goals per role, and creates tasks to achieve each goal.

---

## Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3) — simple, file-based, no infra needed to start
- **Styling:** Tailwind CSS

---

## Core Data Model

### Mission
- Single record per user
- `text` — the user's personal mission statement

### Roles
- `id`, `name`, `description` (optional)
- Examples: Father, Professional, Friend, Self

### Weeks
- `id`, `start_date` (Monday of that week)
- Each week is a snapshot — goals and tasks are scoped to a week

### Goals
- `id`, `week_id`, `role_id`, `text`
- One or more goals per role per week

### Tasks
- `id`, `goal_id`, `text`, `completed` (boolean)
- One or more tasks per goal

---

## User Flows

### 1. Mission Statement
- On first launch, prompt the user to write their mission statement
- Always accessible and editable from a dedicated "Mission" section
- Displayed as a persistent reminder at the top of the weekly view

### 2. Roles Management
- User can create, edit, and delete roles at any time
- Roles are reused across all weeks

### 3. Weekly Planning
- App defaults to the current week on load
- User can navigate to past or future weeks
- For the current week, user selects which roles to set goals for
- Under each role, user adds one or more goals (free text)
- Under each goal, user adds one or more tasks

### 4. Task Execution
- During the week, user checks off tasks as complete
- Progress is visible per goal and per role (e.g. "2/3 tasks done")

### 5. Week Review (optional v1 feature)
- At the end of the week, user can view a summary of completed vs incomplete tasks across all roles

---

## UI Structure

```
App
├── Sidebar
│   ├── Mission (view/edit)
│   ├── Roles (manage)
│   └── Week selector (prev / current / next)
└── Main Panel
    └── Weekly View
        ├── Mission statement (read-only banner)
        ├── Role cards (one per selected role)
        │   ├── Role name
        │   └── Goals
        │       ├── Goal text
        │       └── Tasks (checkbox list)
        └── "+ Add Role to This Week" button
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET/PUT | `/api/mission` | Get or update mission statement |
| GET/POST | `/api/roles` | List or create roles |
| PUT/DELETE | `/api/roles/:id` | Update or delete a role |
| GET/POST | `/api/weeks` | List or create weeks |
| GET | `/api/weeks/:id` | Get a week with all goals and tasks |
| POST | `/api/goals` | Create a goal |
| PUT/DELETE | `/api/goals/:id` | Update or delete a goal |
| POST | `/api/tasks` | Create a task |
| PUT/DELETE | `/api/tasks/:id` | Update (incl. toggle complete) or delete a task |

---

## Build Order (recommended slices)

1. **DB schema + Express setup** — tables, migrations, basic server
2. **Roles API + UI** — CRUD for roles, simple list view
3. **Mission API + UI** — single record, edit in place
4. **Weeks + weekly view scaffold** — week navigation, empty state
5. **Goals + tasks** — add/edit/delete goals and tasks within a week
6. **Task completion** — checkbox toggle, progress indicators
7. **Polish** — empty states, mobile layout, week summary view

---

## Out of Scope (v1)
- User authentication (single-user app to start)
- Recurring tasks
- Notifications or reminders
- Mobile app