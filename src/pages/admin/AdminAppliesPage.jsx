import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";

export default function AdminAppliesPage() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api("/admin/applies/profiles-summary").then((res) => setRows(res.rows));
  }, []);

  if (!rows) return <Loader text="Loading applies summary..." />;

  return (
    <div className="page-grid">
      <PageHeader title="Applies" subtitle="See apply totals by profile." />
      <div className="panel">
        <table className="table">
          <thead><tr><th>Profile</th><th>Total applies</th><th>Today</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.profile_id}>
                <td><Link className="inline-link" to={`/admin/applies/profile/${row.profile_id}`}>{row.profile_name}</Link></td>
                <td>{row.total_applies}</td>
                <td>{row.today_applies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
