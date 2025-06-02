import { NextResponse } from "next/server";

export const successResponse = (
  message: string = "Success",
  status: number = 200,
  data: any = null
) => {
  return NextResponse.json({ message, status, data }, { status });
};

export const errorResponse = (
  error: string = "Internal Server Error",
  status: number = 500,
  details: any = null
) => {
  return NextResponse.json({ error, status, details }, { status });
};
