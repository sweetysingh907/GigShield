// ===== PLAN CONFIG =====
const PLANS = {
  basic:    { label: 'BASIC', premium: 50,  coverage: 500,  threshold: 40 },
  standard: { label: 'STANDARD', premium: 100, coverage: 1000, threshold: 38 },
  premium:  { label: 'PREMIUM', premium: 150, coverage: 2000, threshold: 36 },
};

// ===== CITY COORDS =====
const CITY_COORDS = {
  mumbai:{ lat:19.076, lon:72.877 },
  delhi:{ lat:28.704, lon:77.102 },
  chennai:{ lat:13.083, lon:80.270 },
};

let userRegisteredCity = localStorage.getItem('gs_city') || null;

// ===== WEATHER =====
async function loadWeather() {
  const text = document.getElementById('weatherText');

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.877&current_weather=true`);
    const data = await res.json();
    text.textContent = `${data.current_weather.temperature}°C · Mumbai`;
  } catch {
    text.textContent = "Weather unavailable";
  }
}

// ===== CHECK RISK =====
async function checkRisk() {
  const city = document.getElementById('cityInput').value.trim();
  const planKey = document.getElementById('planSelect').value;
  const plan = PLANS[planKey];

  if (!city) {
    showToast("Enter city", "error");
    return;
  }

  let temp = 30 + Math.floor(Math.random()*10);

  let risk, payout;

  if (temp >= plan.threshold + 4) {
    risk = "High Risk";
    payout = plan.coverage;
  } else if (temp >= plan.threshold) {
    risk = "Moderate Risk";
    payout = plan.coverage / 2;
  } else {
    risk = "Safe";
    payout = 0;
  }

  // Dynamic premium
  let adjustedPremium = plan.premium;
  if (risk === "High Risk") adjustedPremium += 20;
  if (risk === "Safe") adjustedPremium -= 10;

  // Update UI
  document.getElementById('resultPanel').style.display = "block";
  document.getElementById('rCity').textContent = city;
  document.getElementById('rTemp').textContent = temp + "°C";
  document.getElementById('rPlan').textContent = plan.label;
  document.getElementById('rCoverage').textContent = "₹" + plan.coverage;
  document.getElementById('rPremium').textContent = "₹" + adjustedPremium;
  document.getElementById('rPayout').textContent = "₹" + payout;

  document.getElementById('resultStatus').textContent = risk;

  // Stats
  document.getElementById('statPlan').textContent = plan.label;
  document.getElementById('statCoverage').textContent = "₹" + plan.coverage;
  document.getElementById('statPremium').textContent = "₹" + adjustedPremium;
  document.getElementById('statRisk').textContent = risk;

  // Fraud detection
  const fraud = userRegisteredCity && userRegisteredCity !== city;
  if (fraud) {
    document.getElementById('fraudAlert').style.display = "block";
    document.getElementById('fraudMsg').textContent = "Fraud Detected!";
  } else {
    document.getElementById('fraudAlert').style.display = "none";
  }

  // Claim button
  const claimBtn = document.getElementById('claimBtn');
  if (payout > 0 && !fraud) {
    claimBtn.style.display = "block";
  } else {
    claimBtn.style.display = "none";
  }

  // Save city
  if (!userRegisteredCity) {
    userRegisteredCity = city;
    localStorage.setItem('gs_city', city);
  }
}

// ===== CLAIM =====
function fileClaim() {
  showToast("Claim Submitted!", "success");

  const list = document.getElementById('activityList');
  const item = document.createElement('div');
  item.innerHTML = `<p>Claim submitted - ₹ payout</p>`;
  list.prepend(item);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = "block";

  setTimeout(()=> toast.style.display="none", 3000);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
});