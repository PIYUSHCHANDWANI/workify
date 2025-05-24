// filepath: c:\job-portal\backend\routes\googleAuthRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

// Initiate authentication using Google
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google sign in
router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Create token or do any other logic you'd like
    // For example:
    const token = "qwertyuiopasdfghjklzxcvbnm1234567890";
    // Redirect, or send token via redirect query params
    res.redirect(`${process.env.FRONTEND_URI}?token=${token}`);
  }
);

module.exports = router;