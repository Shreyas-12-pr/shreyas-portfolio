"use client";

import { useState } from "react";

export function CopyContactButton({
  textToCopy,
  label,
  icon,
}: {
  textToCopy: string;
  label: string;
  icon: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="contact-detail contact-detail-btn"
      aria-label={`Copy ${label}`}
    >
      <span className="contact-detail-icon" aria-hidden="true">
        {copied ? "✓" : icon}
      </span>
      <div>
        <span className="contact-detail-label">{label}</span>
        <p>{copied ? "Copied to clipboard!" : textToCopy}</p>
      </div>
    </button>
  );
}
