import { prisma } from "@/utils/prisma";
import { createUserParams } from "@/types/user-types";

export const createUser = async (data: createUserParams) => {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
    },
  });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
