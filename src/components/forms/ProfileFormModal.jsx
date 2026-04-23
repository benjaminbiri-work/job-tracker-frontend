import React, { useEffect, useState } from "react";
import { api } from "../../api/client";

const initial = {
  name: "",
  email: "",
  linkedin_url: "",
  birthday: "",
  location: "",
  phone_number: "",
  assigned_user_id: ""
};

export default function ProfileFormModal({ open, onClose, onSaved, profile, bidders }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        linkedin_url: profile.linkedin_url || "",
        birthday: profile.birthday ? String(profile.birthday).slice(0, 10) : "",
        location: profile.location || "",
        phone_number: profile.phone_number || "",
        assigned_user_id: profile.assigned_user_id || ""
      });
    } else {
      setForm(initial);
    }
  }, [profile]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (profile) {
        await api(`/admin/profiles/${profile.id}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await api("/admin/profiles", {
          method: "POST",
          body: JSON.stringify(form)
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
      <div className="modal-card wide">
        <div className="modal-header">
          <h3>{profile ? "Edit profile" : "Create profile"}</h3>
          <button className="ghost" type="button" onClick={onClose}>Close</button>
        </div>
        <form className="form-grid two-col" onSubmit={submit}>
          <label><span>Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label><span>LinkedIn URL</span><input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></label>
          <label><span>Birthday</span><input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} /></label>
          <label><span>Location</span><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
          <label><span>Phone Number</span><input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></label>
          <label className="full-width">
            <span>Assign bidder</span>
            <select value={form.assigned_user_id} onChange={(e) => setForm({ ...form, assigned_user_id: e.target.value })}>
              <option value="">Unassigned</option>
              {bidders.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.email})</option>)}
            </select>
          </label>
          {error ? <div className="alert error full-width">{error}</div> : null}
          <button disabled={saving} className="full-width" type="submit">{saving ? "Saving..." : "Save profile"}</button>
        </form>
      </div>
    </div>
  );
}
