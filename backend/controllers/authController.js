import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "green-guard-dev-secret";
const JWT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRE_MINUTES ? `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m` : "60m";
const DEMO_EMAIL = "demo@greenguard.local";
const DEMO_PASSWORD = "GreenGuard@123";

const createDemoUserIfNeeded = async () => {
  const user = await User.findOne({ email: DEMO_EMAIL.toLowerCase() });

  if (user) {
    return user;
  }

  return await User.create({
    name: "GreenGuard Demo",
    email: DEMO_EMAIL.toLowerCase(),
    password: await bcrypt.hash(DEMO_PASSWORD, 10),
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ detail: "Name is required" });
  }

  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ detail: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ detail: "Unable to create account" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      user = await createDemoUserIfNeeded();
    }

    if (!user) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = jwt.sign({ sub: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ detail: "Unable to log in" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body || {};

  if (!email || !String(email).trim()) {
    return res.status(400).json({ detail: "Email is required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        message: "If an account exists for this email, a reset link has been sent.",
        resetUrl: null,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:4173";
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    return res.json({
      message: "If an account exists for this email, a reset link has been sent.",
      resetUrl,
      email: user.email,
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ detail: "Unable to process password reset request" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body || {};

  if (!email || !token || !password) {
    return res.status(400).json({ detail: "Email, token, and new password are required" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ detail: "Password must be at least 8 characters long" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ detail: "Invalid or expired password reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ detail: "Unable to reset password" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ detail: "Unable to fetch profile" });
  }
};
