const { spawn } = require("child_process");

console.log("Starting backend server...");

const server = spawn("npx", ["tsx", "src/server/server.ts"], {
  stdio: "inherit",
  env: { ...process.env },
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the process alive
process.on("SIGINT", () => {
  console.log("Shutting down...");
  server.kill("SIGTERM");
  process.exit(0);
});
