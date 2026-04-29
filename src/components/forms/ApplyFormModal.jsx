import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";

function isValidHttpUrl(value) {
  try {
    const withProtocol = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    const parsed = new URL(withProtocol);

    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function ApplyFormModal({
  open,
  onClose,
  onSaved,
  profileId,
  initial
}) {
  const emptyForm = {
    company_name: "",
    job_title: "",
    job_site_url: ""
  };

  const [form, setForm] = useState(initial || emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [checkingCompany, setCheckingCompany] = useState(false);
  const [companyResult, setCompanyResult] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(initial || emptyForm);
      setError("");
      setCompanyResult(null);
    }
  }, [open, initial]);

  const valid = useMemo(
    () => isValidHttpUrl(form.job_site_url || ""),
    [form.job_site_url]
  );

  if (!open) return null;

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function checkCompany() {
    if (!form.company_name.trim()) return;

    setCheckingCompany(true);
    setCompanyResult(null);

    try {
      const res = await api(
        `/applies/check-company/${profileId}?company=${encodeURIComponent(
          form.company_name
        )}`
      );

      setCompanyResult(res);
    } catch (err) {
      setError(err.message || "Failed to check company.");
    } finally {
      setCheckingCompany(false);
    }
  }

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
          body: JSON.stringify({
            profile_id: profileId,
            job_site_url: form.job_site_url
          })
        });

        await api("/applies", {
          method: "POST",
          body: JSON.stringify({
            profile_id: profileId,
            ...form
          })
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initial?.id ? "Edit Apply" : "Add Apply"}</h3>

          <button
            className="ghost"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="form-grid" onSubmit={submit}>
          {/* Company Name */}
          <label>
            <span>Company name</span>

            <div
              style={{
                display: "flex",
                gap: "8px"
              }}
            >
              <input
                required
                value={form.company_name}
                onChange={(e) =>
                  updateField("company_name", e.target.value)
                }
              />

              <button
                type="button"
                className="ghost"
                onClick={checkCompany}
                disabled={
                  checkingCompany ||
                  !form.company_name.trim()
                }
              >
                {checkingCompany ? "..." : "Check"}
              </button>
            </div>

            {companyResult ? (
              <div
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                {companyResult.total === 0 ? (
                  <small className="ok">
                    ✅ No previous applies found.
                  </small>
                ) : (
                  <>
                    <small className="bad">
                      ⚠ Found {companyResult.total} previous applies
                    </small>

                    <div style={{ marginTop: "8px" }}>
                      {companyResult.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: "6px 0",
                            borderBottom:
                              "1px solid #eee"
                          }}
                        >
                          <strong>
                            {item.job_title}
                          </strong>
                          <div>
                            {new Date(
                              item.created_at
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </label>

          {/* Job Title */}
          <label>
            <span>Job title</span>

            <input
              required
              value={form.job_title}
              onChange={(e) =>
                updateField("job_title", e.target.value)
              }
            />
          </label>

          {/* URL */}
          <label>
            <span>Job link URL</span>

            <input
              required
              value={form.job_site_url}
              onChange={(e) =>
                updateField("job_site_url", e.target.value)
              }
            />

            {form.job_site_url ? (
              <small className={valid ? "ok" : "bad"}>
                {valid
                  ? "Valid URL format"
                  : "Invalid URL format"}
              </small>
            ) : null}
          </label>

          {/* Error */}
          {error ? (
            <div className="alert error">
              {error}
            </div>
          ) : null}

          {/* Save */}
          <button disabled={saving} type="submit">
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}