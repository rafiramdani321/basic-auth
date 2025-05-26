import { registrationParams } from "@/types/auth-types";

export const registrationService = (data: registrationParams) => {
  try {
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
