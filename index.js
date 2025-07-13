import app from "./src/app.js";
import { Server } from "socket.io";

// Create Socket.IO instance first
const io = new Server(app.server, {
  cors: {
    origin: "*", // allow all origins (for development)
  },
});

// Decorate Fastify BEFORE calling `listen()`
app.decorate("io", io);

// Set up socket event listeners
io.on("connection", async (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  try {
    const { PrismaClient } = await import("./src/generated/prisma/index.js");
    const prisma = new PrismaClient();

    const formCount = await prisma.form.count();
    const userCount = await prisma.user.count();

    socket.emit("formCount", formCount);
    socket.emit("userCount", userCount);
  } catch (err) {
    console.error("Socket error:", err);
  }

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start the Fastify server AFTER decorating
const start = async () => {
  try {
    await app.listen({ port: 5000 });
    console.log("✅ Fastify server running at http://localhost:5000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
