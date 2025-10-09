import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
