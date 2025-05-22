import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div>
      <Link
        href={"/login"}
        className="text-emerald-600 font-semibold text-base border bg-background px-2.5 py-2 rounded-md hover:ring-2 hover:ring-emerald-400"
      >
        Login
      </Link>
    </div>
  );
};

export default Login;
