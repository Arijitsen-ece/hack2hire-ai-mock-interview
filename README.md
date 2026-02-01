🚀 AI Mock Interview Platform

An AI-powered, rule-based mock interview platform designed to simulate real-world technical interviews with adaptive difficulty, time constraints, and objective evaluation.

This project was built as a **Hack2Hire: AI-Powered Interview Hackathon** submission and focuses on **state-based simulation**, **adaptive decision-making**, and **deterministic scoring logic**.

---

## ✨ Key Features

- 📄 **Resume & Job Description Analysis**
  - Extracts skills, experience, and role relevance
  - Aligns interview questions with job requirements

- 🧠 **Adaptive Interview Engine**
  - Difficulty levels: Easy → Medium → Hard
  - Dynamically adjusts based on candidate performance

- ⏱️ **Strict Time Management**
  - Fixed response time per question
  - Penalties for delayed or incomplete answers

- ⚠️ **Early Interview Termination**
  - Ends interview if performance drops below defined thresholds

- 📊 **Objective Scoring System**
  - Accuracy
  - Clarity
  - Depth
  - Relevance
  - Time efficiency

- 🧾 **Final Interview Readiness Report**
  - Readiness score (0–100)
  - Skill-wise performance breakdown
  - Strengths & weaknesses
  - Actionable improvement feedback
  - Hiring readiness indicator for the given role

---

## 🧩 System Design Overview

The platform is implemented using a **state-machine-based architecture**:

**States:**
- INIT
- RESUME_ANALYSIS
- QUESTIONING
- SCORING
- EARLY_TERMINATION
- FINAL_EVALUATION
- END

Each state has clearly defined entry conditions, transitions, and validation rules to ensure deterministic and reproducible behavior.

---

## 🛠️ Tech Stack

- ⚡ Vite
- ⚛️ React
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 🧩 shadcn/ui

---

## 📂 Project Structure

src/
├── components/ # Reusable UI components
├── engine/ # Interview logic, scoring, state handling
├── hooks/ # Custom React hooks
├── pages/ # App pages (Home, Interview, Results)
├── lib/ # Utility functions
└── main.tsx # App entry point


---

## ▶️ Running the Project Locally

### Prerequisites
- Node.js (v18 or above)
- npm

### Steps

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>

# Navigate to the project directory
cd hack2hire-ai-mock-interview

# Install dependencies
npm install

# Start the development server
npm run dev
The application will be available at:

http://localhost:8080

