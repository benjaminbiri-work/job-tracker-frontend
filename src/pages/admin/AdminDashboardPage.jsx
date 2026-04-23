import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  async function load() {
    setData(await api("/admin/dashboard"));
  }

  useEffect(() => { load(); }, []);

  if (!data) return <Loader text="Loading dashboard..." />;

  return (
    <div className="page-grid">
      <PageHeader title="Dashboard" subtitle="Total applies, today's applies by profile, interviews this week, and online bidders." />
      <div className="stats-grid four">
        <StatCard title="Total Applies" value={data.cards.total_applies} />
        <StatCard title="Applies Today" value={data.cards.applies_today} />
        <StatCard title="Interviews This Week" value={data.cards.interviews_this_week} />
        <StatCard title="Online Bidders" value={data.cards.online_bidders} />
      </div>

      <div className="two-panels">
        <div className="panel">
          <h2>Applies by profile</h2>
          <table className="table">
            <thead><tr><th>Profile</th><th>Total</th><th>Today</th></tr></thead>
            <tbody>
              {data.profile_stats.map((row) => (
                <tr key={row.profile_id}>
                  <td>{row.profile_name}</td>
                  <td>{row.total_applies}</td>
                  <td>{row.today_applies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Online bidders</h2>
          <table className="table">
            <thead><tr><th>Bidder</th><th>Email</th><th>Status</th></tr></thead>
            <tbody>
              {data.bidders.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.online ? "Online" : "Offline"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
