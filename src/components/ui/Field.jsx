// ─────────────────────────────────────────────────────────────
// src/components/ui/Field.jsx
// Unified input, select, and textarea component.
// Handles focus border state internally.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

const baseStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#f1f5f9",
  fontSize: 13,
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
  transition: "border 0.2s",
  boxSizing: "border-box",
};

const focusStyle = {
  border: "1px solid #3b82f6",
};

const labelStyle = {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  display: "block",
  marginBottom: 4,
};

/**
 * Field
 * Renders an input, select, or textarea depending on props.
 *
 * @prop {string}   label       - Field label
 * @prop {string}   type        - Input type (default: "text")
 * @prop {string}   value       - Controlled value
 * @prop {Function} onChange    - Change handler (receives value string)
 * @prop {string}   placeholder - Placeholder text
 * @prop {string[]} options     - If provided, renders a <select>
 * @prop {number}   rows        - If provided, renders a <textarea>
 * @prop {boolean}  required    - Shows red asterisk on label
 * @prop {boolean}  readOnly    - Makes field non-editable
 */
export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  rows,
  required,
  readOnly,
}) {
  const [focused, setFocused] = useState(false);
  const style = { ...baseStyle, ...(focused ? focusStyle : {}) };

  const labelEl = label && (
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );

  const handlers = {
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
  };

  if (options) {
    return (
      <div>
        {labelEl}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...style, cursor: "pointer" }}
          {...handlers}
        >
          {!required && <option value="">Select...</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (rows) {
    return (
      <div>
        {labelEl}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ ...style, resize: "vertical" }}
          {...handlers}
        />
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ ...style, opacity: readOnly ? 0.6 : 1 }}
        {...handlers}
      />
    </div>
  );
}