// Componente Layout para proporcionar estructura consistente con navbar responsivo

import React from "react";
import Navbar from "@/components/Navbar";
import LiveChat from "@/components/LiveChat";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showNavbar = true,
}) => {
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      <LiveChat />
    </div>
  );
};

export default Layout;
