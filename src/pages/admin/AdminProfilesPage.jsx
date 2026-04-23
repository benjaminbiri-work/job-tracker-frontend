import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import ProfileFormModal from "../../components/forms/ProfileFormModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminProfilesPage() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const [profilesRes, biddersRes] = await Promise.all([
      api("/admin/profiles"),
      api("/admin/bidders"),
    ]);
    setData({ profiles: profilesRes.profiles, bidders: biddersRes.bidders });
  }

  useEffect(() => {
    load();
  }, []);

  if (!data) return <Loader text="Loading profiles..." />;

  async function removeProfile(id) {
    if (!confirm("Delete this profile?")) return;
    await api(`/admin/profiles/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Profiles"
        subtitle="Create, update, assign, reassign, and delete profiles."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Create profile
          </button>
        }
      />

      <ProfileFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
        profile={editing}
        bidders={data.bidders.filter((b) => b.is_active)}
      />

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>LinkedIn</th>
              <th>Location</th>
              <th>Birthday</th>
              <th>Phone</th>
              <th>Assigned bidder</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.profiles.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link
                    className="inline-link"
                    to={`/admin/applies/profile/${p.id}`}
                  >
                    {p.name}
                  </Link>
                </td>
                <td>{p.email || "-"}</td>
                <td>
                  {p.linkedin_url ? (
                    <a
                      className="inline-link"
                      href={p.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{p.location || "-"}</td>
                <td>{p.birthday ? String(p.birthday).slice(0, 10) : "-"}</td>
                <td>{p.phone_number || "-"}</td>
                <td>{p.assigned_user_name || "Unassigned"}</td>
                <td className="actions-row">
                  <button
                    className="ghost"
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => removeProfile(p.id)}
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
