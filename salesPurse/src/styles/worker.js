const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f3f4f6",
    position: "relative",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1e3a8a",
    color: "white",
    height: "100%",
    transition: "transform 0.3s ease",
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: 30,
  },
  sidebarHidden: {
    transform: "translateX(-100%)",
  },
  logo: {
    width: "64px",
    height: "64px",
    margin: "1rem auto",
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  nav: {
    padding: "1rem",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  navItemActive: {
    backgroundColor: "#1e40af",
  },
  navIcon: {
    marginRight: "0.75rem",
  },
  mainContent: {
    flex: "1",
    marginLeft: "250px",
    padding: "2rem",
    overflowY: "auto",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  cardValue: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#2563eb",
  },
  table: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    textAlign: "left",
    padding: "1rem",
  },
  tableCell: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  menuButton: {
    display: "none",
    position: "fixed",
    top: "1rem",
    left: "1rem",
    zIndex: 40,
    padding: "0.5rem",
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  signOutButton: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    right: "1rem",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  "@media (max-width: 768px)": {
    mainContent: {
      marginLeft: "0",
    },
    menuButton: {
      display: "block",
    },
    sidebar: {
      transform: "translateX(-100%)",
    },
    sidebarVisible: {
      transform: "translateX(0)",
    },
  },
};

export { styles};
