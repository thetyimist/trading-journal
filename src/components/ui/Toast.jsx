// ─────────────────────────────────────────────────────────────
// src/components/ui/Toast.jsx
// Success / error notification — appears top right.
// Auto-dismisses after 2.8s (controlled by useToast hook).
// ─────────────────────────────────────────────────────────────

/**
 * Toast
 * @prop {{ msg: string, type: "success"|"error" }|null} toast
 */
export function Toast({ toast }) {
  if (!toast) return null;

  const bg =
    toast.type === "error"
      ? "rgba(239,68,68,0.95)"
      : "rgba(16,185,129,0.95)";

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 999,
        background: bg,
        color: "#fff",
        padding: "11px 18px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s",
        maxWidth: 320,
      }}
    >
      {toast.type === "error" ? "❌" : "✅"} {toast.msg}
    </div>
  );
}