import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Homelayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex w-full h-full">
      <div className="hidden lg:block w-80 h-full lg:fixed">
        <Sidebar />
      </div>
      <div className="w-full lg:ml-80">
        <Navbar />
        <div
          className="p-6 bg-[#fafbfc] dark:bg-background"
          style={{
            minHeight: "calc(100vh - 5rem)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Homelayout;
