const styled = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    position: "relative",
    overflow: "hidden"
  },
  mainWrapper: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
    marginLeft: "250px",
    paddingLeft: "2rem",
    paddingRight: "2rem"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem"
  },
  statusOutofStock: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    fontSize: "0.75rem",
    fontWeight: "600"
  },
  statusLowStock: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    fontSize: "0.75rem",
    fontWeight: "600"
  },
  statusInStock: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    fontSize: "0.75rem",
    fontWeight: "600"
  }
};

export { styled };
