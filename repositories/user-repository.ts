import { prisma } from "@/utils/prisma";
import { createUserParams } from "@/types/user-types";

export const createUser = async (data: createUserParams) => {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      isVerified: false,
    },
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const updateIsVerifiedByUserId = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};

export const updatePasswordByUserId = async (
  userId: string,
  password: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: password },
  });
};
