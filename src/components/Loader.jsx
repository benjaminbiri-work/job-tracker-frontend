import React from "react";

export default function Loader({ text = "Loading...", fullScreen = false }) {
  return (
    <div className={fullScreen ? "loader-wrap fullscreen" : "loader-wrap"}>
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}
