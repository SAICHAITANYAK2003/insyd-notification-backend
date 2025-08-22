# 📢 Insyd Notification POC - Proof of Concept

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed%20On-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)

---

A simple **notification system** demonstrating how users can trigger events (like, comment, follow) and see notifications in real-time (via polling).

This is a **proof-of-concept (POC)** built with:

- ⚛️ **Frontend:** React + Vite + TailwindCSS
- 🖥️ **Backend:** Node.js + Express + MongoDB
- ☁️ **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 🌐 Live Demo

🔗 **Frontend (Vercel):** [insyd-notification-frontend.vercel.app](https://insyd-notification-frontend.vercel.app/)  
🔗 **Backend (Render):** [insyd-notification-backend.onrender.com](https://insyd-notification-backend.onrender.com/)

---

## ✨ Features

- 🔔 Trigger notification events (`like`, `comment`, `follow`)
- 👥 Select **source user** and **target user**
- 🗄️ Notifications stored on backend
- ⏱️ **Polling every 5s** to fetch new notifications
- 🎨 Clean and simple UI

---

## ⚙️ Installation & Setup

### 🔹 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside `frontend/`:

```
VITE_BACKEND_URL=https://insyd-notification-backend.onrender.com
```

---

### 🔹 Backend (Node.js + Express)

```bash
cd backend
npm install
npm run server
```

Runs at `http://localhost:4000` by default.  
Update frontend `.env` to point to correct backend URL.

---

## 📡 API Endpoints

### 1️⃣ Trigger Event

**POST** `/events`

```json
{
  "type": "like",
  "sourceUserId": "user1",
  "targetUserId": "user2",
  "data": {
    "sourceUsername": "Alice"
  }
}
```

✅ **Response**

```json
{
  "success": true,
  "message": "Event created successfully"
}
```

---

### 2️⃣ Get Notifications

**GET** `/notifications/:userId`  
Example: `/notifications/user2`

✅ **Response**

```json
[
  {
    "notificationId": "12345",
    "type": "like",
    "content": "Alice liked your post",
    "timestamp": "2025-08-21T14:22:00.000Z"
  }
]
```

---

## 🎨 UI Preview

- 🖱️ Trigger events by selecting **event type**, **source user**, and **target user**
- 📜 Notifications appear under the target user’s section
- ❌ If no notifications exist → shows `No notifications yet`

🖼️ **Backend UI Preview**

<p style="text-align: center;">
  <img src="./public/backendimg.png" alt="UI Preview" width="600"/>
</p>

---

## 🚀 Deployment

- 🌐 **Frontend** → [Vercel](https://insyd-notification-frontend.vercel.app)
- 🔗 **Backend** → [Render](https://insyd-notification-backend.onrender.com)

Update `.env` in frontend to point to backend Render URL.

---

## 🔮 Future Scope

- ⚡ Replace **polling** with **WebSockets (Socket.io)** for real-time updates
- 📩 Add **read/unread status** for notifications
- 💾 Database persistence with MongoDB TTL/indexes
- 🛠️ Support **multiple event types** with richer content

---

💡 _This project is a POC and can be extended into a full-scale notification system!_
