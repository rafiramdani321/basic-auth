import { tokenParams } from "@/types/user-types";
import { prisma } from "@/utils/prisma";

export const createToken = (data: tokenParams) => {
  return prisma.token.create({
    data: {
      userId: data.userId,
      token: data.token,
      verifyExp: data.verifyExp,
    },
  });
};

export const deleteTokenByUserId = (userId: string) => {
  return prisma.token.delete({
    where: {
      userId,
    },
  });
};

export const findTokenByUserIdAndToken = (userId: string, token: string) => {
  return prisma.token.findFirst({
    where: {
      userId,
      token,
    },
  });
};
