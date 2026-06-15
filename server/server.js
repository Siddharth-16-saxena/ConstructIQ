import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from Vite build in production (optional, dev uses proxy)
app.use(express.static(path.join(__dirname, "../dist")));

// Initialize SQLite database
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
    initializeDatabase();
  }
});

// Helper functions to wrap sqlite3 with promises
function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Database Initialization & Seeding
async function initializeDatabase() {
  try {
    // Tasks table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        duration_days INTEGER NOT NULL,
        progress INTEGER NOT NULL,
        delay_risk TEXT NOT NULL,
        labor_cost REAL NOT NULL,
        material_cost REAL NOT NULL,
        sequence_order INTEGER NOT NULL
      )
    `);

    // IoT Alerts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_type TEXT NOT NULL,
        value TEXT NOT NULL,
        status TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    `);

    // Contact Submissions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    `);

    // ROI Saved Scenarios table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS roi_scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scenario_name TEXT NOT NULL,
        project_size TEXT NOT NULL,
        project_budget REAL NOT NULL,
        monthly_delays REAL NOT NULL,
        labor_rate REAL NOT NULL,
        calculated_savings REAL NOT NULL,
        timestamp TEXT NOT NULL
      )
    `);

    // Seed default tasks if empty
    const tasksCount = await dbGet("SELECT COUNT(*) as count FROM tasks");
    if (tasksCount.count === 0) {
      const defaultTasks = [
        ["Site Excavation & Grading", 10, 100, "Low", 15000, 5000, 1],
        ["Foundation & Concrete Pouring", 15, 80, "Medium", 25000, 40000, 2],
        ["Structural Steel Framing", 20, 45, "High", 35000, 85000, 3],
        ["Roofing & Exterior Cladding", 12, 0, "Medium", 20000, 30000, 4],
        ["HVAC & Electrical Rough-Ins", 18, 0, "Medium", 30000, 25000, 5],
        ["Interior Finishes & Painting", 14, 0, "Low", 18000, 12000, 6]
      ];

      for (const t of defaultTasks) {
        await dbRun(
          "INSERT INTO tasks (name, duration_days, progress, delay_risk, labor_cost, material_cost, sequence_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
          t
        );
      }
      console.log("Seeded default tasks.");
    }

    // Seed default alerts if empty
    const alertsCount = await dbGet("SELECT COUNT(*) as count FROM alerts");
    if (alertsCount.count === 0) {
      const now = new Date();
      const defaultAlerts = [
        [
          "Wind Speed Sensor",
          "42 mph",
          "Active",
          "Crane wind speed registered at 42 mph. Recommended safety limit is 35 mph. Operations suspended.",
          new Date(now - 1000 * 60 * 15).toISOString() // 15 mins ago
        ],
        [
          "Concrete Moisture Sensor",
          "88% RH",
          "Active",
          "Concrete slab Section B moisture level is 88%. Flooring application requires moisture level < 75%.",
          new Date(now - 1000 * 60 * 45).toISOString() // 45 mins ago
        ],
        [
          "Supply Chain",
          "Steel shipment delay",
          "Active",
          "Structural Steel shipment is delayed by 4 days due to port customs clearance congestion.",
          new Date(now - 1000 * 60 * 120).toISOString() // 2 hours ago
        ],
        [
          "Temperature Sensor",
          "31°F",
          "Active",
          "Ambient temperature dropped below freezing (31°F) during concrete curing. Blankets activated.",
          new Date(now - 1000 * 60 * 240).toISOString() // 4 hours ago
        ]
      ];

      for (const a of defaultAlerts) {
        await dbRun(
          "INSERT INTO alerts (sensor_type, value, status, message, timestamp) VALUES (?, ?, ?, ?, ?)",
          a
        );
      }
      console.log("Seeded default IoT alerts.");
    }

  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
}

// REST API Endpoints

// 1. Dashboard data
app.get("/api/dashboard", async (req, res) => {
  try {
    const tasks = await dbAll("SELECT * FROM tasks ORDER BY sequence_order ASC");
    const activeAlerts = await dbGet("SELECT COUNT(*) as count FROM alerts WHERE status = 'Active'");
    const totalBudgetResult = await dbGet("SELECT SUM(labor_cost + material_cost) as total FROM tasks");
    
    // Calculate progress
    let totalProgress = 0;
    if (tasks.length > 0) {
      const sum = tasks.reduce((acc, t) => acc + t.progress, 0);
      totalProgress = Math.round(sum / tasks.length);
    }

    res.json({
      tasks,
      summary: {
        activeAlertsCount: activeAlerts.count,
        totalBudget: totalBudgetResult.total || 0,
        projectProgress: totalProgress,
        projectName: "ConstructIQ Plaza Hub",
        location: "Sector 62, Commercial Corridor",
        startDate: "2026-04-01"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await dbAll("SELECT * FROM alerts ORDER BY timestamp DESC");
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Resolve an alert
app.post("/api/alerts/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun(
      "UPDATE alerts SET status = 'Resolved' WHERE id = ?",
      [id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }
    const updatedAlert = await dbGet("SELECT * FROM alerts WHERE id = ?", [id]);
    res.json({ success: true, alert: updatedAlert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Contact Form Submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    if (!name || !email || !service || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const timestamp = new Date().toISOString();
    await dbRun(
      "INSERT INTO contact_submissions (name, email, phone, service, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone || "", service, message, timestamp]
    );

    res.json({ success: true, message: "Thank you! Your submission has been saved to the database." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get saved ROI scenarios
app.get("/api/roi", async (req, res) => {
  try {
    const scenarios = await dbAll("SELECT * FROM roi_scenarios ORDER BY timestamp DESC");
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Save ROI scenario
app.post("/api/roi", async (req, res) => {
  try {
    const { scenario_name, project_size, project_budget, monthly_delays, labor_rate, calculated_savings } = req.body;
    
    if (!scenario_name || !project_budget || monthly_delays === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const timestamp = new Date().toISOString();
    await dbRun(
      "INSERT INTO roi_scenarios (scenario_name, project_size, project_budget, monthly_delays, labor_rate, calculated_savings, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [scenario_name, project_size || "Medium", project_budget, monthly_delays, labor_rate || 120, calculated_savings, timestamp]
    );

    const saved = await dbAll("SELECT * FROM roi_scenarios ORDER BY timestamp DESC");
    res.json({ success: true, scenarios: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For any other GET request, serve the index.html file in production
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
