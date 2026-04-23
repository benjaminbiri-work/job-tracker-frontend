import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import ApplyFormModal from "../../components/forms/ApplyFormModal";
import Tag from "../../components/Tag";

export default function BidderApplyPage() {
  const { profileId } = useParams();
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const res = await api(`/bidder/profiles/${profileId}/apply-data?q=${encodeURIComponent(query)}`);
    setData(res);
  }

  useEffect(() => { load(); }, [profileId, query]);

  if (!data) return <Loader text="Loading apply page..." />;

  async function remove(id) {
    if (!confirm("Delete this apply?")) return;
    await api(`/applies/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="page-grid">
      <PageHeader
        title={`Apply - ${data.profile.name}`}
        subtitle="Total applies today, previous applies, and this week's scheduled interviews."
        action={<button onClick={() => { setEditing(null); setOpen(true); }}>Add job link</button>}
      />

      <ApplyFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
        profileId={profileId}
        initial={editing}
      />

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-title">Applies Today</div><div className="stat-value">{data.stats.today_applies}</div></div>
        <div className="stat-card"><div className="stat-title">Total Applies</div><div className="stat-value">{data.stats.total_applies}</div></div>
        <div className="stat-card"><div className="stat-title">This Week Scheduled Interviews</div><div className="stat-value">{data.stats.this_week_interviews}</div></div>
      </div>

      <div className="panel">
        <input placeholder="Search by company name, job title, or job link" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="two-panels">
        <div className="panel">
          <h2>Previous applies</h2>
          <table className="table">
            <thead><tr><th>Company</th><th>Job title</th><th>Link</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {data.applies.map((row) => (
                <tr key={row.id}>
                  <td>{row.company_name}</td>
                  <td>{row.job_title}</td>
                  <td><a href={row.job_site_url} target="_blank" rel="noreferrer">Open</a></td>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td className="actions-row">
                    <button className="ghost" onClick={() => { setEditing(row); setOpen(true); }}>Edit</button>
                    <button className="danger-btn" onClick={() => remove(row.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
