const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// ✅ Register New User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Local Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ msg: info.message });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  })(req, res, next);
});

// ✅ Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Logout route (JWT-based authentication)
router.post("/logout", (req, res) => {
  try {
    // Since JWT is stateless, tell the client to remove the token
    res.json({ msg: "Logged out successfully. Please remove the token from local storage." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authMiddleware = require("../middleware/auth"); // Your JWT middleware

// ✅ Get Current Authenticated User
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
