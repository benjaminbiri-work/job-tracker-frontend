import React from "react";
import Sidebar from "../components/Sidebar";

const items = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/profiles", label: "Profiles" },
  { to: "/admin/applies", label: "Applies" },
  { to: "/admin/interviews", label: "Interviews" },
  { to: "/admin/bidders", label: "Bidders" }
];

export default function AdminLayout({ children }) {
  return (
    <div className="shell">
      <Sidebar title="Admin Portal" items={items} />
      <main className="content">{children}</main>
    </div>
  );
}
