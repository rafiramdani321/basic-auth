import React from "react";
import Navbar from "./_components/navbar";

const LayoutBrowser = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="mt-5 px-56">{children}</div>
    </>
  );
};

export default LayoutBrowser;
