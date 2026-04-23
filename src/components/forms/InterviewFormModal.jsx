import React, { useEffect, useState } from "react";
import { api } from "../../api/client";

const initial = {
  profile_id: "",
  company: "",
  tech_stacks: "",
  processes: "",
  current_step: "",
  additional_info: "",
  due_date: ""
};

export default function InterviewFormModal({ open, onClose, onSaved, profiles, interview }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (interview) {
      setForm({
        profile_id: interview.profile_id || "",
        company: interview.company || "",
        tech_stacks: (interview.tech_stacks || []).join(", "),
        processes: (interview.processes || []).join(", "),
        current_step: interview.current_step || "",
        additional_info: interview.additional_info || "",
        due_date: interview.due_date ? String(interview.due_date).slice(0, 10) : ""
      });
    } else {
      setForm({ ...initial, profile_id: profiles[0]?.id || "" });
    }
  }, [interview, profiles]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tech_stacks: form.tech_stacks.split(",").map((s) => s.trim()).filter(Boolean),
      processes: form.processes.split(",").map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (interview) {
        await api(`/admin/interviews/${interview.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await api("/admin/interviews", {
          method: "POST",
          body: JSON.stringify(payload)
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
          <h3>{interview ? "Edit interview" : "Create interview"}</h3>
          <button type="button" className="ghost" onClick={onClose}>Close</button>
        </div>
        <form className="form-grid two-col" onSubmit={submit}>
          <label>
            <span>Profile</span>
            <select value={form.profile_id} onChange={(e) => setForm({ ...form, profile_id: e.target.value })}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label><span>Company</span><input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
          <label><span>Tech stacks tags</span><input value={form.tech_stacks} onChange={(e) => setForm({ ...form, tech_stacks: e.target.value })} placeholder="React, Python, Node" /></label>
          <label><span>Interview processes tags</span><input value={form.processes} onChange={(e) => setForm({ ...form, processes: e.target.value })} placeholder="Recruiter, Technical Interview" /></label>
          <label><span>Current step</span><input value={form.current_step} onChange={(e) => setForm({ ...form, current_step: e.target.value })} placeholder="Must be one of the processes" /></label>
          <label><span>Due date</span><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label>
          <label className="full-width"><span>Additional info</span><textarea rows="4" value={form.additional_info} onChange={(e) => setForm({ ...form, additional_info: e.target.value })}></textarea></label>
          {error ? <div className="alert error full-width">{error}</div> : null}
          <button disabled={saving} className="full-width" type="submit">{saving ? "Saving..." : "Save interview"}</button>
        </form>
      </div>
    </div>
  );
}
