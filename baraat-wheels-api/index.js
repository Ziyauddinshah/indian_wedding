const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const errorHandler = require("./utils/errorHandler");

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies

// Allow requests from your frontend origin with credentials
app.use(
  cors({
    origin: "http://localhost:3000", // no trailing slash
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = require("./database/db");
connectDB();

const userRoutes = require("./routes/userRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/users", userRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/notifications", notificationRoutes);

const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);

//Home page
app.use("/", (req, res) => {
  res.status(200).send("Home Page of Room On Rent Server");
});

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ server running on port ${PORT}`);
});
