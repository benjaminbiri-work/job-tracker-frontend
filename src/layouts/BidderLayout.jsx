import React from "react";
import Sidebar from "../components/Sidebar";

const items = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profiles", label: "My Profiles" }
];

export default function BidderLayout({ children }) {
  return (
    <div className="shell">
      <Sidebar title="Bidder Portal" items={items} />
      <main className="content">{children}</main>
    </div>
  );
}
