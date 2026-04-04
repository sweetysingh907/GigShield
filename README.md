# 🛡️ GigShield — AI Parametric Insurance for Gig Workers

GigShield is a full-stack web application that provides AI-powered
parametric insurance for gig workers. It automatically triggers
payouts when income drops — no forms, no waiting.

## 🚀 Features

- AI-powered risk scoring engine
- Automatic parametric payouts (platform downtime, weather, income drop)
- Real-time trigger monitoring
- Full dashboard with analytics
- JWT authentication with MongoDB

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript, Chart.js
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT (JSON Web Tokens) + bcrypt
**Other:** node-cron, helmet, express-validator

## 📁 Project Structure
gigshield/
├── index.html          → Landing page
├── dashboard.html      → Main dashboard
├── style.css           → Dashboard styles
└── backend/
├── server.js       → Express server
├── config/         → Database config
├── models/         → MongoDB models
├── routes/         → API routes
├── controllers/    → Route controllers
├── middleware/     → Auth & error handlers
└── services/       → AI engine & payout logic