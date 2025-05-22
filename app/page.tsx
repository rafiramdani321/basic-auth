import Image from "next/image";
import NavLink from "./_components/nav";
import Login from "./login/page";

export default function Home() {
  return (
    <div className="bg-emerald-600 h-16 flex w-full items-center">
      <div className="flex w-full justify-between px-56">
        <NavLink />
        <Login />
      </div>
    </div>
  );
}
