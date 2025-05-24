const express = require("express");
const User = require("../db/User");

const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("Verification token is missing.");
  }

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).send("Invalid token.");
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.send(`
      <html>
        <body style="text-align: center; font-family: Arial, sans-serif;">
          <h1>Email Verified</h1>
          <p>Email verified successfully. You can now login to your account.</p>
          <button onclick="window.location.replace('${process.env.FRONTEND_URI}/login')">Login</button>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error verifying email.");
  }
});

module.exports = router;