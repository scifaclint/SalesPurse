const newSalesStyles = {
  container: {
    padding: "20px",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#1e3a8a",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  formSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#1f2937",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  productsContainer: {
    marginTop: "1rem",
  },
  productRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: "1rem",
    alignItems: "start",
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    border: "none",
  },
  addButton: {
    backgroundColor: "#1e3a8a",
    color: "white",
    "&:hover": {
      backgroundColor: "#1e40af",
    },
  },
  removeButton: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "0.5rem",
    "&:hover": {
      backgroundColor: "#b91c1c",
    },
  },
  submitButton: {
    backgroundColor: "#059669",
    color: "white",
    width: "100%",
    marginTop: "1rem",
    "&:hover": {
      backgroundColor: "#047857",
    },
  },
  summary: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "4px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "2px solid #e5e7eb",
    marginTop: "0.5rem",
    paddingTop: "0.5rem",
    fontWeight: "bold",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  "@media (max-width: 768px)": {
    productRow: {
      gridTemplateColumns: "1fr",
      gap: "0.5rem",
    },
    formGrid: {
      gridTemplateColumns: "1fr",
    },
  },
};

export {newSalesStyles}