import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import InterviewFormModal from "../../components/forms/InterviewFormModal";
import Tag from "../../components/Tag";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminInterviewsPage() {
  const [data, setData] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const [iv, pr] = await Promise.all([
      api("/admin/interviews"),
      api("/admin/profiles"),
    ]);
    setData(iv.interviews);
    setProfiles(pr.profiles);
  }

  function truncate(text, max = 60) {
    if (!text) return "-";
    return text.length > max ? text.slice(0, max) + "..." : text;
  }
  
  useEffect(() => {
    load();
  }, []);

  if (!data) return <Loader text="Loading interviews..." />;

  async function remove(id) {
    if (!confirm("Delete this interview?")) return;
    await api(`/admin/interviews/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Interviews"
        subtitle="Manage interviews, stack tags, process tags, current step, and additional info."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Create interview
          </button>
        }
      />

      <InterviewFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
        profiles={profiles}
        interview={editing}
      />

      <div className="panel dark-panel">
        <div className="table-scroll">
          <table className="table interview-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Company</th>
                <th>Current step</th>
                <th>Stacks</th>
                <th>Processes</th>
                <th>Additional info</th>
                <th>Assignee</th>
                <th>Due date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Tag tone="blue">{row.profile_name}</Tag>
                  </td>
                  <td className="strong-cell">{row.company}</td>
                  <td>
                    <Tag tone="green">{row.current_step || "-"}</Tag>
                  </td>
                  <td>
                    <div className="tag-wrap">
                      {(row.tech_stacks || []).map((t) => (
                        <Tag key={t} tone="brown">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="tag-wrap">
                      {(row.processes || []).map((p) => (
                        <Tag key={p} tone="pink">
                          {p}
                        </Tag>
                      ))}
                    </div>
                  </td>
                  <td title={row.additional_info}>
                    {truncate(row.additional_info, 60)}
                  </td>
                  <td>{row.assigned_user_name || "-"}</td>
                  <td>
                    {row.due_date ? String(row.due_date).slice(0, 10) : "-"}
                  </td>
                  <td className="actions-row">
                    <button
                      className="ghost"
                      onClick={() => {
                        setEditing(row);
                        setOpen(true);
                      }}
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => remove(row.id)}
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
    </div>
  );
}
