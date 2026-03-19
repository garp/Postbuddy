import express from "express";
import fs from "fs";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import morganBody from 'morgan-body';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { connect } from "./config/database.js";
import router from "./routes/index.js";
import cors from "cors";
import { ipDetails } from "./utils/getIpDetails.js";
import compression from "compression";
import dotenv from "dotenv";
dotenv.config({
  path: `./.env`,
});

morganBody(app);
const PORT = process.env.PORT || 4000;

app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGIN.spilt(",").map(origin => origin.trim()) : [];
const corsOptions = {
  origin: function(origin, callback){
    if(!origin){
      return callback(null, true);
    }
    if(allowedOrigins.includes(origin)){
      return callback(null, true)
    }
    else{
      return callback(new Error("Not allowed by CORS"));
    }
  },
  // origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.get("/health-check", async (req, res) => {
  const con = await ipDetails(req);
  res.json({ country: con, mes: "Server is running..." });
});

app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const logDir = "logs";
    const logFile = `${logDir}/subscribe.log`;
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, "utf8");
      const lines = fileContent.split("\n");
      const alreadySubscribed = lines.some((line) => {
        const parts = line.split(" - ");
        if (parts.length === 2) {
          const loggedEmail = parts[1].trim();
          return loggedEmail === email;
        }
        return false;
      });

      if (alreadySubscribed) {
        return res.status(200).json({ message: "Already subscribed" });
      }
    }
    const istDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const logEntry = `${istDate} - ${email}\n`;
    fs.appendFileSync(logFile, logEntry, "utf8");
    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error in /subscribe route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log("Server started on : ", PORT);
  connect();
});
