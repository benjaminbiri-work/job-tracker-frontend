import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";

export default function BidderProfilesPage() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api("/bidder/profiles").then((res) => setRows(res.profiles));
  }, []);

  if (!rows) return <Loader text="Loading assigned profiles..." />;

  return (
    <div className="page-grid">
      <PageHeader title="My Profiles" subtitle="Profiles assigned by admin. Click a profile to go to its apply page." />
      <div className="card-grid">
        {rows.map((row) => (
          <Link className="card clickable" key={row.id} to={`/profiles/${row.id}/apply`}>
            <h3>{row.name}</h3>
            <p><strong>Email:</strong> {row.email || "-"}</p>
            <p><strong>LinkedIn:</strong> {row.linkedin_url || "-"}</p>
            <p><strong>Location:</strong> {row.location || "-"}</p>
            <p className="muted">Read only profile information</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
