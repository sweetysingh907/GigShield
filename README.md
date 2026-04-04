# 🚀 GigShield – AI-Powered Parametric Insurance for Gig Workers

## 📌 Overview
GigShield is an AI-driven parametric insurance platform designed to protect gig workers (like delivery partners and drivers) from income loss caused by external disruptions such as platform downtime or adverse weather conditions.

The platform automates claim processing and simulates instant payouts, ensuring fast and reliable financial protection.

---

## 🎯 Problem Statement
Gig workers face unpredictable income due to:
- Platform outages
- Weather disruptions
- Lack of traditional insurance coverage

GigShield solves this by providing automated, trigger-based insurance payouts.

---

## 💡 Key Features

### 🔐 Authentication System
- User Registration & Login
- Secure password hashing using bcrypt
- JWT-based authentication

### 📊 User Dashboard
- Risk Score Analysis
- Earnings Protection Overview
- Active Insurance Plan
- Analytics & Insights

### ⚡ Parametric Triggers
- Platform Downtime Detection
- Weather-based triggers
- Automatic claim initiation

### 💰 Instant Payout (Simulated)
- Auto claim approval
- Simulated instant payouts
- Real-time status updates

### 🧠 AI-Based Risk Scoring
- Dynamic risk score calculation
- Helps users understand financial risk level

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- React.js / Vite
- Tailwind CSS

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

---

## 📂 Project Structure

GigShield/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
├── .gitignore
├── README.md
└── .env.example

---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2. Backend Setup
cd backend
npm install
npm start

### 3. Frontend Setup
cd frontend
npm install
npm run dev

---

## 🔐 Environment Variables

Create a `.env` file in backend folder and add:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
JWT_EXPIRE=7d  
PORT=5000  

---

## 🧪 API Endpoints

### Auth Routes
- POST /api/auth/register → Register user  
- POST /api/auth/login → Login user  
- GET /api/auth/me → Get user profile  

---



## 📊 Future Scope (Phase 3)
- Advanced Fraud Detection (GPS spoofing, fake claims)
- Real-time weather API integration
- Instant payout via payment gateway (Razorpay/Stripe sandbox)
- Admin dashboard for insurers
- Predictive analytics

---

## 🏆 Hackathon Project
This project is developed as part of a hackathon to demonstrate:
- AI-driven insurance automation
- Parametric claim processing
- Financial protection for gig workers

---

## 👨‍💻 Team
- Sweety (Team Leader) (Backend & Full Stack Developer)
- Sonakshi Singh (Frontend Developer)
- Rinku Kumar ( Backend Developer)

---

## 📜 License
This project is licensed under the MIT License.

---

## 💙 Acknowledgements
Thanks to the hackathon organizers and mentors for guidance and support.

---

⭐ If you like this project, please give it a star!
