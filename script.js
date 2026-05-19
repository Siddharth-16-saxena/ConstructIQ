const scenarios = {
  baseline: {
    finishDate: "Sep 18",
    finishDelta: "On target",
    delayRisk: "14%",
    riskDelta: "Low exposure",
    overrun: "$42k",
    overrunDelta: "Within contingency",
    recommendation: "Pull plumbing QA forward",
    recommendationDelta: "Saves 2.5 days",
    timelineLabel: "Week 18-22",
    alertCount: "7 live",
    heroSchedule: "86%",
    heroBudget: "-3.4%",
    heroAlerts: "7",
    bars: [82, 61, 72, 48],
    budget: [18, 26, 34, 43, 51, 58, 63, 68],
    alerts: [
      ["medium", "Crane idle for 30min", "Tower B equipment tracker"],
      ["high", "High CO2 detected", "Basement utility corridor"],
      ["low", "Humidity rising", "Level 3 materials bay"],
      ["medium", "Inspection checklist due", "Fire stopping, Level 4"],
    ],
  },
  shortage: {
    finishDate: "Sep 27",
    finishDelta: "+9 days without action",
    delayRisk: "38%",
    riskDelta: "Crew capacity constrained",
    overrun: "$126k",
    overrunDelta: "Labor premium likely",
    recommendation: "Split MEP rough-in into two zones",
    recommendationDelta: "Recovers 5.5 days",
    timelineLabel: "Worker shortage model",
    alertCount: "9 live",
    heroSchedule: "72%",
    heroBudget: "+1.8%",
    heroAlerts: "9",
    bars: [88, 45, 58, 36],
    budget: [18, 28, 38, 49, 61, 71, 82, 88],
    alerts: [
      ["high", "Crew availability below plan", "MEP subcontractor"],
      ["medium", "Overtime threshold reached", "Electrical crew"],
      ["medium", "Drywall start at risk", "Schedule dependency"],
      ["low", "Alternate crew available", "Approved vendor list"],
    ],
  },
  sensor: {
    finishDate: "Sep 21",
    finishDelta: "+3 days under review",
    delayRisk: "26%",
    riskDelta: "Safety event active",
    overrun: "$79k",
    overrunDelta: "Equipment downtime exposure",
    recommendation: "Re-route crews to east core",
    recommendationDelta: "Keeps 11 tasks moving",
    timelineLabel: "IoT event response",
    alertCount: "12 live",
    heroSchedule: "79%",
    heroBudget: "-0.9%",
    heroAlerts: "12",
    bars: [80, 57, 68, 44],
    budget: [18, 25, 33, 44, 54, 62, 70, 76],
    alerts: [
      ["high", "High CO2 in confined space", "Basement utility corridor"],
      ["high", "Wearable fall alert", "North stairwell"],
      ["medium", "Crane idle for 30min", "Tower B equipment tracker"],
      ["low", "Edge buffer syncing", "23 sensor events queued"],
    ],
  },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const shortCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}M`;
  return `$${Math.round(value / 1000)}k`;
};

const setText = (id, value) => {
  document.getElementById(id).textContent = value;
};

const renderAlerts = (alerts) => {
  const list = document.getElementById("alertList");
  list.innerHTML = "";
  alerts.forEach(([severity, title, source]) => {
    const item = document.createElement("div");
    item.className = "alert-item";
    item.innerHTML = `
      <span class="alert-severity severity-${severity}"></span>
      <span><strong>${title}</strong><small>${source}</small></span>
      <small>${severity.toUpperCase()}</small>
    `;
    list.appendChild(item);
  });
};

const drawBudget = (points) => {
  const canvas = document.getElementById("budgetCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pad = 34;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f7f2";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d9ded6";
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const y = pad + ((height - pad * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  const plot = (data, color, offset = 0) => {
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = pad + ((width - pad * 2) / (data.length - 1)) * index;
      const y = height - pad - ((height - pad * 2) * (value + offset)) / 100;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  plot([14, 22, 31, 39, 48, 57, 66, 75], "#c85f35", 0);
  plot(points, "#2f6f73", 0);

  ctx.fillStyle = "#17201f";
  ctx.font = "700 18px Manrope";
  ctx.fillText("Actual spend", pad, 26);
  ctx.fillStyle = "#5f6f6b";
  ctx.font = "700 13px Manrope";
  ctx.fillText("Plan vs. live burn", width - 150, 26);
};

const applyScenario = (name) => {
  const scenario = scenarios[name];
  Object.entries(scenario).forEach(([key, value]) => {
    if (typeof value === "string" && document.getElementById(key)) {
      setText(key, value);
    }
  });

  ["barFraming", "barMep", "barInspection", "barDrywall"].forEach((id, index) => {
    document.getElementById(id).style.width = `${scenario.bars[index]}%`;
  });

  setText("budgetLabel", `${scenario.budget.at(-1)}% spent`);
  renderAlerts(scenario.alerts);
  drawBudget(scenario.budget);
};

document.querySelectorAll(".scenario-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".scenario-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyScenario(button.dataset.scenario);
  });
});

const updateRoi = () => {
  const projectValue = Number(document.getElementById("projectValue").value);
  const delayCost = Number(document.getElementById("delayCost").value);
  const preventedWeeks = Math.max(2.2, Math.min(9.5, projectValue / 6500000));
  const savings = delayCost * preventedWeeks * 0.72;

  setText("projectValueLabel", shortCurrency(projectValue));
  setText("delayCostLabel", shortCurrency(delayCost));
  setText("savings", currency.format(savings));
};

["projectValue", "delayCost"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateRoi);
});

let alertTick = 0;
setInterval(() => {
  const sequence = ["baseline", "shortage", "sensor"];
  const current = document.querySelector(".scenario-btn.active").dataset.scenario;
  if (current !== "baseline") return;
  alertTick = (alertTick + 1) % sequence.length;
  setText("heroAlerts", String(7 + alertTick));
}, 2600);

applyScenario("baseline");
updateRoi();
