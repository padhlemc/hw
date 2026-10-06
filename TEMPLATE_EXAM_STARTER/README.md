# 🎯 Universal Full-Stack Exam Template Starter

This is the **Master Boilerplate** that you can use to solve **ANY full-stack exam question** (Books, Doctors, Expenses, Tasks, Forums, Students, Patients, Products, etc.) by changing **only 4 things**!

---

## ⚡ Quick 2-Step Run
```bash
# 1. Open terminal in this folder
cd TEMPLATE_EXAM_STARTER

# 2. Run in 1 command
npm start
```
Open your browser at: **`http://localhost:5000`**

---

## 🔄 The "Change Only 4 Things" Customization Rule

| Step | File | What to Change | Example for "Patient Management" |
|---|---|---|---|
| **1. Port & Collection** | `backend/server.js` | Change `PORT` and `COLLECTION_NAME` | `const PORT = 5009; const COLLECTION_NAME = 'patients';` |
| **2. Initial Schema** | `backend/server.js` | Change default mock array fields in `memoryData` | `{ id: '1', name: 'John Doe', age: 45, disease: 'Fever' }` |
| **3. React Form State** | `frontend/app.jsx` | Change `initialForm` and input fields | `const initialForm = { name: '', age: '', disease: '' };` |
| **4. React Table Rows** | `frontend/app.jsx` | Change `<th>` headers and `<td>` mapping | `<td>{item.name}</td><td>{item.age}</td><td>{item.disease}</td>` |

That's it! All Express routing, CORS, MongoDB connectivity, offline resilience, and React state logic work out of the box.

For complete in-depth documentation and mapping tables for all questions, see [**UNIVERSAL_EXAM_TEMPLATE.md**](../UNIVERSAL_EXAM_TEMPLATE.md).
