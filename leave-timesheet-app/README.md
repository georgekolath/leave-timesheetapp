# Leave & Timesheet Management System

This is a full-stack application for managing employee timesheets, leave requests, and comp off tracking, with an alert system for missing timesheet entries.

## Features
- Timesheet entry for each day of the week (billable, non-billable, comp off)
- Leave management with comp off integration
- Alert pop-up for missing timesheet entries
- Data persistence via backend API
- Responsive UI with Bootstrap

## Folder Structure
```
leave-timesheet-app/
├── backend/
│   ├── server.js
│   ├── models/
│   └── routes/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timesheet.jsx
│   │   │   ├── Leave.jsx
│   │   │   └── AlertPopup.jsx
│   │   ├── App.jsx
│   │   └── api.js
│   ├── package.json
│   └── ...
└── README.md
```

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

## Backend Setup
1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   npm install express cors body-parser
   ```
3. Start the backend server:
   ```powershell
   node server.js
   ```

## Frontend Setup
1. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install react react-dom bootstrap
   ```
3. Start the frontend development server:
   ```powershell
   npm start
   ```

## Packages Used
- **Backend:**
  - express
  - cors
  - body-parser
- **Frontend:**
  - react
  - react-dom
  - bootstrap

## Usage Instructions
1. Start the backend server (see above).
2. Start the frontend server (see above).
3. Open the frontend in your browser (usually http://localhost:3000).
4. Use the Timesheet tab to enter billable/non-billable/comp off hours.
5. Use the Leave Management tab to apply for leave and update comp off.
6. Alerts will pop up for missing timesheet entries.

## Notes
- Ensure both backend and frontend servers are running for full functionality.
- API endpoints are hardcoded for local development; update as needed for deployment.
- For production, consider using a database (e.g., MongoDB, PostgreSQL) for persistence.

## Code Files
All main code files are in the `frontend/src/components` and `backend` folders. You can copy these files as text to another system and follow the setup instructions above.

---
For any issues or questions, please contact the project maintainer.
