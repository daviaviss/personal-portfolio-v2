export function Divider() {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        background:
          "linear-gradient(to right, transparent, var(--border), transparent)",
        maxWidth: 1080,
        margin: "0 auto",
        width: "100%",
        padding: "0 clamp(24px, 5vw, 48px)",
      }}
    >
      <div style={{ height: 1, background: "var(--border)" }} />
    </div>
  );
}
