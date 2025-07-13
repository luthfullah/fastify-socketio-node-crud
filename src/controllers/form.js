// src/controllers/form.js
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const createForm = async (req, reply) => {
  console.log("Form countreq.server:", req);
  const body = req.body;

  if (!body?.fullName || !body?.email || !body?.message) {
    return reply.code(400).send({ error: "All fields are required." });
  }

  const form = await prisma.form.create({
    data: { ...body },
  });

  // Emit updated count to all clients
  const formCount = await prisma.form.count();
  console.log("Form countreq.raw:", req.raw);
  req.server.io.emit("formCount", formCount);

  return reply.code(201).send({ msg: "Form submitted", form });
};

export const getForms = async (req, reply) => {
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
  });

  return reply.send(forms);
};
