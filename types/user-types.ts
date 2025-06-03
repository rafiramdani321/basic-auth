export type createUserParams = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type loginParams = {
  email: string;
  password: string;
};

export type userDecodeToken = {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
};
