// Import React for TypeScript typing
import React from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

// TYPESCRIPT INTERFACE

// Define props interface for Layout component
// This tells TypeScript what props Layout accepts
interface LayoutProps {
  // children: Can be any valid React element(s)
  // This is what gets passed between <Layout> tags
  children: React.ReactNode;
}

// LAYOUT COMPONENT

// Layout component accepts children prop (typed with LayoutProps)
// Destructuring: { children } extracts children from props object
// : LayoutProps provides TypeScript type information
function Layout({ children }: LayoutProps) {
  return (
    // Main container

    // This ensures footer stays at bottom even with little content
    <div className="flex flex-col min-h-screen">
      {/* Navbar (fixed at top) */}
      <Navbar />

      {/* Main content area */}

      {/* This is where page content (Home, Dashboard, etc.) renders */}
      <main className="flex-1">{children}</main>

      {/* Footer (fixed at bottom) */}
      <Footer />
    </div>
  );
}

// EXPORT

export default Layout;
