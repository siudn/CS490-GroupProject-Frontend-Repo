export default function FormField({ label, error, children }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <div>{label}</div>
      {children}
      {error && (
        <div role="alert" style={{ color: '#991b1b', fontSize: 12 }}>
          {error}
        </div>
      )}
    </label>
  );
}


