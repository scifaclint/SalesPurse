export const newSalesStyles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },

  headerTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
  },

  successMessage: {
    padding: '8px 16px',
    backgroundColor: '#86efac',
    color: '#166534',
    borderRadius: '6px',
    fontSize: '14px',
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  customerSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },

  productSection: {
    marginBottom: '24px',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },

  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  productRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr auto',
    gap: '16px',
    alignItems: 'end',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '12px',
  },

  removeButton: {
    padding: '8px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },

  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },

  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
  },

  totalsSection: {
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    padding: '20px 0',
    marginBottom: '24px',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#4b5563',
  },

  discountInput: {
    width: '80px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },

  grandTotal: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },

  messageSection: {
    marginBottom: '24px',
  },

  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    resize: 'vertical',
  },

  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  printButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  mainActions: {
    display: 'flex',
    gap: '12px',
  },

  completeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  pendingButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  searchContainer: {
    position: 'relative',
    width: '100%',
  },

  searchInput: {
    width: '100%',
    height: '38px',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
    }
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    marginTop: '4px',
  },

  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: '#f8fafc',
    }
  },

  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  productName: {
    fontWeight: '500',
    color: '#1f2937',
  },

  productStock: {
    fontSize: '12px',
    color: '#6b7280',
  },

  productPrice: {
    fontWeight: '500',
    color: '#059669',
  },

  noResults: {
    padding: '12px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  }
};