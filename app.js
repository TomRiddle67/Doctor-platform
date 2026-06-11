const express = require("express");
const app = express();

app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ succes: true, message: "server is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));


module.exports = app;
