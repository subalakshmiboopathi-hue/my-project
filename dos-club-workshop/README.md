# DOS Club Workshop Management System

A full-stack, demo-ready Workshop Management & Certification System built for **DOS Club** using **React, Vite, Tailwind CSS, Express.js, and PostgreSQL**.

---

## 🚀 Tech Stack

* **Frontend**: React 19 + Vite + Tailwind CSS v4 + Lucide React
* **Backend**: Node.js + Express.js REST API
* **Database**: PostgreSQL
* **Authentication**: JWT + bcryptjs
* **Architecture**: `React → Express REST API → PostgreSQL`

---

## 🛠️ System Features & User Roles

### 👑 Admin Capabilities
* **Dashboard Overview**: Total workshops, students, registrations, attendance rates, certificates issued, and average feedback ratings.
* **Workshop CRUD**: Create, read, update, and delete workshops with automated seat tracking.
* **Attendance Management**: View registered students per workshop and mark `Present` or `Absent`.
* **Registration Roster**: Complete participant lists and timestamps.
* **Feedback Analytics**: View rating distributions (1–5 stars) and student comments.

### 🎓 Student Capabilities
* **Account Registration & Authentication**: Secure sign-up and login with role segregation.
* **Browse & Search Workshops**: Search by title, instructor, venue, and filter by available seats.
* **Workshop Registration**: Real-time capacity validation and duplicate registration prevention.
* **Attendance Tracking**: View attendance logs (`Present`, `Absent`, or `Pending`).
* **Feedback Submission**: Submit 1–5 star ratings and reviews for attended workshops.
* **Certificate of Participation**: Official DOS Club verified certificate with dynamic student name, workshop details, verification ID, and one-click **Print / Save as PDF** support.

---

## 📁 Project Structure

```text
dos-club-workshop/
│
├── client/                      # React + Vite Frontend
│   └── src/
│       ├── components/          # Reusable UI components (Navbar, Sidebar, Modal, StatCard, etc.)
│       ├── pages/               # Admin & Student views + Certificate printable view
│       ├── layouts/             # Dashboard Layout wrapper
│       ├── services/            # Axios/Fetch API wrapper with JWT interceptor
│       ├── context/             # AuthContext & ToastContext
│       └── App.jsx              # Main router and state coordinator
│
├── server/                      # Node.js + Express REST API
│   ├── routes/                  # Modular API endpoints
│   ├── controllers/             # Business logic (auth, workshops, attendance, feedback, certificates)
│   ├── middleware/              # JWT & role authorization
│   ├── db/                      # PostgreSQL Pool & seeder
│   └── server.js                # Server entrypoint
│
├── database/                    # SQL scripts
│   ├── schema.sql               # PostgreSQL schema definition
│   └── seed.sql                 # Sample workshops & initial demo users
│
├── .env                         # Environment variables
└── README.md
```

---

## 🔗 Dedicated Login URLs & Credentials

| Role | Portal URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | [`/admin/login`](http://localhost:5176/admin/login) *(or `/admin-login`)* | `admin` *(or `admin@dosclub.org`)* | `cms@2007` |
| **🎓 Student** | [`/login`](http://localhost:5176/login) *(or `/student/login`)* | `student@dosclub.org` | `student123` |
| **🎓 Student (Register)** | [`/register`](http://localhost:5176/register) | *(Create new student account)* | *(min 6 chars)* |

*(Note: The login page includes 1-click Quick Demo buttons to autofill these credentials instantly!)*

---

## ⚙️ Setup & Run Instructions

### 1. Prerequisites
* **Node.js**: v18+
* **PostgreSQL**: Running on `localhost:5432`

### 2. Environment Variables (`server/.env` & `.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dos_workshop
JWT_SECRET=dos_club_workshop_jwt_secret_key_2026_super_secure!
```

### 3. Run Backend Server
```bash
cd dos-club-workshop/server
npm install
npm start
```
*Auto-creates tables from `schema.sql` and loads seed data from `seed.js`.*

### 4. Run Frontend Client
```bash
cd dos-club-workshop/client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📋 Complete Demo Workflow

1. **Admin Login**: Sign in as Admin (`admin@dosclub.org` / `admin123`).
2. **Create Workshop**: Click "Create Workshop" and fill in title, venue, instructor, and seat limits.
3. **Student Registration**: Sign out and register or log in as a Student (`student@dosclub.org` / `student123`).
4. **Enroll in Workshop**: Browse workshops and click **Register** (seats update automatically).
5. **Mark Attendance**: Sign back in as Admin, open **Attendance**, choose the workshop, and toggle student to **Present**.
6. **Submit Feedback**: Log in as the Student, open **My Registered**, and submit a 5-star review with comments.
7. **Generate & Print Certificate**: Click **Claim Certificate** to generate an official certificate with unique verification code `DOS-2026-W*-****` and click **Print / Save as PDF**!
