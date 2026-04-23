// client/src/pages/admin/AdminAppliesProfilePage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import ApplyFormModal from "../../components/forms/ApplyFormModal";
import { FaBackward, FaForward } from "react-icons/fa";

export default function AdminAppliesProfilePage() {
  const { profileId } = useParams();

  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);
  const limit = 100;

  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  async function load(targetPage = page) {
    setIsLoading(true);
    const res = await api(
      `/applies/profile/${profileId}?q=${encodeURIComponent(
        query
      )}&from=${from}&to=${to}&page=${targetPage}&limit=${limit}`
    );

    setData(res);
    setPage(targetPage);
    setIsLoading(false);
  }

  useEffect(() => {
    load(1);
  }, [profileId]);

  if (!data || isLoading) return <Loader text="Loading applies..." />;

  async function removeApply(id) {
    if (!confirm("Delete this apply?")) return;

    await api(`/applies/${id}`, {
      method: "DELETE"
    });

    load(page);
  }

  function submitFilters() {
    load(1);
  }

  function clearFilters() {
    setQuery("");
    setFrom("");
    setTo("");
    setTimeout(() => load(1), 0);
  }

  const pg = data.pagination;

  return (
    <div className="page-grid">
      <PageHeader
        title={`Applies - ${data.profile.name}`}
        subtitle="Search, filter by date, and paginate 100 rows per page."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Apply
          </button>
        }
      />

      <ApplyFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => load(page)}
        profileId={profileId}
        initial={editing}
      />

      {/* Filters */}
      <div className="panel">
        <div className="filter-row">
          <input
            placeholder="Search company, title, url"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <button onClick={submitFilters}>Filter</button>
          <button className="ghost" onClick={clearFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Applies</div>
          <div className="stat-value">{data.stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Today</div>
          <div className="stat-value">{data.stats.today}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Filtered Results</div>
          <div className="stat-value">{pg.totalItems}</div>
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Job Title</th>
              <th>Job Link</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.applies.length === 0 ? (
              <tr>
                <td colSpan="6">No applies found.</td>
              </tr>
            ) : (
              data.applies.map((row, index) => (
                <tr key={row.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{row.company_name}</td>
                  <td>{row.job_title}</td>
                  <td>
                    <a
                      href={row.job_site_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </td>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td className="actions-row">
                    <button
                      className="ghost"
                      onClick={() => {
                        setEditing(row);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => removeApply(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="panel">
        <div className="pagination-row">
          <button
            disabled={!pg.hasPrev}
            onClick={() => load(page - 1)}
          >
            <FaBackward size={14} />
          </button>

          <span style={{ margin: "0 8px" }}>
            Page {pg.page} / {pg.totalPages}
          </span>

          <button
            disabled={!pg.hasNext}
            onClick={() => load(page + 1)}
          >
            <FaForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}