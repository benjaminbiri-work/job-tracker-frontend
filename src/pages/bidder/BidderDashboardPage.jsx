import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

export default function BidderDashboardPage() {
  const [data, setData] = useState(null);

  async function load() {
    setData(await api("/bidder/dashboard"));
  }

  useEffect(() => { load(); }, []);

  if (!data) return <Loader text="Loading dashboard..." />;

  async function toggleWork() {
    if (data.active_session) {
      await api("/work/stop", { method: "POST" });
    } else {
      await api("/work/start", { method: "POST" });
    }
    await load();
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Dashboard"
        subtitle="Start/stop work and see interview counts per assigned profile."
        action={<button onClick={toggleWork}>{data.active_session ? "Stop Work" : "Start Work"}</button>}
      />

      <div className="stats-grid">
        <StatCard title="Assigned Profiles" value={data.cards.assigned_profiles} />
        <StatCard title="Scheduled Interviews" value={data.cards.total_interviews} />
        <StatCard title="Interviews This Week" value={data.cards.this_week_interviews} />
      </div>

      <div className="panel">
        <h2>Interview counts per profile</h2>
        <table className="table">
          <thead><tr><th>Profile</th><th>Total scheduled</th><th>This week</th></tr></thead>
          <tbody>
            {data.profile_interviews.map((row) => (
              <tr key={row.profile_id}>
                <td>{row.profile_name}</td>
                <td>{row.total_interviews}</td>
                <td>{row.this_week_interviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
