export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <a href="/" style={styles.logo}>SalonBook</a>
        <nav style={styles.nav}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/browse" style={styles.link}>Browse</a>
          <a href="/booking" style={styles.link}>Booking</a>
          <a href="/register" style={styles.link}>Register</a>
          <a href="/login" style={styles.link}>Login</a>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: { borderBottom: "1px solid #e5e7eb", background: "#ffffff" },
  container: {
    maxWidth: 1040, margin: "0 auto", padding: "12px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  },
  logo: { fontWeight: 700, fontSize: 18, color: "#111827", textDecoration: "none" },
  nav: { display: "flex", gap: 16 },
  link: { color: "#374151", textDecoration: "none" }
};
