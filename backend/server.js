const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appointmentRoutes = require('./routes/appointments');
const invoiceRoutes = require('./routes/invoices');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});