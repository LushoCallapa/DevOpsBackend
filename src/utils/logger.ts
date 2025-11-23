import fs from "fs";
import path from "path";

const LOG_DIR = path.join(__dirname, "../../logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function logEvent(message: string) {
  const logFile = path.join(LOG_DIR, "backend.log");
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error("Error writing log:", err);
  });
}
