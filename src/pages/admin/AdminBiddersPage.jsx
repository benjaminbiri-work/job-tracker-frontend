import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";

export default function AdminBiddersPage() {
  const [rows, setRows] = useState(null);

  async function load() {
    const res = await api("/admin/bidders");
    setRows(res.bidders);
  }

  useEffect(() => { load(); }, []);

  if (!rows) return <Loader text="Loading bidders..." />;

  async function toggleApproval(id, approved) {
    await api(`/admin/bidders/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify({ approved: !approved })
    });
    await load();
  }

  async function toggleActive(id, is_active) {
    await api(`/admin/bidders/${id}/active`, {
      method: "PUT",
      body: JSON.stringify({ is_active: !is_active })
    });
    await load();
  }

  return (
    <div className="page-grid">
      <PageHeader title="Bidders" subtitle="Approve inactive accounts and activate/deactivate bidders." />
      <div className="panel">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Approved</th><th>Active</th><th>Online</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.approved ? "Yes" : "No"}</td>
                <td>{row.is_active ? "Yes" : "No"}</td>
                <td>{row.online ? "Online" : "Offline"}</td>
                <td className="actions-row">
                  <button className="ghost" onClick={() => toggleApproval(row.id, row.approved)}>{row.approved ? "Revoke" : "Approve"}</button>
                  <button className={row.is_active ? "danger-btn" : ""} onClick={() => toggleActive(row.id, row.is_active)}>{row.is_active ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
