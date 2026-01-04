import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// ===== Create User =====
const createUserService = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: userSelect,
  });

  return user;
};

// ===== Get All Users =====
const getAllUserService = async () => {
  const users = await prisma.user.findMany({
    select: userSelect,
  });
  return users;
};

// ===== Get User By ID =====
const getUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) throw new Error("User not found");
  return user;
};

// ===== Patch User =====
const patchUserService = async (id, data) => {
  const updateData = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });

  return updatedUser;
};

// ===== Delete User =====
const deleteUserService = async (id) => {
  await prisma.user.delete({ where: { id } });
};

export {
  createUserService,
  getAllUserService,
  getUserByIdService,
  patchUserService,
  deleteUserService,
};

// Error yg tidak explisit ditangani oleh handler
