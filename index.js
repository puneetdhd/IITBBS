// index.js
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const dotenv = require('dotenv');
const cors = require('cors');

require("./config/passportConfig");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "your-fallback-secret", // Required
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  console.log("working")

  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected here2"))
  .catch(err => console.log(err));
  console.log("MongoDB connected here");

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
