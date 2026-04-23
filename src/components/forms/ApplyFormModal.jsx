import React, { useMemo, useState } from "react";
import { api } from "../../api/client";

function isValidHttpUrl(value) {
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(withProtocol);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function ApplyFormModal({ open, onClose, onSaved, profileId, initial }) {
  const [form, setForm] = useState(initial || { company_name: "", job_title: "", job_site_url: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const valid = useMemo(() => isValidHttpUrl(form.job_site_url || ""), [form.job_site_url]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (!valid) {
      setSaving(false);
      setError("Please enter a valid http/https URL.");
      return;
    }
    try {
      if (initial?.id) {
        await api(`/applies/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await api("/applies/check-duplicate", {
          method: "POST",
          body: JSON.stringify({ profile_id: profileId, job_site_url: form.job_site_url })
        });
        await api("/applies", {
          method: "POST",
          body: JSON.stringify({ profile_id: profileId, ...form })
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initial?.id ? "Edit apply" : "Add apply"}</h3>
          <button className="ghost" type="button" onClick={onClose}>Close</button>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label><span>Company name</span><input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></label>
          <label><span>Job title</span><input required value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} /></label>
          <label>
            <span>Job link URL</span>
            <input required value={form.job_site_url} onChange={(e) => setForm({ ...form, job_site_url: e.target.value })} />
            {form.job_site_url ? <small className={valid ? "ok" : "bad"}>{valid ? "Valid URL format" : "Invalid URL format"}</small> : null}
          </label>
          {error ? <div className="alert error">{error}</div> : null}
          <button disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
  );
}
