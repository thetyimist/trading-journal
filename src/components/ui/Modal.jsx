// ─────────────────────────────────────────────────────────────
// src/components/ui/Modal.jsx
// Reusable modal overlay.
// Used for confirm delete and about dialog.
// ─────────────────────────────────────────────────────────────

/**
 * Modal
 * @prop {boolean}  open     - Whether modal is visible
 * @prop {Function} onClose  - Called when backdrop is clicked
 * @prop {ReactNode} children
 */
export function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 400,
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}