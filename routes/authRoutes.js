const express = require("express");
const router = express.Router();
const User = require("../models/User");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "user"
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      error: error.message
    });
  }
});


// ==========================================
// SETUP TOTP MFA
// POST /api/auth/setup-mfa
// ==========================================
router.post("/setup-mfa", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const secret = speakeasy.generateSecret({
      name: `Campus Event Management (${email})`
    });

    user.totpSecret = secret.base32;
    user.mfaEnabled = false;

    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      message: "MFA setup generated successfully",
      secret: secret.base32,
      qrCode: qrCode
    });

  } catch (error) {
    res.status(500).json({
      message: "Error setting up MFA",
      error: error.message
    });
  }
});


// ==========================================
// VERIFY TOTP MFA
// POST /api/auth/verify-mfa
// ==========================================
router.post("/verify-mfa", async (req, res) => {
  try {
    const { email, token: totpCode } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.totpSecret) {
      return res.status(404).json({
        message: "MFA setup not found for this user"
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: totpCode,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({
        message: "Invalid MFA code"
      });
    }

    user.mfaEnabled = true;

    await user.save();

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "MFA verification successful. Login completed.",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error verifying MFA",
      error: error.message
    });
  }
});


// ==========================================
// LOGIN WITH PASSWORD
// POST /api/auth/login
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.mfaEnabled) {
      return res.status(403).json({
        message: "MFA is not enabled for this account"
      });
    }

    res.status(200).json({
      message: "Password verified. MFA verification required.",
      mfaRequired: true,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
});


module.exports = router;