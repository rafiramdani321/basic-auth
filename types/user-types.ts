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

export type tokenParams = {
  id?: string;
  userId: string;
  token: string;
  verifyExp: Date;
};

export type updatePasswordParams = {
  email: string;
  password: string;
  confirmPassword: string;
};
