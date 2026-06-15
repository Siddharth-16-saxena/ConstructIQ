# ConstructIQ

ConstructIQ is a smart construction operations platform designed for mid-market project control. It integrates real-time IoT sensor telemetry, predictive delay schedule simulation, and financial ROI estimation into a single, unified interface.

The application is built using a modern full-stack architecture with a **React (Vite)** frontend, an **Express.js** API server, and a persistent **SQLite** database.

---

## 🏗️ Architecture & Tech Stack

ConstructIQ uses a modular, decoupled design with a development proxy to coordinate communication.

```
┌────────────────────────────────────────────────────────┐
│                   REACT FRONTEND (Vite)                │
│   - What-If Timeline Simulator   - IoT Alerts Feed     │
│   - ROI Savings Calculator       - Inquiry Form        │
└───────────┬──────────────────────────────────▲─────────┘
            │ API Requests (/api/*)            │ State Updates
            ▼                                  │
┌────────────────────────────────────────────────────────┐
│                   EXPRESS API SERVER                   │
│   - Port 5000                    - REST Endpoints      │
└───────────┬──────────────────────────────────▲─────────┘
            │ SQL Queries                      │ Row Results
            ▼                                  │
┌────────────────────────────────────────────────────────┐
│                    SQLITE DATABASE                     │
│   - Table: tasks                 - Table: alerts       │
│   - Table: contact_submissions   - Table: roi_scenarios│
└────────────────────────────────────────────────────────┘
```

### Stack Components
- **Frontend**: React 19, Vite, Vanilla CSS (with premium dark/light mode, custom range sliders, and animated Gantt timeline bars).
- **Icons**: Lucide React.
- **Backend**: Node.js, Express.js, CORS.
- **Database**: SQLite (via `sqlite3` driver).

---

## 🌟 Key Features

1. **What-If Delay Sandbox (Gantt Chart)**
   - Sliders to adjust environmental factors: Weather Severity (Rain/Wind), Supply Chain Congestion, and Labor Shortage.
   - Instantly calculates project delay (days) and budget impact ($1,500 daily overhead + labor overtime escalation).
   - Gantt timeline updates live with orange transition bars showing the extended duration.

2. **IoT Sensor Alerts Control Center**
   - Live simulated feed of warnings (e.g. Crane wind-speed safety, Concrete moisture levels, Temperature warnings).
   - Resolve button connects directly to the SQLite backend database, updating status to `Resolved` and updating the active alert count.

3. **Return on Investment (ROI) Calculator**
   - Slide controls for Project Budget, Expected Months of Delay, and Loaded Hourly Labor Rate.
   - Computes yearly savings by using ConstructIQ's automated delay mitigation algorithms.
   - Form to name and persist the ROI scenario into the database.

4. **Project Showcase & Services Grid**
   - Layout inspired by the **Jhontraktor** Figma design system, featuring categorized portfolio items and clean grid components.

5. **SQLite Persistent Contact Form**
   - Submits client inquiries directly to the Express server, logging name, email, phone, requested service, and message.

---

## 📂 Database Schema

The SQLite database (`server/database.sqlite`) initializes automatically and contains four tables:

### 1. `tasks`
Stores construction schedule timeline details.
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT) - Task title
- `duration_days` (INTEGER) - Base duration
- `progress` (INTEGER) - Completion %
- `delay_risk` (TEXT) - Risk tier (Low/Medium/High)
- `labor_cost` (REAL)
- `material_cost` (REAL)
- `sequence_order` (INTEGER)

### 2. `alerts`
Stores IoT safety alerts.
- `id` (INTEGER PRIMARY KEY)
- `sensor_type` (TEXT)
- `value` (TEXT)
- `status` (TEXT) - `Active` or `Resolved`
- `message` (TEXT)
- `timestamp` (TEXT)

### 3. `roi_scenarios`
Stores saved calculations from the ROI tuner.
- `id` (INTEGER PRIMARY KEY)
- `scenario_name` (TEXT)
- `project_size` (TEXT)
- `project_budget` (REAL)
- `monthly_delays` (REAL)
- `labor_rate` (REAL)
- `calculated_savings` (REAL)
- `timestamp` (TEXT)

### 4. `contact_submissions`
Logs client contact submissions.
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `service` (TEXT)
- `message` (TEXT)
- `timestamp` (TEXT)

---

## ⚡ API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns all construction tasks, completion stats, and active alert counts. |
| `GET` | `/api/alerts` | Returns the history of all active and resolved IoT alerts. |
| `POST` | `/api/alerts/:id/resolve` | Updates an IoT alert status to `Resolved` in the database. |
| `POST` | `/api/contact` | Saves a new client contact submission. |
| `GET` | `/api/roi` | Retrieves all saved ROI scenario records. |
| `POST` | `/api/roi` | Saves a new ROI scenario calculation. |

---

## 🚀 Running the Project

### 1. Install Dependencies
Ensure you are in the project directory (`D:\projects\ConstructIQ\ConstructIQ`) and run:
```bash
npm install
```

### 2. Run the Express Backend Server
Start the backend API server on port `5000`:
```bash
npm run server
```
*The database file `server/database.sqlite` will be generated and seeded automatically with default records on startup.*

### 3. Run the React Development Server
In a separate terminal window, start the Vite development server:
```bash
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend will proxy all API calls to the Express server.*

### 4. Build for Production
To package the frontend assets and run the application as a single compiled service:
```bash
npm run build
npm start
```
*This compiles the React code to `/dist` and serves the static site and API routes directly from the Express server on port `5000`.*
