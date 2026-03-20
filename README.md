🚀 GigShield

AI-Powered Parametric Insurance for Gig Workers

Problem Statement

Gig workers (delivery partners, drivers, freelancers) face income loss due to unpredictable risks such as:

 Extreme weather

 Accidents

 Network outages

Traditional insurance systems are:

Slow

Paperwork-heavy

Not designed for daily earners

 GigShield solves this with instant, automated, parametric insurance.

 User Personas & Scenarios
 Delivery Partner (Ravi)

Works daily for income

Gets stuck due to heavy rain

 System detects severe weather → auto payout triggered

 Ride Driver (Aman)

Driving during extreme heat

 Risk detected → compensated automatically

 Fraud Actor (Spoofer)

Uses GPS spoofing to fake location

 AI flags abnormal behavior → prevents payout

 Application Workflow

User enters/auto-detects location 

System fetches real-time data:

Weather 

Risk level

Weekly premium calculated 

Continuous monitoring 

If trigger condition met:

Claim auto-initiated

Instant payout processed 

 Weekly Premium Model

Our pricing is dynamic and risk-based:

 Formula:
Weekly Premium = Base Price + (Risk Score × Factor)
Example:

Low Risk → ₹20/week

Medium Risk → ₹40/week

High Risk → ₹70/week

 Inputs:

Location risk

Weather patterns

User activity

Historical data

 Ensures affordability for gig workers.
 Parametric Triggers

Payouts are automatically triggered when predefined conditions are met:

 Rainfall exceeds threshold

 Extreme temperature

 Severe weather alerts

 Network outage

 No claims filing
 No paperwork
 Instant processing

 AI/ML Integration
 1. Premium Calculation

Regression models to predict risk-based pricing

Dynamic adjustment using historical + real-time data

 2. Fraud Detection

Classification models to detect suspicious claims

Isolation Forest for anomaly detection

 3. Risk Prediction

Predict high-risk zones in advance

Improve system accuracy over time

 Adversarial Defense & Anti-Spoofing Strategy
 1. Differentiation (Real vs Fake Users)

We use multi-signal validation instead of basic GPS:

Movement consistency tracking

Speed & route analysis

Weather vs device activity correlation

 Real user → natural movement
 Spoofer → static/unrealistic pattern

 2. Data Points Used

 GPS trajectory (not single point)

 Time & speed patterns

 Network signal strength

 Battery usage behavior

 Device motion sensors

 Weather API correlation

 Cluster fraud detection

 Example Fraud Case

If a user shows:

No movement for 30+ minutes

Constant GPS location

Claim triggered in severe weather

 System flags as suspicious 

 3. UX Balance (Fairness)

 No instant rejection

 Flagged claims → soft verification

 Manual review fallback

 Partial/delayed payout if needed

 Ensures fraud prevention without harming genuine users

 Integration Capabilities

 Weather API → Real-time data

 Traffic Data → Simulated

 Platform APIs → Simulated

 Payment System → Mock/Sandbox

 Designed for real-world integration in production.

 Tech Stack
Frontend:

HTML, CSS, JavaScript

Backend (Planned):

Node.js / Python (Flask)

APIs:

Weather API

AI/ML:

Regression Models

Classification Models

Isolation Forest

 Development Plan
Phase 1:

UI + workflow

Weather integration

Phase 2:

Premium logic

Parametric triggers

Phase 3:

AI/ML integration

Fraud detection

Phase 4:

Optimization & scaling

 Platform Choice: Web App

We chose Web Platform because:

Easy accessibility 

No installation required

Cross-device compatibility

Faster deployment

 Limitations

Current system uses rule-based logic (ML planned)

Some APIs are simulated

Fraud detection is conceptual in prototype stage

 Key Features

 Instant claim settlement

 AI-powered fraud detection

 Weekly micro-premium model

 Real-time risk analysis

 Secure & fair system

 Vision

To build a trust-first insurance ecosystem where:

Claims are instant

Fraud is minimized

Gig workers feel financially secure

 Final Note

GigShield is not just an insurance tool —
it’s a smart financial safety net for the gig economy.
