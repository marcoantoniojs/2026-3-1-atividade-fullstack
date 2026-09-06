export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>{title}</h1>
      <p style={{ color: "var(--text-muted)" }}>Em construção.</p>
    </>
  );
}
