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
  Clock
} from "lucide-react";

// Default services matching Jhontraktor structure
const servicesList = [
  {
    id: "industrial",
    icon: Building2,
    title: "Industrial Construction",
    desc: "Heavy-duty manufacturing plants, distribution warehouses, and advanced logistical hubs engineered for extreme load capacities."
  },
  {
    id: "steel",
    icon: HardHat,
    title: "Structural Steel Framing",
    desc: "Precision steel fabrication, erection, and column layout alignment designed to withstand seismic and structural stresses."
  },
  {
    id: "mechanical",
    icon: Wrench,
    title: "Mechanical & Electrical",
    desc: "Complex MEP systems, HVAC duct routing, power substation integration, and high-efficiency smart lighting networks."
  },
  {
    id: "commercial",
    icon: Activity,
    title: "Commercial & Residential",
    desc: "Premium mid-rise corporate office towers, retail developments, and high-end residential housing spaces."
  }
];

// Default projects list
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
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // API states
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    activeAlertsCount: 0,
    totalBudget: 0,
    projectProgress: 0,
    projectName: "ConstructIQ Plaza Hub",
    location: "Sector 62, Commercial Corridor",
    startDate: "2026-04-01"
  });
  const [alerts, setAlerts] = useState([]);
  const [backendLive, setBackendLive] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);

  // Sliders for What-If Sandbox
  const [weatherSlider, setWeatherSlider] = useState(0); // 0 to 100
  const [supplyChainSlider, setSupplyChainSlider] = useState(0); // 0 to 100
  const [laborSlider, setLaborSlider] = useState(0); // 0 to 100

  // State to save current scenario
  const [scenarioNameInput, setScenarioNameInput] = useState("");
  const [showScenarioModal, setShowScenarioModal] = useState(false);

  // ROI Calculator states
  const [roiBudget, setRoiBudget] = useState(5000000); // 1M to 50M
  const [roiDelayMonths, setRoiDelayMonths] = useState(3); // 1 to 12
  const [roiLaborRate, setRoiLaborRate] = useState(120); // 50 to 250
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
      // Fetch Dashboard details
      const dashRes = await fetch("/api/dashboard");
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setTasks(dashData.tasks || []);
        setSummary(dashData.summary || {});
        setBackendLive(true);
      }

      // Fetch IoT alerts
      const alertsRes = await fetch("/api/alerts");
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData || []);
      }

      // Fetch saved ROI scenarios
      const roiRes = await fetch("/api/roi");
      if (roiRes.ok) {
        const roiData = await roiRes.json();
        setSavedRoiScenarios(roiData || []);
      }
    } catch (err) {
      console.warn("Could not connect to backend. Falling back to local data modes.", err);
      setBackendLive(false);
      // Fallback local tasks
      setTasks([
        { id: 1, name: "Site Excavation & Grading", duration_days: 10, progress: 100, delay_risk: "Low", labor_cost: 15000, material_cost: 5000, sequence_order: 1 },
        { id: 2, name: "Foundation & Concrete Pouring", duration_days: 15, progress: 80, delay_risk: "Medium", labor_cost: 25000, material_cost: 40000, sequence_order: 2 },
        { id: 3, name: "Structural Steel Framing", duration_days: 20, progress: 45, delay_risk: "High", labor_cost: 35000, material_cost: 85000, sequence_order: 3 },
        { id: 4, name: "Roofing & Exterior Cladding", duration_days: 12, progress: 0, delay_risk: "Medium", labor_cost: 20000, material_cost: 30000, sequence_order: 4 },
        { id: 5, name: "HVAC & Electrical Rough-Ins", duration_days: 18, progress: 0, delay_risk: "Medium", labor_cost: 30000, material_cost: 25000, sequence_order: 5 },
        { id: 6, name: "Interior Finishes & Painting", duration_days: 14, progress: 0, delay_risk: "Low", labor_cost: 18000, material_cost: 12000, sequence_order: 6 }
      ]);
      setAlerts([
        { id: 1, sensor_type: "Wind Speed Sensor", value: "42 mph", status: "Active", message: "Crane wind speed registered at 42 mph. Recommended safety limit is 35 mph. Operations suspended.", timestamp: new Date().toISOString() },
        { id: 2, sensor_type: "Concrete Moisture Sensor", value: "88% RH", status: "Active", message: "Concrete slab Section B moisture level is 88%. Flooring application requires moisture level < 75%.", timestamp: new Date().toISOString() },
        { id: 3, sensor_type: "Supply Chain", value: "Steel shipment delay", status: "Active", message: "Structural Steel shipment is delayed by 4 days due to port customs clearance congestion.", timestamp: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set html document attribute for theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ---------------- WHAT-IF CALCULATIONS ----------------
  // Calculate delay factors based on sliders
  const weatherDelayMultiplier = 1 + (weatherSlider / 100) * 0.5; // Up to 50% increase
  const supplyChainDelayMultiplier = 1 + (supplyChainSlider / 100) * 0.4; // Up to 40% increase
  const laborDelayMultiplier = 1 + (laborSlider / 100) * 0.3; // Up to 30% increase

  const combinedMultiplier = weatherDelayMultiplier * supplyChainDelayMultiplier * laborDelayMultiplier;

  // Calculate simulated project statistics
  const baseDuration = tasks.reduce((acc, t) => acc + t.duration_days, 0);
  const simulatedDuration = Math.round(baseDuration * combinedMultiplier);
  const totalDelayDays = simulatedDuration - baseDuration;

  // Financial impact: $1,250 overhead penalty per day of delay, plus labor escalation cost
  const baseLaborCost = tasks.reduce((acc, t) => acc + t.labor_cost, 0);
  const simulatedLaborCost = baseLaborCost * (1 + (laborSlider / 100) * 0.15) * (simulatedDuration / baseDuration);
  const overheadCostIncrease = totalDelayDays * 1500;
  const totalFinancialImpact = Math.round((simulatedLaborCost - baseLaborCost) + overheadCostIncrease);

  // ---------------- IoT ALERTS RESOLVING ----------------
  const handleResolveAlert = async (id) => {
    if (backendLive) {
      try {
        const res = await fetch(`/api/alerts/${id}/resolve`, { method: "POST" });
        if (res.ok) {
          // Update status locally
          setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
          );
          // Refresh dashboard
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
      // Local resolve fallback
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
          // Reset form
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
      // Mock submit
      setTimeout(() => {
        setFormFeedback({
          type: "success",
          text: "Mock Successful! (Local Mode: Forms will store in database when backend is connected)"
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
  // Saves calculation results to DB
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
      // Local fallback
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

  // Reset Sliders
  const handleResetSliders = () => {
    setWeatherSlider(0);
    setSupplyChainSlider(0);
    setLaborSlider(0);
  };

  // Filters portfolio
  const filteredProjects = initialProjects.filter(
    (p) => portfolioFilter === "all" || p.category === portfolioFilter
  );

  return (
    <div className="app-container">
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="navbar header-slide-in">
        <div className="navbar-logo">
          <div className="logo-box">🏗️</div>
          <span className="logo-text">Construct<span className="logo-accent">IQ</span></span>
        </div>
        
        <nav className="navbar-links" aria-label="Main Navigation">
          <a href="#home">Home</a>
          <a href="#sandbox">Delay Sandbox</a>
          <a href="#alerts">IoT Alerts</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Showcase</a>
          <a href="#roi">ROI Calculator</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-actions">
          {/* Connection status tag */}
          <div className={`status-tag ${backendLive ? "live" : "offline"}`}>
            <span className="status-dot"></span>
            <span>{backendLive ? "DB Connected" : "Local Mock"}</span>
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Next-Generation Construction Intelligence</span>
          <h1 className="hero-title">
            SMART PROJECT CONTROL <br />
            FOR MODERN BUILDERS
          </h1>
          <p className="hero-subtitle">
            ConstructIQ brings blueprints, live IoT environmental sensors, and supply chain logistics together. Track budgets, run what-if delays in our sandbox, and mitigate risk before cranes stop.
          </p>
          <div className="hero-btns">
            <a href="#sandbox" className="btn btn-primary">Launch Sandbox</a>
            <a href="#contact" className="btn btn-outline">Schedule Trial</a>
          </div>
        </div>

        {/* Hero metrics layout */}
        <div className="hero-metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Active Database Status</span>
              <Activity size={16} className="metric-icon accent" />
            </div>
            <span className="metric-value">{backendLive ? "SQLite Live" : "Fallback Local"}</span>
            <span className="metric-desc">Form submissions & alerts persistent</span>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Project Completion</span>
              <Clock size={16} className="metric-icon" />
            </div>
            <span className="metric-value">{summary.projectProgress}%</span>
            <span className="metric-desc">{summary.projectName} progress tracking</span>
          </div>
          <div className="metric-card text-alert">
            <div className="metric-header">
              <span className="metric-title">Live Sensor Alerts</span>
              <ShieldAlert size={16} className="metric-icon" />
            </div>
            <span className="metric-value">{alerts.filter(a => a.status === 'Active').length}</span>
            <span className="metric-desc">Requires immediate on-site attention</span>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Base Project Budget</span>
              <DollarSign size={16} className="metric-icon" />
            </div>
            <span className="metric-value">${(summary.totalBudget / 1000000).toFixed(1)}M</span>
            <span className="metric-desc">Estimated direct tasks sum</span>
          </div>
        </div>
      </section>

      {/* ----------------- WHAT-IF SANDBOX SECTION ----------------- */}
      <section id="sandbox" className="sandbox-section section-padding">
        <div className="section-header">
          <span className="kicker">Real-time Risk Simulator</span>
          <h2>Interactive What-If Delay Sandbox</h2>
          <p className="header-paragraph">
            Simulate delays to project schedules by tweaking external variables. Instantly see visual changes to task schedules, critical path milestones, and overhead financial impact.
          </p>
        </div>

        <div className="sandbox-grid">
          {/* Slider Panel */}
          <div className="panel sliders-panel">
            <h3 className="panel-title">
              <Sliders size={18} />
              Adjust Project Variables
            </h3>
            
            <div className="slider-group">
              <div className="slider-label">
                <span>Weather Severity (Rain/Wind)</span>
                <span className="slider-value font-highlight">{weatherSlider}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weatherSlider}
                onChange={(e) => setWeatherSlider(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">High values block crane lifts and cement drying.</span>
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Supply Chain Port Congestion</span>
                <span className="slider-value font-highlight">{supplyChainSlider}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={supplyChainSlider}
                onChange={(e) => setSupplyChainSlider(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">Port custom clearance delays steel and mechanical fixtures.</span>
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>On-Site Crew Shortage</span>
                <span className="slider-value font-highlight">{laborSlider}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={laborSlider}
                onChange={(e) => setLaborSlider(Number(e.target.value))}
                className="range-input"
              />
              <span className="slider-helper">Sub-contractor shortages delay framing and interior details.</span>
            </div>

            <div className="panel-footer-btn">
              <button onClick={handleResetSliders} className="btn btn-outline btn-sm">
                Reset Simulators
              </button>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="panel results-panel">
            <h3 className="panel-title">
              <TrendingUp size={18} />
              Simulated Schedule & Cost Impacts
            </h3>

            <div className="results-metrics">
              <div className="result-metric">
                <span className="result-metric-label">Schedule Extension</span>
                <div className="result-metric-main font-highlight text-orange">
                  <span>+{totalDelayDays}</span>
                  <small>Days</small>
                </div>
                <span className="result-metric-footer">
                  Project Duration: {simulatedDuration} days (Base: {baseDuration})
                </span>
              </div>

              <div className="result-metric">
                <span className="result-metric-label">Financial Budget Overhead</span>
                <div className="result-metric-main font-highlight text-red">
                  <span>+${totalFinancialImpact.toLocaleString()}</span>
                </div>
                <span className="result-metric-footer">
                  Based on daily site penalties & labor overtime
                </span>
              </div>
            </div>

            <div className="simulation-notice text-small">
              <Info size={14} className="notice-icon" />
              <span>
                Critical Path Alert: {totalDelayDays > 10 ? "Roofing and Mechanical rough-ins have violated their late-start buffer times." : "Schedule delay is within normal contingency buffer."}
              </span>
            </div>
          </div>
        </div>

        {/* Gantt Chart Timeline Visualization */}
        <div className="gantt-container panel">
          <div className="gantt-header">
            <h3 className="panel-title">
              <Calendar size={18} />
              Simulated Construction Schedule (Gantt View)
            </h3>
            <span className="text-small text-muted font-mono">Orange bar denotes simulated delay extension</span>
          </div>

          <div className="gantt-chart">
            <div className="gantt-timeline-axis">
              <div className="axis-label flex-header">Construction Task Name</div>
              <div className="axis-ticks">
                <span>Wk 1</span>
                <span>Wk 2</span>
                <span>Wk 3</span>
                <span>Wk 4</span>
                <span>Wk 5</span>
                <span>Wk 6</span>
                <span>Wk 7</span>
                <span>Wk 8</span>
                <span>Wk 9</span>
                <span>Wk 10</span>
              </div>
            </div>

            {tasks.map((task) => {
              // Calculate width and position
              const baseWidth = (task.duration_days / baseDuration) * 100;
              const extendedWidth = (task.duration_days * combinedMultiplier / baseDuration) * 100;
              const delayDiffWidth = extendedWidth - baseWidth;

              // Risk status colors
              let riskClass = "risk-low";
              if (task.delay_risk === "High") riskClass = "risk-high";
              else if (task.delay_risk === "Medium") riskClass = "risk-medium";

              return (
                <div key={task.id} className="gantt-row">
                  <div className="gantt-task-name">
                    <span className="task-title">{task.name}</span>
                    <span className={`badge-risk ${riskClass}`}>{task.delay_risk} Risk</span>
                  </div>

                  <div className="gantt-bar-container">
                    {/* Base Duration Bar */}
                    <div
                      className="gantt-bar-base"
                      style={{ width: `${baseWidth}%` }}
                    >
                      <span className="gantt-bar-progress" style={{ width: `${task.progress}%` }}></span>
                      <span className="gantt-bar-label font-mono">{task.duration_days}d Base</span>
                    </div>

                    {/* Delay Extension Bar */}
                    {delayDiffWidth > 0 && (
                      <div
                        className="gantt-bar-delay"
                        style={{
                          width: `${delayDiffWidth}%`,
                          left: `${baseWidth}%`
                        }}
                      >
                        <span className="gantt-delay-label font-mono">
                          +{Math.round(task.duration_days * (combinedMultiplier - 1))}d
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- IoT ALERT CENTER ----------------- */}
      <section id="alerts" className="alerts-section section-padding bg-tint">
        <div className="section-header">
          <span className="kicker">Live Incident Feed</span>
          <h2>IoT Sensor Alerts Control Panel</h2>
          <p className="header-paragraph">
            Connected sensors monitor physical conditions on the construct site. Resolve alerts in real time to resume halted schedules and push status updates straight to the SQLite backend.
          </p>
        </div>

        <div className="alerts-layout">
          <div className="alerts-list-container">
            <div className="alerts-list-header">
              <h3>Active Incident Feed ({alerts.filter((a) => a.status === "Active").length})</h3>
              <button onClick={fetchData} className="refresh-btn" aria-label="Refresh data">
                <RefreshCw size={14} />
                <span>Sync DB</span>
              </button>
            </div>

            <div className="alerts-list">
              {alerts.length === 0 ? (
                <p className="no-data">No alerts logged in the database.</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert-card ${alert.status.toLowerCase()}`}
                  >
                    <div className="alert-card-icon">
                      {alert.status === "Active" ? (
                        <AlertTriangle className="icon-warning" size={20} />
                      ) : (
                        <CheckCircle2 className="icon-resolved" size={20} />
                      )}
                    </div>

                    <div className="alert-card-info">
                      <div className="alert-card-top">
                        <strong className="alert-sensor">{alert.sensor_type}</strong>
                        <span className="alert-value badge-tint font-mono">{alert.value}</span>
                      </div>
                      <p className="alert-msg">{alert.message}</p>
                      <span className="alert-time text-small text-muted font-mono">
                        Logged: {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="alert-card-action">
                      {alert.status === "Active" ? (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="btn btn-sm btn-resolve"
                        >
                          Resolve Alert
                        </button>
                      ) : (
                        <span className="resolved-tag">Resolved</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* IoT Telemetry Info Panel */}
          <div className="panel telemetry-info">
            <h3 className="panel-title">
              <ShieldAlert size={18} />
              Telemetry Calibration
            </h3>
            <p className="text-small text-muted mb-4">
              IoT alerts are automatically logged into SQLite by active crane, humidity, and concrete probes. 
            </p>
            <div className="telemetry-standards">
              <div className="standard-row">
                <span>Crane Wind Tolerance</span>
                <span className="badge-tint font-mono">&lt; 35 mph</span>
              </div>
              <div className="standard-row">
                <span>Ambient Pour Temp</span>
                <span className="badge-tint font-mono">&gt; 35°F</span>
              </div>
              <div className="standard-row">
                <span>Concrete Dry Threshold</span>
                <span className="badge-tint font-mono">&lt; 75% RH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SERVICES SECTION (Jhontraktor layout) ----------------- */}
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

      {/* ----------------- PORTFOLIO SECTION (Jhontraktor style) ----------------- */}
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

      {/* ----------------- ROI CALCULATOR & SAVED ROI SCENARIOS ----------------- */}
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

          {/* ROI Results Display & Saved History */}
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

          {/* Actual Form */}
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
      <footer className="footer bg-tint">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-box">🏗️</div>
            <span className="logo-text">Construct<span className="logo-accent">IQ</span></span>
          </div>
          <p className="footer-tagline">Integrated Construction Operations & Predictive Schedule Intelligence</p>
        </div>
        <div className="footer-bottom text-small text-muted">
          <span>&copy; 2026 ConstructIQ Inc. All rights reserved. Persistent SQLite backend loaded.</span>
          <a href="#home" className="back-top-link">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
