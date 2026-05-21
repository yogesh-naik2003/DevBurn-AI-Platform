const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "");
const DEMO_MODE = !API_URL;
const DEMO_USERS_KEY = "devburn_demo_users";

const featureImportance = [
  { feature: "Mental Fatigue Score", importance: 0.7099 },
  { feature: "Resource Allocation", importance: 0.1983 },
  { feature: "WFH Setup Available_No", importance: 0.0301 },
  { feature: "Designation", importance: 0.0293 },
  { feature: "WFH Setup Available_Yes", importance: 0.0185 },
  { feature: "Gender_Female", importance: 0.0043 },
  { feature: "Company Type_Service", importance: 0.0026 },
  { feature: "Tenure Days", importance: 0.0025 },
  { feature: "Gender_Male", importance: 0.0024 },
  { feature: "Company Type_Product", importance: 0.0021 },
];

const scatterPoints = [
  { actual: 0.56, predicted: 0.4627, residual: 0.0973 },
  { actual: 0.6, predicted: 0.6649, residual: -0.0649 },
  { actual: 0.23, predicted: 0.1831, residual: 0.0469 },
  { actual: 0.64, predicted: 0.659, residual: -0.019 },
  { actual: 0.33, predicted: 0.3322, residual: -0.0022 },
  { actual: 0.22, predicted: 0.2248, residual: -0.0048 },
  { actual: 0.46, predicted: 0.4343, residual: 0.0257 },
  { actual: 0.54, predicted: 0.5665, residual: -0.0265 },
  { actual: 0.48, predicted: 0.422, residual: 0.058 },
  { actual: 0.37, predicted: 0.39, residual: -0.02 },
];

const DEMO_MODEL_DATA = {
  best_model: "XGBoost Regressor",
  target: "Burn Rate",
  features: ["Gender", "Company Type", "WFH Setup Available", "Designation", "Resource Allocation", "Mental Fatigue Score", "Tenure Days"],
  numeric_features: ["Designation", "Resource Allocation", "Mental Fatigue Score", "Tenure Days"],
  categorical_features: ["Gender", "Company Type", "WFH Setup Available"],
  row_count: 22750,
  trained_rows: 17300,
  test_rows: 4326,
  metrics: {
    "Linear Regression": {
      train: { mae: 0.0538, mse: 0.0051, rmse: 0.0714, r2: 0.8712 },
      test: { mae: 0.0535, mse: 0.005, rmse: 0.0709, r2: 0.8679 },
      overfitting: { rmse_gap: -0.0005, rmse_ratio: 0.9932, status: "ok" },
      feature_importance: featureImportance.map((item) => ({ ...item, importance: item.importance * 0.6 })),
      scatter_points: scatterPoints,
    },
    "Random Forest Regressor": {
      train: { mae: 0.0393, mse: 0.0027, rmse: 0.0517, r2: 0.9324 },
      test: { mae: 0.0475, mse: 0.0037, rmse: 0.0609, r2: 0.9027 },
      overfitting: { rmse_gap: 0.0091, rmse_ratio: 1.1766, status: "ok" },
      feature_importance: featureImportance.map((item) => ({ ...item, importance: item.importance * 0.9 })),
      scatter_points: scatterPoints,
    },
    "XGBoost Regressor": {
      train: { mae: 0.0461, mse: 0.0035, rmse: 0.0588, r2: 0.9125 },
      test: { mae: 0.0475, mse: 0.0037, rmse: 0.0605, r2: 0.9041 },
      overfitting: { rmse_gap: 0.0016, rmse_ratio: 1.0273, status: "ok" },
      feature_importance: featureImportance,
      scatter_points: scatterPoints,
    },
  },
};

const DEMO_ANALYTICS = {
  average_burn_rate: 0.452,
  median_burn_rate: 0.45,
  high_risk_share: 0.1593,
  burn_rate_by_gender: [
    { Gender: "Female", average_burn_rate: 0.4228 },
    { Gender: "Male", average_burn_rate: 0.4843 },
  ],
  burn_rate_by_company_type: [
    { "Company Type": "Product", average_burn_rate: 0.4508 },
    { "Company Type": "Service", average_burn_rate: 0.4526 },
  ],
  burn_rate_by_wfh: [
    { "WFH Setup Available": "No", average_burn_rate: 0.5178 },
    { "WFH Setup Available": "Yes", average_burn_rate: 0.396 },
  ],
  burn_rate_by_designation: [
    { Designation: 0, average_burn_rate: 0.151 },
    { Designation: 1, average_burn_rate: 0.3081 },
    { Designation: 2, average_burn_rate: 0.4355 },
    { Designation: 3, average_burn_rate: 0.5455 },
    { Designation: 4, average_burn_rate: 0.6867 },
    { Designation: 5, average_burn_rate: 0.857 },
  ],
  burn_rate_by_resource_allocation: [
    { "Resource Allocation": 1, average_burn_rate: 0.1376 },
    { "Resource Allocation": 2, average_burn_rate: 0.2534 },
    { "Resource Allocation": 3, average_burn_rate: 0.3403 },
    { "Resource Allocation": 4, average_burn_rate: 0.4182 },
    { "Resource Allocation": 5, average_burn_rate: 0.4934 },
    { "Resource Allocation": 6, average_burn_rate: 0.5768 },
    { "Resource Allocation": 7, average_burn_rate: 0.6547 },
    { "Resource Allocation": 8, average_burn_rate: 0.7364 },
    { "Resource Allocation": 9, average_burn_rate: 0.8309 },
    { "Resource Allocation": 10, average_burn_rate: 0.9042 },
  ],
  correlations: [
    { feature: "Mental Fatigue Score", correlation: 0.9445 },
    { feature: "Resource Allocation", correlation: 0.8563 },
    { feature: "Designation", correlation: 0.7376 },
    { feature: "Tenure Days", correlation: 0.0014 },
  ],
};

function loadDemoUsers() {
  const fallback = {
    "admin@example.com": { name: "Admin", password: "admin123" },
  };
  const raw = localStorage.getItem(DEMO_USERS_KEY);
  if (!raw) {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(raw);
}

function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function makeDemoToken(user) {
  return `demo.${btoa(JSON.stringify({ sub: user.email, name: user.name, ts: Date.now() }))}`;
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function demoPrediction(payload) {
  const fatigue = Number(payload["Mental Fatigue Score"] || 5) / 10;
  const workload = Number(payload["Resource Allocation"] || 5) / 10;
  const designation = Number(payload.Designation || 2) / 5;
  const tenureYears = Number(payload["Tenure Days"] || 365) / 365;
  const wfhPenalty = payload["WFH Setup Available"] === "No" ? 0.06 : -0.03;
  const genderPenalty = payload.Gender === "Male" ? 0.02 : 0;
  const companyPenalty = payload["Company Type"] === "Service" ? 0.01 : 0;
  const burnRate = clamp(0.08 + fatigue * 0.48 + workload * 0.25 + designation * 0.16 + wfhPenalty + genderPenalty + companyPenalty - Math.min(tenureYears, 8) * 0.005, 0.03, 0.97);

  return {
    burn_rate: Number(burnRate.toFixed(4)),
    model: DEMO_MODEL_DATA.best_model,
    all_predictions: {
      "Linear Regression": Number(clamp(burnRate - 0.025, 0.03, 0.97).toFixed(4)),
      "Random Forest Regressor": Number(clamp(burnRate + 0.015, 0.03, 0.97).toFixed(4)),
      "XGBoost Regressor": Number(burnRate.toFixed(4)),
    },
  };
}

function demoApi(path, options = {}) {
  const body = options.body ? JSON.parse(options.body) : {};
  const users = loadDemoUsers();

  if (path === "/auth/login") {
    const email = String(body.email || "").trim().toLowerCase();
    const user = users[email];
    if (!user || user.password !== body.password) {
      throw new Error("Invalid email or password");
    }
    const sessionUser = { email, name: user.name };
    return { token: makeDemoToken(sessionUser), user: sessionUser };
  }

  if (path === "/auth/register") {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !body.password) throw new Error("Email and password are required");
    if (users[email]) throw new Error("Email is already registered");
    users[email] = { name: String(body.name || "").trim() || email, password: body.password };
    saveDemoUsers(users);
    const sessionUser = { email, name: users[email].name };
    return { token: makeDemoToken(sessionUser), user: sessionUser };
  }

  if (path === "/models") return DEMO_MODEL_DATA;
  if (path === "/analytics") return DEMO_ANALYTICS;
  if (path === "/predict") return demoPrediction(body);
  if (path === "/train") return { message: "Demo models refreshed", best_model: DEMO_MODEL_DATA.best_model };

  throw new Error("Demo endpoint not found");
}

export function getToken() {
  return localStorage.getItem("burnout_token");
}

export function setSession(session) {
  localStorage.setItem("burnout_token", session.token);
  localStorage.setItem("burnout_user", JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem("burnout_token");
  localStorage.removeItem("burnout_user");
}

export function getUser() {
  const raw = localStorage.getItem("burnout_user");
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  if (DEMO_MODE) return demoApi(path, options);

  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }
  return data;
}
