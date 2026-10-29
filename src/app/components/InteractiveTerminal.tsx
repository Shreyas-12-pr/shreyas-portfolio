"use client";

import { useState } from "react";

interface TerminalItem {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

export function InteractiveTerminal({
  itemsCol1,
  itemsCol2,
}: {
  itemsCol1: TerminalItem[];
  itemsCol2: TerminalItem[];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyProfile = () => {
    const text = [...itemsCol1, ...itemsCol2]
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-profile">
      {/* Terminal Titlebar with Window Controls */}
      <div className="terminal-titlebar">
        <div className="terminal-controls">
          <span className="term-dot term-dot-close" />
          <span className="term-dot term-dot-min" />
          <span className="term-dot term-dot-max" />
        </div>
        <div className="terminal-title">
          <span>shreyas@portfolio: ~/profile.sh</span>
        </div>
        <button
          type="button"
          className="terminal-copy-btn"
          onClick={handleCopyProfile}
          aria-label="Copy terminal information"
        >
          {copied ? "Copied ✓" : "Copy profile"}
        </button>
      </div>

      <div className="terminal-prompt-bar">
        <span className="prompt-symbol">❯</span>
        <span className="prompt-command">shreyas --view profile --output formatted</span>
      </div>

      <div className="terminal-profile-grid">
        <div className="terminal-column">
          {itemsCol1.map((item) => (
            <p key={item.label}>
              <span className="term-key">{item.label}</span>
              {item.isLink && item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="term-link">
                  {item.value}
                </a>
              ) : (
                <b className="term-val">{item.value}</b>
              )}
            </p>
          ))}
        </div>

        <div className="terminal-column">
          {itemsCol2.map((item) => (
            <p key={item.label}>
              <span className="term-key">{item.label}</span>
              {item.isLink && item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="term-link">
                  {item.value}
                </a>
              ) : (
                <b className="term-val">{item.value}</b>
              )}
            </p>
          ))}
        </div>
      </div>

      <div className="profile-card-footer">
        <div className="footer-status-pill">
          <span className="pulse-dot-green" />
          <span>STATUS: ONLINE &amp; COLLABORATING</span>
        </div>
        <span className="footer-tagline">B.TECH CSE · COMMUNITY BUILDER · TECH ENTHUSIAST</span>
      </div>
    </div>
  );
}
