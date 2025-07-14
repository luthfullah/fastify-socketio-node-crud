import { login } from "../controllers/auth.js";
import { createForm, getForms } from "../controllers/form.js";
import { PrismaClient } from "../generated/prisma/index.js";
// adjust path as needed
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export default async function (app, opts) {
  // Register
  app.post("/register", async (req, reply) => {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.code(400).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const userCount = await prisma.user.count();
    app.io.emit("userCount", userCount);

    return { msg: "User registered", user: { id: user.id, email: user.email } };
  });

  // Login
  app.post("/login", async (req, reply) => {
    return login(req, reply, app); // ⬅️ Calling controller function
  });

  //forms
  app.post("/submit", createForm);
  app.get("/forms", getForms);

  // Protected route
  app.get("/me", { preValidation: [app.authenticate] }, async (req, reply) => {
    return { user: req.user };
  });
}
