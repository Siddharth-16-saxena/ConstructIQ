import { useState, useEffect } from "react";
import {
  Building2,
  ShieldAlert,
  Wrench,
  HardHat,
  Activity,
  Sliders,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Send,
  CheckCircle2,
  Sun,
  Moon,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Info,
  Clock,
  Search,
  FolderOpen,
  ClipboardList
} from "lucide-react";

// Portfolio/Projects list matching JhonTraktor
const initialProjects = [
  {
    id: 1,
    title: "Metropolitan Plaza Phase II",
    category: "commercial",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    stats: "Budget: $18.4M | Completed 14 Days Early"
  },
  {
    id: 2,
    title: "Steel Grid Logistics Hub",
    category: "steel",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    stats: "Budget: $9.2M | 0 Safety Incidents"
  },
  {
    id: 3,
    title: "EcoPower Refinery Depot",
    category: "industrial",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80",
    stats: "Budget: $34.5M | IoT Optimized"
  },
  {
    id: 4,
    title: "Horizon Heights Apartments",
    category: "commercial",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    stats: "Budget: $14.1M | 96% Resource Efficiency"
  }
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [activeTab, setActiveTab] = useState("dashboard");

  // API states
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    activeAlertsCount: 0,
    totalBudget: 4200000,
    projectProgress: 68,
    projectName: "ConstructIQ Plaza Hub",
    location: "Sector 62, Commercial Corridor",
    startDate: "2026-04-01"
  });
  const [alerts, setAlerts] = useState([]);
  const [backendLive, setBackendLive] = useState(false);

  // Sliders for What-If Sandbox
  const [weatherSlider, setWeatherSlider] = useState(0); 
  const [supplyChainSlider, setSupplyChainSlider] = useState(0); 
  const [laborSlider, setLaborSlider] = useState(0); 

  // ROI Calculator states
  const [roiBudget, setRoiBudget] = useState(5000000); 
  const [roiDelayMonths, setRoiDelayMonths] = useState(3); 
  const [roiLaborRate, setRoiLaborRate] = useState(120); 
  const [roiScenarioName, setRoiScenarioName] = useState("");
  const [savedRoiScenarios, setSavedRoiScenarios] = useState([]);

  // Contact Form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactService, setContactService] = useState("industrial");
  const [contactMessage, setContactMessage] = useState("");
  const [formFeedback, setFormFeedback] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Portfolio filter
  const [portfolioFilter, setPortfolioFilter] = useState("all");

  // Fetch Dashboard & Alerts
  const fetchData = async () => {
    try {
      const dashRes = await fetch("/api/dashboard");
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setTasks(dashData.tasks || []);
        setSummary(dashData.summary || {});
        setBackendLive(true);
      }

      const alertsRes = await fetch("/api/alerts");
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData || []);
      }

      const roiRes = await fetch("/api/roi");
      if (roiRes.ok) {
        const roiData = await roiRes.json();
        setSavedRoiScenarios(roiData || []);
      }
    } catch (err) {
      console.warn("Could not connect to backend. Falling back to local data modes.", err);
      setBackendLive(false);
      setTasks([
        { id: 1, name: "Site Prep", duration_days: 12, progress: 100, delay_risk: "Low", labor_cost: 15000, material_cost: 5000, sequence_order: 1 },
        { id: 2, name: "Foundation", duration_days: 18, progress: 100, delay_risk: "Medium", labor_cost: 25000, material_cost: 40000, sequence_order: 2 },
        { id: 3, name: "Framing", duration_days: 22, progress: 60, delay_risk: "High", labor_cost: 35000, material_cost: 85000, sequence_order: 3 },
        { id: 4, name: "Plumbing", duration_days: 15, progress: 10, delay_risk: "Medium", labor_cost: 20000, material_cost: 30000, sequence_order: 4 }
      ]);
      setAlerts([
        { id: 1, sensor_type: "Wind Speed Sensor", value: "25 mph", status: "Active", message: "[Alert] High Wind (25 mph) / Crane 1", timestamp: new Date().toISOString() },
        { id: 2, sensor_type: "Concrete Pour Probes", value: "95°F", status: "Active", message: "[Alert] Temp (95°F) / Concrete Pour", timestamp: new Date().toISOString() },
        { id: 3, sensor_type: "Acoustic Decibel sensor", value: "88dB", status: "Active", message: "[Warning] Noise (88dB) / Site B", timestamp: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ---------------- WHAT-IF CALCULATIONS ----------------
  const weatherDelayMultiplier = 1 + (weatherSlider / 100) * 0.4;
  const supplyChainDelayMultiplier = 1 + (supplyChainSlider / 100) * 0.3;
  const laborDelayMultiplier = 1 + (laborSlider / 100) * 0.2;
  const combinedMultiplier = weatherDelayMultiplier * supplyChainDelayMultiplier * laborDelayMultiplier;

  const baseDuration = 67; // Site Prep (12) + Foundation (18) + Framing (22) + Plumbing (15)
  const simulatedDuration = Math.round(baseDuration * combinedMultiplier);
  const totalDelayDays = simulatedDuration - baseDuration;

  // Budget calculations
  const baseBudget = 4200000; // $4.2M
  const maxBudget = 12000000; // $12M
  const simulatedBudget = Math.min(maxBudget, Math.round(baseBudget + (totalDelayDays * 75000) + (laborSlider * 25000)));

  // ---------------- IoT ALERTS RESOLVING ----------------
  const handleResolveAlert = async (id) => {
    if (backendLive) {
      try {
        const res = await fetch(`/api/alerts/${id}/resolve`, { method: "POST" });
        if (res.ok) {
          setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
          );
          // Sync summary
          const dashRes = await fetch("/api/dashboard");
          if (dashRes.ok) {
            const dashData = await dashRes.json();
            setSummary(dashData.summary || {});
          }
        }
      } catch (err) {
        console.error("Error resolving alert:", err);
      }
    } else {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
      );
    }
  };

  // ---------------- CONTACT FORM SUBMISSION ----------------
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormFeedback(null);

    const payload = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      service: contactService,
      message: contactMessage
    };

    if (backendLive) {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setFormFeedback({ type: "success", text: data.message });
          setContactName("");
          setContactEmail("");
          setContactPhone("");
          setContactMessage("");
        } else {
          setFormFeedback({ type: "error", text: data.error || "Something went wrong." });
        }
      } catch (err) {
        setFormFeedback({ type: "error", text: "Connection error. Could not reach server." });
      }
    } else {
      setTimeout(() => {
        setFormFeedback({
          type: "success",
          text: "Mock Successful! Inquiry logged in SQLite backend simulated."
        });
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
      }, 800);
    }
    setFormSubmitting(false);
  };

  // ---------------- ROI CALCULATOR SAVING ----------------
  const calculatedSavings = Math.round(roiBudget * 0.015 * roiDelayMonths + roiLaborRate * 8 * 22 * roiDelayMonths * 0.25);

  const handleSaveRoiScenario = async (e) => {
    e.preventDefault();
    if (!roiScenarioName.trim()) return;

    const payload = {
      scenario_name: roiScenarioName,
      project_size: "Custom",
      project_budget: roiBudget,
      monthly_delays: roiDelayMonths,
      labor_rate: roiLaborRate,
      calculated_savings: calculatedSavings
    };

    if (backendLive) {
      try {
        const res = await fetch("/api/roi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setSavedRoiScenarios(data.scenarios || []);
          setRoiScenarioName("");
        }
      } catch (err) {
        console.error("Error saving ROI scenario:", err);
      }
    } else {
      setSavedRoiScenarios((prev) => [
        {
          id: Date.now(),
          scenario_name: roiScenarioName,
          project_budget: roiBudget,
          monthly_delays: roiDelayMonths,
          labor_rate: roiLaborRate,
          calculated_savings: calculatedSavings,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      setRoiScenarioName("");
    }
  };

  const handleResetSliders = () => {
    setWeatherSlider(0);
    setSupplyChainSlider(0);
    setLaborSlider(0);
  };

  const filteredProjects = initialProjects.filter(
    (p) => portfolioFilter === "all" || p.category === portfolioFilter
  );

  return (
    <div className="app-container">
      {/* ----------------- TOP NAVBAR (Refined to match layout reference) ----------------- */}
      <header className="navbar">
        <div className="navbar-logo">
          {/* Hexagonal yellow logo */}
          <div className="logo-hex">
            <svg viewBox="0 0 100 100" className="hex-svg">
              <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#f59e0b" />
              <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#0a0e17" />
              <path d="M40 35 L65 35 L45 65 L60 65" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="logo-text uppercase">Construct<span className="logo-accent">IQ</span></span>
        </div>
        
        {/* Navigation Tabs matches 2nd image */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button 
            onClick={() => { setActiveTab("dashboard"); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className={`nav-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          >
            Dashboard
          </button>
          <a href="#portfolio" className="nav-tab-btn" onClick={() => setActiveTab("projects")}>Projects</a>
          <a href="#services" className="nav-tab-btn" onClick={() => setActiveTab("equipment")}>Equipment</a>
          <a href="#roi" className="nav-tab-btn" onClick={() => setActiveTab("safety")}>Safety</a>
          <a href="#contact" className="nav-tab-btn" onClick={() => setActiveTab("reports")}>Reports</a>
        </nav>

        <div className="navbar-actions">
          {/* Search bar */}
          <div className="search-bar-container">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search..." className="navbar-search" />
          </div>

          {/* User profile */}
          <div className="user-profile">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Alex Rivera" 
              className="user-avatar" 
            />
            <span className="user-name text-small font-highlight">Alex Rivera</span>
          </div>

          {/* Theme & connection */}
          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className={`status-tag ${backendLive ? "live" : "offline"}`} title={backendLive ? "SQLite Database Connected" : "Local Mock Mode"}>
            <span className="status-dot"></span>
          </div>
        </div>
      </header>

      {/* ----------------- CORE DASHBOARD (Matching Image 2 Layout) ----------------- */}
      <main className="dashboard-layout mt-4">
        
        {/* Interactive Sliders embedded at dashboard top for visual sandbox controls */}
        <div className="panel simulation-control-bar mb-4">
          <div className="sim-bar-title">
            <Sliders size={18} className="text-orange" />
            <strong>What-If Sandbox Simulation Controls</strong>
          </div>
          <div className="sim-sliders-horizontal">
            <div className="sim-slider-block">
              <label>Weather Severity: <span className="font-highlight">{weatherSlider}%</span></label>
              <input type="range" min="0" max="100" value={weatherSlider} onChange={(e) => setWeatherSlider(Number(e.target.value))} />
            </div>
            <div className="sim-slider-block">
              <label>Supply Congestion: <span className="font-highlight">{supplyChainSlider}%</span></label>
              <input type="range" min="0" max="100" value={supplyChainSlider} onChange={(e) => setSupplyChainSlider(Number(e.target.value))} />
            </div>
            <div className="sim-slider-block">
              <label>Labor Shortage: <span className="font-highlight">{laborSlider}%</span></label>
              <input type="range" min="0" max="100" value={laborSlider} onChange={(e) => setLaborSlider(Number(e.target.value))} />
            </div>
            <button onClick={handleResetSliders} className="btn btn-outline btn-sm reset-sim-btn">Reset</button>
          </div>
        </div>

        <div className="dashboard-columns">
          
          {/* COLUMN 1: ACTIVE PROJECTS */}
          <section className="panel col-active-projects">
            <div className="panel-header-simple">
              <h3>ACTIVE PROJECTS</h3>
              <span className="threedots">•••</span>
            </div>
            
            <div className="projects-vertical-list">
              <div className="project-list-card">
                <div className="project-card-title">
                  <FolderOpen size={16} className="text-orange" />
                  <strong>Project Alpha</strong>
                </div>
                <div className="progress-details-block">
                  <div className="progress-bar-container-simple">
                    <div className="progress-fill yellow" style={{ width: "55%" }}></div>
                  </div>
                  <div className="progress-row">
                    <span className="percent font-highlight">55%</span>
                    <span className="date font-mono text-small text-muted">Oct 2023 - Mar 2024</span>
                  </div>
                </div>
              </div>

              <div className="project-list-card">
                <div className="project-card-title">
                  <FolderOpen size={16} className="text-orange" />
                  <strong>Project Beta</strong>
                </div>
                <div className="progress-details-block">
                  <div className="progress-bar-container-simple">
                    <div className="progress-fill orange" style={{ width: "82%" }}></div>
                  </div>
                  <div className="progress-row">
                    <span className="percent font-highlight">82%</span>
                    <span className="date font-mono text-small text-muted">Nov 2023 - Jun 2024</span>
                  </div>
                </div>
              </div>

              <div className="project-list-card">
                <div className="project-card-title">
                  <FolderOpen size={16} className="text-orange" />
                  <strong>Project Gamma</strong>
                </div>
                <div className="progress-details-block">
                  <div className="progress-bar-container-simple">
                    <div className="progress-fill yellow" style={{ width: "30%" }}></div>
                  </div>
                  <div className="progress-row">
                    <span className="percent font-highlight">30%</span>
                    <span className="date font-mono text-small text-muted">Jan 2024 - Sep 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-indicators">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </section>

          {/* COLUMN 2: GANTT CHART TIMELINE */}
          <section className="panel col-gantt-chart">
            <div className="panel-header-simple">
              <h3>GANTT CHART TIMELINE</h3>
              <span className="threedots">•••</span>
            </div>

            {/* Gantt Chart Grid Area */}
            <div className="gantt-wrapper">
              <div className="gantt-months-header">
                <div className="gantt-empty-header">Key Tasks</div>
                <div className="gantt-month-ticks">
                  <div className="month-label text-center">OCT 2023</div>
                  <div className="month-label text-center">NOV 2023</div>
                  <div className="month-label text-center">DEC 2023</div>
                </div>
              </div>

              <div className="gantt-weeks-header">
                <div className="gantt-empty-header"></div>
                <div className="gantt-week-ticks font-mono text-small">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                  <span>11</span><span>12</span>
                </div>
              </div>

              {/* Gantt Rows & SVG overlays */}
              <div className="gantt-rows-container">
                
                {/* SVG Dependency Lines overlay */}
                <svg className="gantt-svg-overlay" xmlns="http://www.w3.org/2000/svg">
                  {/* Arrow marker */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  {/* Line 1: Foundation to Framing */}
                  <path d="M 320 28 L 340 28 L 340 68 L 365 68" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                  {/* Line 2: Framing to Milestones */}
                  <path d="M 500 68 L 540 68 L 540 180 L 590 180" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                </svg>

                {/* Row 1: Foundation */}
                <div className="gantt-row-simple">
                  <div className="gantt-task-label">
                    <span className="task-name">Foundation</span>
                    <span className="task-status">Complete</span>
                  </div>
                  <div className="gantt-bar-track">
                    <div 
                      className="gantt-bar-fill yellow-glow" 
                      style={{ 
                        left: "5%", 
                        width: `${Math.min(90, 32 * weatherDelayMultiplier)}%` 
                      }}
                    >
                      <span className="bar-percentage">100%</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Framing */}
                <div className="gantt-row-simple">
                  <div className="gantt-task-label">
                    <span className="task-name">Framing</span>
                    <span className="task-status text-orange">Active</span>
                  </div>
                  <div className="gantt-bar-track">
                    <div 
                      className="gantt-bar-fill orange-glow" 
                      style={{ 
                        left: `${Math.min(80, 35 * weatherDelayMultiplier)}%`, 
                        width: `${Math.min(60, 30 * supplyChainDelayMultiplier)}%` 
                      }}
                    >
                      <span className="bar-percentage">60%</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Plumbing */}
                <div className="gantt-row-simple">
                  <div className="gantt-task-label">
                    <span className="task-name">Plumbing</span>
                    <span className="task-status">Upcoming</span>
                  </div>
                  <div className="gantt-bar-track">
                    <div 
                      className="gantt-bar-fill beige-glow" 
                      style={{ 
                        left: `${Math.min(85, 65 * combinedMultiplier)}%`, 
                        width: `${Math.min(25, 10 * laborDelayMultiplier)}%` 
                      }}
                    >
                      <span className="bar-percentage">10%</span>
                    </div>
                  </div>
                </div>

                {/* Row 4: Site Prep */}
                <div className="gantt-row-simple">
                  <div className="gantt-task-label">
                    <span className="task-name">Site Prep</span>
                    <span className="task-status">Complete</span>
                  </div>
                  <div className="gantt-bar-track">
                    <div className="gantt-bar-fill yellow-glow" style={{ left: "1%", width: "15%" }}>
                      <span className="bar-percentage">100%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Milestones bar */}
              <div className="gantt-milestones-row">
                <div className="milestones-label">Milestones</div>
                <div className="milestones-ticks-container">
                  {/* Milestone 1 */}
                  <div className="milestone-marker" style={{ left: `${Math.min(90, 35 * weatherDelayMultiplier)}%` }}>
                    <div className="milestone-triangle yellow"></div>
                    <span className="milestone-text font-highlight text-small">Site Complete</span>
                  </div>

                  {/* Milestone 2 */}
                  <div className="milestone-marker" style={{ left: `${Math.min(95, 75 * combinedMultiplier)}%` }}>
                    <div className="milestone-triangle white"></div>
                    <span className="milestone-text font-highlight text-small">Phase 1 End</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-indicators">
              <span className="dot"></span>
              <span className="dot active"></span>
              <span className="dot"></span>
            </div>
          </section>

          {/* COLUMN 3: LIVE IOT SENSOR ALERTS */}
          <section className="panel col-iot-alerts">
            <div className="panel-header-simple">
              <h3>LIVE IOT SENSOR ALERTS</h3>
              <span className="threedots">•••</span>
            </div>

            <span className="text-small text-muted mb-2 block-desc">Real-time feed with alerts:</span>
            
            <div className="alerts-vertical-list">
              {alerts.length === 0 ? (
                <p className="no-data">No alerts logged in the database.</p>
              ) : (
                alerts.map((alert) => {
                  let alertClass = "warning-yellow";
                  if (alert.sensor_type.includes("Wind") || alert.sensor_type.includes("Concrete")) {
                    alertClass = "alert-orange";
                  }
                  if (alert.status === "Resolved") {
                    alertClass = "alert-resolved-muted";
                  }

                  return (
                    <div key={alert.id} className={`live-alert-card ${alertClass}`}>
                      <div className="alert-card-top-row">
                        <div className="alert-title-box">
                          <AlertTriangle size={14} className="alert-triangle-icon" />
                          <span className="alert-label font-highlight">
                            {alert.status === "Resolved" ? "[RESOLVED]" : alertClass === "alert-orange" ? "[Alert] High" : "[Warning] Info"}
                          </span>
                        </div>
                        <span className="alert-time-badge font-mono">12:31 PM</span>
                      </div>
                      
                      <div className="alert-msg-row">
                        <strong>{alert.sensor_type}: {alert.value}</strong>
                        <p className="alert-message-text">{alert.message}</p>
                      </div>

                      {alert.status === "Active" && (
                        <button 
                          onClick={() => handleResolveAlert(alert.id)}
                          className="btn-resolve-link font-highlight"
                        >
                          Resolve Incident →
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="carousel-indicators mt-4">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </section>

        </div>

        {/* BOTTOM ROW: PROJECT STATUS (6 Metrics columns) */}
        <section className="dashboard-status-row panel mt-4">
          <div className="panel-header-simple full-width-header">
            <h3>PROJECT STATUS</h3>
            <span className="threedots">•••</span>
          </div>

          <div className="status-metrics-grid">
            <div className="status-metric-item">
              <div className="metric-icon-circle">
                <FolderOpen size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Active Projects:</span>
                <strong className="metric-val">4</strong>
              </div>
            </div>

            <div className="status-metric-item">
              <div className="metric-icon-circle">
                <ClipboardList size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Work Orders:</span>
                <strong className="metric-val">29</strong>
              </div>
            </div>

            <div className="status-metric-item">
              <div className="metric-icon-circle accent-red">
                <AlertTriangle size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Issues:</span>
                <strong className="metric-val text-red">{alerts.filter(a => a.status === 'Active').length} Active</strong>
              </div>
            </div>

            <div className="status-metric-item">
              <div className="metric-icon-circle">
                <DollarSign size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Budget:</span>
                <strong className="metric-val">
                  ${(simulatedBudget / 1000000).toFixed(1)}M / ${(maxBudget / 1000000).toFixed(0)}M
                </strong>
              </div>
            </div>

            <div className="status-metric-item">
              <div className="metric-icon-circle accent-green">
                <Calendar size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Schedule:</span>
                <strong className={`metric-val ${totalDelayDays > 0 ? "text-orange" : "text-green"}`}>
                  {totalDelayDays > 0 ? `DELAYED (+${totalDelayDays}d)` : "ON TRACK"}
                </strong>
              </div>
            </div>

            <div className="status-metric-item">
              <div className="metric-icon-circle accent-yellow">
                <ShieldAlert size={16} />
              </div>
              <div className="metric-texts">
                <span className="metric-label">[Safety Incidents:</span>
                <div className="metric-val flex-badge">
                  <span className="safety-zero-badge">0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ----------------- SERVICES SECTION ----------------- */}
      <section id="services" className="services-section section-padding">
        <div className="section-header text-center">
          <span className="kicker text-center">What We Construct</span>
          <h2>Our Core Specializations</h2>
          <p className="header-paragraph mx-auto">
            ConstructIQ builds and manages high-spec industrial, mechanical, and commercial infrastructure projects. We back every project with data-driven progress reporting.
          </p>
        </div>

        <div className="services-grid">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div key={srv.id} className="service-card card-gradient">
                <div className="service-icon-box">
                  <Icon size={24} className="service-icon" />
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- PORTFOLIO SECTION ----------------- */}
      <section id="portfolio" className="portfolio-section section-padding bg-tint">
        <div className="section-header">
          <span className="kicker">Completed Projects</span>
          <h2>Showcase Gallery</h2>
          <p className="header-paragraph">
            Review some of our high-performing construction contracts. Filter below to see how our engineering standards match specific industrial sectors.
          </p>
        </div>

        {/* Categories filters */}
        <div className="portfolio-filters" aria-label="Portfolio Category Filter">
          {["all", "industrial", "steel", "commercial"].map((cat) => (
            <button
              key={cat}
              onClick={() => setPortfolioFilter(cat)}
              className={`filter-btn ${portfolioFilter === cat ? "active" : ""}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredProjects.map((p) => (
            <article key={p.id} className="project-card">
              <div className="project-image-box">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="project-badge-cat font-mono">{p.category}</span>
              </div>
              <div className="project-details">
                <h4>{p.title}</h4>
                <p className="project-stats text-small text-muted font-mono">{p.stats}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------- ROI SAVINGS CALCULATOR ----------------- */}
      <section id="roi" className="roi-section section-padding">
        <div className="section-header">
          <span className="kicker">Calculate Your Savings</span>
          <h2>Return on Investment Calculator</h2>
          <p className="header-paragraph">
            See how much you can save with ConstructIQ's automated delay protection. Adjust sliders below and persist your scenarios to the SQLite database.
          </p>
        </div>

        <div className="roi-grid">
          {/* ROI Calculator Inputs */}
          <div className="panel roi-calc-card">
            <h3 className="panel-title">
              <DollarSign size={18} />
              ROI Parameter Tuner
            </h3>

            <div className="slider-group">
              <div className="slider-label">
                <span>Estimated Project Budget</span>
                <span className="slider-value font-highlight">${(roiBudget / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="500000"
                value={roiBudget}
                onChange={(e) => setRoiBudget(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">Total scope cost of your project.</span>
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Expected Monthly Delays</span>
                <span className="slider-value font-highlight">{roiDelayMonths} Months</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={roiDelayMonths}
                onChange={(e) => setRoiDelayMonths(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">Average total months lost to schedule slips without ConstructIQ.</span>
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Average On-Site Labor Rate</span>
                <span className="slider-value font-highlight">${roiLaborRate}/hr</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                value={roiLaborRate}
                onChange={(e) => setRoiLaborRate(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">Average contractor loaded hourly wage on-site.</span>
            </div>

            {/* Save Form */}
            <form onSubmit={handleSaveRoiScenario} className="roi-save-form mt-4">
              <div className="form-group-inline">
                <input
                  type="text"
                  placeholder="Scenario Name (e.g. Metro Depot)"
                  value={roiScenarioName}
                  onChange={(e) => setRoiScenarioName(e.target.value)}
                  className="form-input text-input"
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Save ROI Result
                </button>
              </div>
            </form>
          </div>

          {/* ROI Results Display */}
          <div className="panel roi-result-card">
            <h3 className="panel-title">
              <TrendingUp size={18} />
              Calculated Platform Savings
            </h3>

            <div className="savings-display text-center my-4">
              <span className="savings-label">ESTIMATED YEARLY SAVINGS</span>
              <h4 className="savings-value font-highlight text-green">
                ${calculatedSavings.toLocaleString()}
              </h4>
              <p className="savings-note text-small text-muted">
                Assumes a 40% reduction in delay overhead & 15% labor overtime reduction.
              </p>
            </div>

            {/* List of saved scenarios */}
            <div className="saved-roi-list-container">
              <h5 className="text-small uppercase text-muted mb-2 font-mono">Saved Database Scenarios ({savedRoiScenarios.length})</h5>
              <div className="saved-roi-list">
                {savedRoiScenarios.length === 0 ? (
                  <p className="text-small text-muted font-mono italic">No saved calculations yet.</p>
                ) : (
                  savedRoiScenarios.map((scen) => (
                    <div key={scen.id} className="saved-scen-item font-mono text-small">
                      <span className="scen-name bold">{scen.scenario_name}</span>
                      <span className="scen-budget">Budget: ${(scen.project_budget / 1000000).toFixed(1)}M</span>
                      <span className="scen-saving text-green">${Number(scen.calculated_savings).toLocaleString()} saved</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CONTACT FORM SECTION ----------------- */}
      <section id="contact" className="contact-section section-padding bg-tint">
        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-info-panel">
            <span className="kicker">Get in Touch</span>
            <h2>Start Your Smart Infrastructure Journey</h2>
            <p className="contact-info-paragraph">
              Want a custom deployment of IoT sensors on your next project? Drop us a line. All submissions are processed and saved directly into the SQLite database.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <MapPin className="contact-icon accent" size={20} />
                <div>
                  <strong>Headquarters</strong>
                  <p>18 Office Park, Floor 10, Jakarta / Sector 62, Commercial Corridor</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <Phone className="contact-icon accent" size={20} />
                <div>
                  <strong>Direct Inquiries</strong>
                  <p>+1-800-555-BILD / +62 21-8888-999</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <Mail className="contact-icon accent" size={20} />
                <div>
                  <strong>E-mail Support</strong>
                  <p>support@constructiq.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="panel contact-form-card">
            <h3 className="panel-title">
              <Send size={18} />
              Submit Project Inquiry
            </h3>

            {formFeedback && (
              <div className={`form-feedback ${formFeedback.type}`}>
                {formFeedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{formFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label text-small">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                  className="form-input text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label text-small">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="form-input text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label text-small">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="form-input text-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service" className="form-label text-small">Requested Service *</label>
                <select
                  id="service"
                  value={contactService}
                  onChange={(e) => setContactService(e.target.value)}
                  className="form-input select-input"
                >
                  <option value="industrial">Industrial Construction</option>
                  <option value="steel">Structural Steel Framing</option>
                  <option value="mechanical">Mechanical & Electrical (MEP)</option>
                  <option value="commercial">Commercial & Residential</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label text-small">Project Message *</label>
                <textarea
                  id="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your project size, location, and timeline..."
                  rows="4"
                  className="form-input textarea-input"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="btn btn-primary width-full mt-4"
              >
                {formSubmitting ? "Submitting to DB..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-hex">
              <svg viewBox="0 0 100 100" className="hex-svg">
                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#f59e0b" />
                <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#0a0e17" />
                <path d="M40 35 L65 35 L45 65 L60 65" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <span className="logo-text">Construct<span className="logo-accent">IQ</span></span>
          </div>
          <p className="footer-tagline">Integrated Construction Operations & Predictive Schedule Intelligence</p>
        </div>
        <div className="footer-bottom text-small text-muted">
          <span>&copy; 2026 ConstructIQ Inc. All rights reserved. Persistent SQLite backend loaded.</span>
          <a href="#" className="back-top-link">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
