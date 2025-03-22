const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/attendance.log");

const logActivity = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(logFile, logMessage, "utf8");
    console.log(logMessage);
};

module.exports = { logActivity };
