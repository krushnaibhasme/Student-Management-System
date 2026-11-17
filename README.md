# 🎓 Student Information Management System (SIMS)

A complete, full-stack **Student Information Management System** built with **React (Vite)**, **Node.js (Express)**, and **MongoDB Atlas**. Designed to be clean, responsive, robust, and beginner-friendly for college assignments and portfolio demonstrations.

---

## 🌟 Key Features

- **Add Student**: Enroll new students with client & server-side validation.
- **View All Students**: Responsive table layout for desktop and cards for mobile screens.
- **Search Functionality**: Instant, real-time search by **Student Name** or **Roll Number**.
- **Department & Year Filters**: Filter students by department and academic year.
- **Sort Records**: Sort by Name, Roll Number, Department, or Year (ascending / descending).
- **Update Student**: Edit existing student records with pre-filled modal and uniqueness verification.
- **Delete Student**: Delete student records with confirmation modal to prevent accidental deletion.
- **Student Profile Fields**:
  - `name`: Full Name
  - `rollNumber`: Unique College Roll / Registration Number (e.g., `CS2024001`)
  - `email`: Student Email Address (e.g., `student@college.edu`)
  - `department`: Engineering / College Department
  - `year`: Academic Year (`1st Year`, `2nd Year`, `3rd Year`, `4th Year`)
  - `phone`: Contact Phone Number
- **Live System Status**: Real-time status indicator showing backend connectivity health.
- **Sample Data Seeder**: Instant database seeding script with 10 sample student profiles.

---

## 🏗️ Architecture & Security

```text
┌───────────────────────┐         HTTP / JSON          ┌───────────────────────┐
│     React Frontend    │ ───────────────────────────> │  Express Backend API  │
│   (Vite + Lucide UI)  │ <─────────────────────────── │      (Node.js)        │
│   Deployed on Vercel  │       CORS Protected         │   Deployed on Render  │
└───────────────────────┘                              └───────────┬───────────┘
                                                                   │
                                                                   │ Mongoose ODM
                                                                   ▼
                                                       ┌───────────────────────┐
                                                       │     MongoDB Atlas     │
                                                       │   (Cloud Database)    │
                                                       └───────────────────────┘
```

### 🔒 Security Best Practices Implemented
- **No Hardcoded Secrets**: MongoDB URI and port configs are kept strictly in backend `.env` and loaded via `process.env.MONGODB_URI`.
- **Frontend Isolation**: Frontend never connects directly to MongoDB; all queries go through the Express REST API.
- **Dynamic CORS Protection**: CORS origin is configured via `FRONTEND_URL` to only permit authorized domains (local dev and your deployed Vercel domain).
- **Unique Constraints**: Prevents duplicate roll numbers or email addresses at both schema and controller levels.
- **Safe Error Responses**: Stack traces are hidden in production (`NODE_ENV=production`).

---

## 📁 Project Directory Structure

```text
Student-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection logic
│   │   ├── controllers/
│   │   │   └── studentController.js  # CRUD & statistics handlers
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js    # 404 and global error handlers
│   │   ├── models/
│   │   │   └── Student.js            # Mongoose Schema & Validation
│   │   ├── routes/
│   │   │   └── studentRoutes.js      # REST API route declarations
│   │   └── seed/
│   │       ├── seed.js               # Database seeding execution script
│   │       └── seedData.js           # 10 realistic sample students
│   ├── .env.example                  # Backend environment variable template
│   ├── .gitignore
│   ├── package.json                  # Backend dependencies & scripts
│   └── server.js                     # Express entry point & CORS configuration
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx # Delete confirmation dialog
│   │   │   ├── Navbar.jsx             # Top bar with health monitor
│   │   │   ├── StatsCards.jsx         # Dashboard metrics cards
│   │   │   ├── StudentCard.jsx        # Mobile responsive card component
│   │   │   ├── StudentFormModal.jsx   # Add & Edit modal with validation
│   │   │   ├── StudentTable.jsx       # Sortable tabular data display
│   │   │   └── Toast.jsx              # Feedback toast notifications
│   │   ├── services/
│   │   │   └── api.js                 # API abstraction & fetch calls
│   │   ├── utils/
│   │   │   └── formatters.js          # Avatar & text formatters
│   │   ├── App.jsx                    # Root application component
│   │   ├── index.css                  # Modern UI styles & design tokens
│   │   └── main.jsx                   # Vite entry point
│   ├── .env.example                  # Frontend environment variable template
│   ├── .gitignore
│   ├── index.html                     # HTML root template with fonts
│   ├── package.json                   # Frontend dependencies & scripts
│   ├── vercel.json                    # Vercel SPA routing configuration
│   └── vite.config.js                 # Vite configuration
│
├── render.yaml                        # Render deployment configuration
├── .gitignore                         # Repository-wide ignore file
└── README.md                          # Documentation & Setup Guide
```

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed:
1. **Node.js** (v18 or higher): Download from [nodejs.org](https://nodejs.org/)
2. **npm** (bundled with Node.js)
3. **MongoDB Atlas Account**: Free account from [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
4. **Git**: Installed on your system

---

## 🚀 Step-by-Step Local Setup

### Step 1: Set Up MongoDB Atlas Database

1. Log into your [MongoDB Atlas account](https://cloud.mongodb.com).
2. Create a **Free Cluster** (M0 Sandbox).
3. Under **Security → Database Access**, create a database user:
   - Authentication Method: **Password**
   - Username (e.g. `admin`)
   - Password (e.g. `MySecurePassword123`)
   - Database User Privileges: **Read and write to any database**
4. Under **Security → Network Access**:
   - Click **Add IP Address**
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) and confirm.
5. Under **Deployment → Database → Connect**:
   - Select **Drivers** (Node.js).
   - Copy your connection string. It will look like:
     ```text
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with your database user password and specify a database name like `/student_db`:
     ```text
     mongodb+srv://admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/student_db?retryWrites=true&w=majority&appName=Cluster0
     ```

---

### Step 2: Configure & Run the Backend

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux/macOS or Git Bash:
     ```bash
     cp .env.example .env
     ```

4. Open `backend/.env` in your text editor and update `MONGODB_URI`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/student_db?retryWrites=true&w=majority&appName=Cluster0
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. *(Optional but Recommended)* **Seed sample student data**:
   ```bash
   npm run seed
   ```
   *This populates your MongoDB Atlas database with 10 sample students.*

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Or `npm start`)*

   You should see:
   ```text
   🚀 Server running in [development] mode
   📡 Listening on http://localhost:5000
   📖 API endpoint: http://localhost:5000/api/students
   ✅ MongoDB Connected successfully
   ```

---

### Step 3: Configure & Run the Frontend

1. Open a **new terminal tab or window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux/macOS or Git Bash:
     ```bash
     cp .env.example .env
     ```

4. Ensure `frontend/.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit:
   ```text
   http://localhost:5173
   ```
   You will see the **EduManage** dashboard loaded with the sample students!

---

## 📡 REST API Reference

All routes are prefixed with `/api/students`.

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint | None |
| `GET` | `/api/students` | Get all students (with search & filters) | `?search=aarav&department=Computer+Science&year=3rd+Year` |
| `GET` | `/api/students/stats` | Aggregated dashboard stats | None |
| `GET` | `/api/students/:id` | Get single student details | URL Parameter `:id` |
| `POST` | `/api/students` | Enroll a new student | JSON `{ name, rollNumber, email, department, year, phone }` |
| `PUT` | `/api/students/:id` | Update an existing student | JSON `{ name, rollNumber, email, department, year, phone }` |
| `DELETE` | `/api/students/:id` | Delete a student | URL Parameter `:id` |

### Sample POST Request Body:
```json
{
  "name": "Riya Sen",
  "rollNumber": "CS2024099",
  "email": "riya.sen@college.edu",
  "department": "Computer Science",
  "year": "2nd Year",
  "phone": "+91 98765 12340"
}
```

---

## ☁️ Deployment Guide

### A. Deploy Backend to Render

1. Push your repository to **GitHub**.
2. Go to [render.com](https://render.com) and create an account.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `student-management-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI string*
   - `FRONTEND_URL`: *Leave blank or set to `*` initially; update with your Vercel URL once deployed.*
7. Click **Create Web Service**.
8. Once deployed, Render will provide a public URL like:
   `https://student-management-api.onrender.com`

---

### B. Deploy Frontend to Vercel (NOT Netlify)

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://student-management-api.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend, providing a live URL like:
   `https://student-management-frontend.vercel.app`

---

### C. Connect CORS between Render and Vercel

1. Go back to your **Render Dashboard** → Select your backend service.
2. Navigate to **Environment**.
3. Update the `FRONTEND_URL` variable:
   - `FRONTEND_URL`: `https://student-management-frontend.vercel.app`
4. Click **Save Changes** (Render will automatically redeploy with the updated CORS configuration).

---

## 🧪 Testing the Application Locally

1. **Verify Backend Status**:
   Visit `http://localhost:5000/api/health` in your browser. It should respond with `{"status":"healthy","database":"connected"}`.
2. **Add a Student**:
   Click "+ Add Student", fill out all fields, and click "Add Student". The student will instantly appear in the table with a success toast notification.
3. **Test Search**:
   Type a roll number or name into the search box. The table filters immediately.
4. **Test Department/Year Filter**:
   Change "All Departments" to "Computer Science" or "Mechanical Engineering".
5. **Update a Student**:
   Click the pencil icon on any student row, change the phone number or academic year, and click "Save Changes".
6. **Delete a Student**:
   Click the trash icon on any student, view the confirmation modal, and click "Delete Record".

---

## 👨‍💻 Technologies Used

- **Frontend**: React 18, Vite, Lucide Icons, Modern CSS3
- **Backend**: Node.js, Express.js, Mongoose ODM, Morgan Logger, CORS, Dotenv
- **Database**: MongoDB Atlas (Cloud NoSQL Database)
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Architecture**: RESTful API / MERN Stack
