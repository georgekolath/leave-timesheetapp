const express = require('express');
const cors = require('cors');
const timesheetRoutes = require('./routes/timesheet');
const leaveRoutes = require('./routes/leave');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/timesheet', timesheetRoutes);
app.use('/api/leave', leaveRoutes);

// Default route for GET /
app.get('/', (req, res) => {
  res.send('Welcome to the Leave & Timesheet Management Backend API');
});

app.listen(5000, () => console.log('Server running on port 5000'));