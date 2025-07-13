import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";

import authRoutes from "./routes/auth.js";

const app = Fastify({ logger: true });

// Register Plugins
app.register(cors, { origin: "*" });
app.register(sensible);
app.register(jwt, { secret: "supersecret" }); // You should use env

// Add decorator for auth
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Register Routes
app.register(authRoutes, { prefix: "/api/auth" });

export default app;
