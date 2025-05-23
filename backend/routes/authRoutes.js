const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authKeys = require("../lib/authKeys");
const transporter = require("../lib/mailer");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

router.post("/signup", (req, res) => {
  const data = req.body;
  // generate a verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Prepare user data and include resume and profile if applicant
  let userData = {
    email: data.email,
    password: data.password,
    type: data.type,
    isVerified: false,
    emailVerificationToken: verificationToken,
  };

  if (data.type === "applicant") {
    userData.resume = data.resume;     // cloudinary url from FileUploadInput
    userData.profile = data.profile;   // cloudinary url from FileUploadInput
  }

  let user = new User(userData);

  user
    .save()
    .then(() => {
      // Continue with creating details in job-specific collection if needed.
      const userDetails =
        user.type === "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              contactNumber: data.contactNumber,
              bio: data.bio,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              education: data.education,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,   // You can also save these here if desired.
              profile: data.profile, // Duplicate storage optional
            });
      userDetails
        .save()
        .then(() => {
          // send verification email
          const verificationLink = `${process.env.BACKEND_URI}/auth/verify-email?token=${verificationToken}`;
          const mailOptions = {
            from: '"Worify" <workify0504@gmail.com>',
            to: user.email,
            subject: "Please verify your email",
            text: `Click on the following link to verify your email: ${verificationLink}`,
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({
                message: "Error sending verification email",
              });
            }
            res.json({
              message:
                "Signup successful. A verification email has been sent to your address.",
            });
          });
        })
        .catch((err) => {
          user.delete().then(() => {
            res.status(400).json(err);
          });
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Modified login route: deny login if email not verified.
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      if (!user.isVerified) {
        return res.status(403).json({
          message: "Email not verified. Please check your email to verify.",
        });
      }
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

module.exports = router;