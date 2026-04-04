/**
 * AI Risk Engine — Calculates user risk score (0–100)
 * Higher score = lower risk = better for user
 */

const calculateRiskScore = (userData) => {
  const {
    platformUptime = 0.98,
    incomeStability = 0.80,
    weatherRisk = 0.15,
    demandIndex = 0.70,
    accountAgeDays = 30,
    claimsInLast6Months = 0
  } = userData;

  // Weighted scoring
  let score = 0;
  score += platformUptime * 25;          // 25 pts max
  score += incomeStability * 30;         // 30 pts max
  score += (1 - weatherRisk) * 15;      // 15 pts max
  score += demandIndex * 15;             // 15 pts max
  score += Math.min(accountAgeDays / 365, 1) * 10; // 10 pts max
  score -= claimsInLast6Months * 3;     // penalty

  return Math.min(Math.max(Math.round(score), 0), 100);
};

const getRiskLevel = (score) => {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  return 'High';
};

const getRiskFactors = (score) => ({
  platformReliability: Math.min(score + 9, 100),
  incomeStability: Math.max(score - 5, 0),
  weatherExposure: Math.max(100 - score - 30, 10),
  demandZoneRisk: Math.max(100 - score - 40, 5),
  seasonalVariance: Math.max(100 - score - 20, 20),
  accountHealth: Math.min(score + 4, 100)
});

const getRecommendations = (score, factors) => {
  const recs = [];
  if (factors.weatherExposure > 40) recs.push('Enable monsoon weather trigger for Jun–Sep protection');
  if (factors.incomeStability < 70) recs.push('Income variance detected — consider income drop buffer trigger');
  if (score < 80) recs.push('Connect more platforms to improve income diversification score');
  if (factors.demandZoneRisk > 30) recs.push('Demand in your zone is variable — enable demand zone trigger');
  return recs.length ? recs : ['Your risk profile looks great! Keep platforms active and connected.'];
};

const calculatePremium = (income, platform, days, coverageType) => {
  let base = 299;
  if (coverageType === 'accident') base = 599;
  if (coverageType === 'full') base = 999;

  const incomeMulti = Math.min(Math.max(income / 30000, 0.7), 3.5);
  const daysMulti = days >= 6 ? 1.2 : days >= 4 ? 1.0 : 0.8;

  return Math.round(base * incomeMulti * daysMulti / 10) * 10;
};

module.exports = { calculateRiskScore, getRiskLevel, getRiskFactors, getRecommendations, calculatePremium };