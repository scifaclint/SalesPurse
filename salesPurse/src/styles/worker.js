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
    // Remove or modify the general transition to be more specific
    position: "relative",
  },
  navItemActive: {
    backgroundColor: "#1e40af",
    // Add this to ensure smooth transition
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
  welcomeHeader: {
    marginBottom: "24px",
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px"
  },
  welcomeDate: {
    color: "#64748b",
    fontSize: "14px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },
  statInfo: {
    flex: 1
  },
  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "4px"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b"
  },
  chartCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px"
  },
  activityCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  activityTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px"
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    gap: "12px"
  },
  activityIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },
  activityContent: {
    flex: 1
  },
  activityText: {
    fontSize: "14px",
    color: "#1e293b",
    marginBottom: "4px"
  },
  activityTime: {
    fontSize: "12px",
    color: "#64748b"
  },
  activityAmount: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b"
  },
  pendingButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "#f97316",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: 100,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)"
    }
  },
  pendingBadge: {
    backgroundColor: "white",
    color: "#f97316",
    borderRadius: "full",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "80vh",
    overflow: "auto"
  },
  pendingSalesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  pendingSaleCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  saleInfo: {
    flex: 1
  },
  saleTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "4px"
  },
  saleDetails: {
    fontSize: "14px",
    color: "#64748b"
  },
  saleActions: {
    display: "flex",
    gap: "8px"
  },
  actionButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s"
  }
};

export { styles};
