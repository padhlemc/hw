# OST / Web Programming Lab IA-2: Complete Execution Guide & Solutions Manual

This repository contains complete, production-grade solutions for all **9 Internal Assessment (IA-2) & Lab Exam Questions**, plus the **Universal Exam Template Starter**.

### 🌟 Core Architecture:
- **Backend**: **Node.js + Express** with RESTful API endpoints and **Native MongoDB Driver (`MongoClient`, `ObjectId`)** with automatic offline fallback storage (`data_fallback.json`) so it **never crashes** if MongoDB is not running in your college lab.
- **Frontend**: **React 18** via CDN (with React Router for Q1, React Context API for Q5, reusable components & props for Q8, and hooks `useState`/`useEffect` across all questions).
- **Organization**: Each question has **cleanly separated `backend/` and `frontend/` directories**, its own `package.json`, and its own detailed `README.md`.

---

## ⚡ Master Quick Reference Table

| Question | Topic / Roll Numbers | Port | Folder | Quick Command | Browser URL |
|---|---|---|---|---|---|
| **Template** | **Universal Master Boilerplate** | `5000` | [`TEMPLATE_EXAM_STARTER`](TEMPLATE_EXAM_STARTER) | `npm run template` | [http://localhost:5000](http://localhost:5000) |
| **Q1** | **Roll 24 to 30**: Book E-Commerce Store | `5001` | [`Q1_Book_Ecommerce_Roll_24-30`](Q1_Book_Ecommerce_Roll_24-30) | `npm run q1` | [http://localhost:5001](http://localhost:5001) |
| **Q2** | **Roll 31 to 38**: Doctor Appointment Scheduling | `5002` | [`Q2_Doctor_Appointment_Roll_31-38`](Q2_Doctor_Appointment_Roll_31-38) | `npm run q2` | [http://localhost:5002](http://localhost:5002) |
| **Q3** | **Roll 39 to 45**: Daily Expense Tracker with Visual Progress Bars | `5003` | [`Q3_Expense_Tracker_Roll_39-45`](Q3_Expense_Tracker_Roll_39-45) | `npm run q3` | [http://localhost:5003](http://localhost:5003) |
| **Q4** | **Roll 46 to 51, 70**: Daily Task Manager with Filters | `5004` | [`Q4_Daily_Task_Manager_Roll_46-51_70`](Q4_Daily_Task_Manager_Roll_46-51_70) | `npm run q4` | [http://localhost:5004](http://localhost:5004) |
| **Q5** | **Roll 52 to 59**: Discussion Forum Threads with React Context API | `5005` | [`Q5_Discussion_Forum_Roll_52-59`](Q5_Discussion_Forum_Roll_52-59) | `npm run q5` | [http://localhost:5005](http://localhost:5005) |
| **Q6** | **Roll 61 to 67**: Teacher-Student Gradebook & Printable Report Card | `5006` | [`Q6_Teacher_Student_Dashboard_Roll_61-67`](Q6_Teacher_Student_Dashboard_Roll_61-67) | `npm run q6` | [http://localhost:5006](http://localhost:5006) |
| **Q7** | **Product & User Management**: Dual-tab CRUD with Regex Validation | `5007` | [`Q7_Product_User_Management`](Q7_Product_User_Management) | `npm run q7` | [http://localhost:5007](http://localhost:5007) |
| **Q8** | **Team Member Directory**: Reusable React Components & Props | `5008` | [`Q8_Team_Member_Directory`](Q8_Team_Member_Directory) | `npm run q8` | [http://localhost:5008](http://localhost:5008) |
| **Q9** | **Patient Management**: Health Record Management & Admission Portal | `5009` | [`Q9_Patient_Management`](Q9_Patient_Management) | `npm run q9` | [http://localhost:5009](http://localhost:5009) |

---

## 🚀 How to Run

### Method 1: The Quick 1-Command Run from Root (Fastest)
From the root directory:
```bash
# Run any question immediately:
npm run q1
npm run q2
# ...
npm run q9

# Or run the Universal Template:
npm run template

# Run the complete test verification suite:
npm run verify
```

### Method 2: Running Inside the Question Folder
```bash
# Step 1: Navigate to the question folder
cd Q1_Book_Ecommerce_Roll_24-30

# Step 2: Start the server
npm start
```
Open your browser at:
👉 **`http://localhost:5001`**

Express automatically serves both:
1. The **React 18 frontend** at `http://localhost:5001/`
2. The **REST API** at `http://localhost:5001/api/...`

---

### Method 3: Running Frontend & Backend in Separate Terminals
If your examiner explicitly asks to run the frontend and backend in separate terminal windows:

#### Terminal 1: Backend
```bash
cd Q1_Book_Ecommerce_Roll_24-30/backend
npm start
```
*The backend starts listening on `http://localhost:5001`.*

#### Terminal 2: Frontend
- **Option A**: Double-click `frontend/index.html` to open it in Chrome / Edge / Firefox directly.
- **Option B**: Use any static server (like Live Server or `serve`):
  ```bash
  cd Q1_Book_Ecommerce_Roll_24-30/frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5001/api` via CORS!*

---

## 🗄️ MongoDB Native Driver (`MongoClient`) Details

All backends use the official native MongoDB driver rather than Mongoose, matching typical university lab requirements:
```javascript
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('book_ecommerce');
const books = await db.collection('books').find().toArray();
```

### Automatic Offline Fallback Mode:
If MongoDB is not installed or running as a service in your lab exam:
- The server will **not crash**.
- It outputs: `[MongoClient] MongoDB offline. Seamless JSON fallback active.`
- All data operations (create, read, update, delete) are seamlessly persisted to `backend/data_fallback.json`.

---

## 📦 Clean Zip Distribution

The repository includes a clean, lightweight zip package `OST_Mock_Test_Solutions.zip` (<200KB) containing strictly the source code, starter template, and guides (free of `node_modules` clutter).

To extract on any machine:
```bash
# Windows PowerShell
Expand-Archive -Path OST_Mock_Test_Solutions.zip -DestinationPath ./my-solutions
```
Then install dependencies once in the root folder (`npm install`) and run any question with `npm start`!
