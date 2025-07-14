//src/controllers/auth.js
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const login = async (req, reply, app) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return reply.code(401).send({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return reply.code(401).send({ error: "Invalid credentials" });

  const token = app.jwt.sign({ id: user.id, email: user.email });

  return reply.send({ token });
};
