const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routers/authRoutes");
const patientRoutes = require("./src/routers/patientRoutes");

const app = express();

const defaultOrigins = ["http://localhost:3000"];
const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);

module.exports = app;
