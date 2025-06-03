import { userDecodeToken } from "@/types/user-types";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_TOKEN = process.env.JWT_TOKEN || "token_secret";

export const signToken = (payload: object, expiresIn: string = "1h") => {
  return jwt.sign(payload, JWT_TOKEN as jwt.Secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): userDecodeToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN) as JwtPayload;

    if (
      typeof decoded === "object" &&
      decoded.id &&
      decoded.email &&
      decoded.username &&
      decoded.iat &&
      decoded.exp
    ) {
      return {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};
