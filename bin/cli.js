#!/usr/bin/env node
const path = require('path');

const rawArg = (process.argv[2] || '').toLowerCase().trim();
const target = rawArg.startsWith('q') || isNaN(Number(rawArg)) ? rawArg : 'q' + rawArg;

const MAP = {
  template: { folder: 'TEMPLATE_EXAM_STARTER', port: 5000, name: 'Universal Starter Template' },
  q1: { folder: 'Q1_Book_Ecommerce_Roll_24-30', port: 5001, name: 'Q1: Book E-Commerce' },
  q2: { folder: 'Q2_Doctor_Appointment_Roll_31-38', port: 5002, name: 'Q2: Doctor Appointments' },
  q3: { folder: 'Q3_Expense_Tracker_Roll_39-45', port: 5003, name: 'Q3: Expense Tracker' },
  q4: { folder: 'Q4_Daily_Task_Manager_Roll_46-51_70', port: 5004, name: 'Q4: Daily Task Manager' },
  q5: { folder: 'Q5_Discussion_Forum_Roll_52-59', port: 5005, name: 'Q5: Discussion Forum' },
  q6: { folder: 'Q6_Teacher_Student_Dashboard_Roll_61-67', port: 5006, name: 'Q6: Student Gradebook' },
  q7: { folder: 'Q7_Product_User_Management', port: 5007, name: 'Q7: Product & User Management' },
  q8: { folder: 'Q8_Team_Member_Directory', port: 5008, name: 'Q8: Team Member Directory' },
  q9: { folder: 'Q9_Patient_Management', port: 5009, name: 'Q9: Patient Management' },
  verify: { file: 'verify_all.js', name: 'Verify All Suites' }
};

const selected = MAP[target];

if (!selected) {
  console.log(`
======================================================
  🎓 OST / Web Programming Lab Exam Solutions CLI
======================================================
Usage:
  hw <question>
  npx padhlemc/hw <question>

Commands:
  template  -> Universal Exam Starter (Port 5000)
  q1        -> Q1: Book E-Commerce (Port 5001)
  q2        -> Q2: Doctor Appointments (Port 5002)
  q3        -> Q3: Expense Tracker (Port 5003)
  q4        -> Q4: Daily Task Manager (Port 5004)
  q5        -> Q5: Discussion Forum (Port 5005)
  q6        -> Q6: Student Gradebook (Port 5006)
  q7        -> Q7: Product & User Management (Port 5007)
  q8        -> Q8: Team Member Directory (Port 5008)
  q9        -> Q9: Patient Management (Port 5009)
  verify    -> Test all 10 solutions simultaneously
======================================================
Example:
  hw q1
`);
  process.exit(0);
}

if (selected.file) {
  require(path.join(__dirname, '..', selected.file));
} else {
  const serverPath = path.join(__dirname, '..', selected.folder, 'backend', 'server.js');
  console.log(`\n🚀 Launching ${selected.name}...`);
  console.log(`🌐 Server running at: http://localhost:${selected.port}\n`);
  require(serverPath);
}
