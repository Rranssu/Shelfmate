const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const coreRoutes = require('./routes/coreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api', authRoutes);
app.use('/api', coreRoutes);
app.use('/api', adminRoutes);
app.use('/api', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});