# ⚽ FanBridge
### AI-Powered Stadium Intelligence Platform

# ⚽ FanBridge

![Google PromptWars](https://img.shields.io/badge/Google-PromptWars%202026-4285F4?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-Hackathon-success?style=for-the-badge)

> **Built for Google PromptWars 2026**
>
> **Challenge Theme:** FIFA World Cup 2026 – GenAI for Stadium Operations & Fan Experience

---

## 🏆 Competition Submission

FanBridge is our submission for the **Google PromptWars Competition**, where the challenge is to build a **Generative AI-powered solution** that transforms stadium operations and enhances the overall FIFA World Cup 2026 experience — built using **Google Antigravity**, Google's intent-driven development environment.

Rather than creating another chatbot, FanBridge acts as an **AI-powered Stadium Intelligence Platform** with two dedicated, role-gated experiences — one for fans, one for stadium staff — built on a single shared source of stadium truth.

---

## 🌍 Live Demo

🔗 **[https://fanbridge.netlify.app/](https://fanbridge.netlify.app/)**

| Role | How to Access |
|---|---|
| 👤 **Fan** | Click "I'm a Fan" → enter any display name → explore instantly |
| 🛂 **Staff** | Click "I'm Staff" → enter access code below |

```
Staff Access Code: FANBRIDGE2026
```

> This access code is provided exclusively for Google PromptWars judges and demo purposes. It is a client-side demo gate, not production-grade authentication.

---

## 💡 The Problem

FIFA World Cup 2026 will bring millions of fans into stadiums across the US, Mexico, and Canada. Three friction points stood out to us:

| # | Problem | Who Feels It |
|---|---|---|
| 1 | **Language barriers** — signage, staff, and announcements often don't reach non-native speakers | International fans |
| 2 | **Wayfinding confusion** — large, unfamiliar stadiums make finding a seat, gate, or amenity slow and stressful | First-time visitors, fans with limited time |
| 3 | **Slow incident coordination** — scattered, informal staff reports are hard to turn into a clear, prioritized picture in real time | Organizers, control-room staff, volunteers |

Each of these traces back to the same root gap: **no shared, real-time, AI-readable model of "what's happening where" in the stadium** — one that can serve both the fan asking a question and the staff member logging an incident.

---

## ✨ The Solution

FanBridge is one platform, one shared stadium data model, and two purpose-built experiences:

### 🧭 Fan Dashboard
- Multilingual AI chat assistant (English, Spanish, Portuguese, Hindi)
- Step-by-step wayfinding grounded in real stadium data — gates, sections, amenities
- **Accessibility Priority** toggle that prioritizes step-free routes and accessible facilities
- Every answer is traceable to real data, not generic or invented directions

### 🚨 Staff Dashboard
- Plain-text incident reporting — staff describe what they observe, AI does the rest
- Automatic classification (medical / crowd / security / facilities), priority scoring, and location tagging
- Live, auto-updating **Situation Summary** for control-room awareness
- Incident locations are cross-referenced against the *same* stadium data fans use — proving the two experiences share one intelligence layer, not two disconnected tools

### 🔒 Role-Gated Access
- A single login screen routes fans and staff into completely separate experiences
- Fans can never reach the Staff Dashboard, and vice versa
- Staff access is protected by a code-gated entry point

---

## 🤖 Powered by Google AI

FanBridge uses the **Google Gemini API** for:

- Context-aware, data-grounded conversations (Fan Dashboard)
- Real-time multilingual translation and response generation
- Incident classification, priority scoring, and location matching (Staff Dashboard)
- Auto-generated, continuously updating situation summaries

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Fans** | Ask the AI anything, get directions to their seat, find amenities, get accessible routing |
| **Staff** | Report incidents in plain language, view AI-triaged priorities, resolve active issues |
| **Organizers** | Monitor the live situation summary to make faster, better-informed decisions |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **AI** | Google Gemini API |
| **Deployment** | Netlify |
| **Built With** | Google Antigravity (intent-driven / "vibe coding") |

---

## 📂 Project Structure

```
fanbridge/
├── src/              # React frontend (Fan Dashboard, Staff Dashboard, login/role-gate)
├── public/           # Static assets
├── server.js         # Express backend — Gemini API integration
├── stadiumData.json  # Shared source of truth for both dashboards
├── package.json
└── vite.config.js
```

---

## ⚙️ Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root
```

```env
GEMINI_API_KEY=YOUR_API_KEY
PORT=3001
```

```bash
# 3. Run the backend
npm run server

# 4. In a separate terminal, run the frontend
npm run dev
```

The app will be available locally, typically at `http://localhost:5173`.

---

## ✅ How FanBridge Solves Each Problem

| Problem | Solved By | Success Criteria |
|---|---|---|
| Language barrier | Multilingual chat with real-time generation in the fan's selected language | Response language matches the question's language |
| Wayfinding | AI directions grounded in `stadiumData.json` | Every answer cites a real gate/section/amenity |
| Incident coordination | AI-classified, prioritized, auto-summarized staff dashboard | Situation Summary updates live; locations match shared data |

---

## 🌟 Future Scope

- 🧭 Indoor GPS-based navigation
- 🎙 Voice-based AI assistant
- 📊 AI-driven crowd density prediction
- 🏟 Digital twin of the stadium
- 👁 Computer vision for real-time crowd monitoring
- 🚌 Smart transportation recommendations
- ♻️ Sustainability & waste-sorting dashboard
- 🤝 AI copilot for volunteer shift briefings

---

## 🏅 Why FanBridge?

FanBridge shows how Generative AI can move beyond a single chatbot and become a genuine **operational intelligence layer** — one shared data foundation serving very different users with very different needs, at one of the world's largest sporting events.

It focuses on solving real problems in:

- Stadium operations
- Fan experience
- Accessibility
- Incident response
- Multilingual communication
- Operational decision support

---

## 👨‍💻 Developer

**Hiten Chaudhary**
GitHub: [github.com/theaideveloperr](https://github.com/theaideveloperr)

---

## 📜 License

Created for the **Google PromptWars Competition**. All rights reserved by the developer unless otherwise noted.

