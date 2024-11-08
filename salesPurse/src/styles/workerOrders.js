export const workerOrderStyles = {
  mainContent: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: '40px 20px',
    marginLeft: '250px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  header: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 20px',
  },

  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1f2937',
  },

  headerActions: {
    display: 'flex',
    gap: '12px',
  },

  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#4338ca',
      transform: 'translateY(-1px)',
    },
  },

  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#059669',
      transform: 'translateY(-1px)',
    },
  },

  summaryContainer: {
    width: '100%',
    maxWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '32px',
    padding: '0 20px',
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },

  summaryIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  },

  summaryValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
  },

  todaySalesSection: {
    width: '100%',
    maxWidth: '1200px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    margin: '0 20px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },

  salesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },

  saleCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s ease',
    border: '1px solid #e5e7eb',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },

  // Responsive styles
  '@media (max-width: 1280px)': {
    contentWrapper: {
      maxWidth: '960px',
    },
  },

  '@media (max-width: 1024px)': {
    mainContent: {
      paddingLeft: '200px',
    },
    contentWrapper: {
      padding: '24px 20px',
    },
    summaryContainer: {
      gap: '20px',
    },
  },

  '@media (max-width: 768px)': {
    mainContent: {
      paddingLeft: '0',
    },
    contentWrapper: {
      padding: '20px 16px',
    },
    header: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px',
    },
    headerActions: {
      width: '100%',
      justifyContent: 'stretch',
    },
    summaryContainer: {
      gridTemplateColumns: '1fr',
    },
    filterButton: {
      flex: 1,
      justifyContent: 'center',
    },
    downloadButton: {
      flex: 1,
      justifyContent: 'center',
    },
    salesGrid: {
      gridTemplateColumns: '1fr',
    },
  },

  '@media (max-width: 480px)': {
    contentWrapper: {
      padding: '16px 12px',
    },
    headerActions: {
      flexDirection: 'column',
    },
    summaryCard: {
      padding: '16px',
    },
    todaySalesSection: {
      padding: '16px',
    },
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },

  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
  },

  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#6b7280',
    cursor: 'pointer',
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },

  filterSelect: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },

  filterInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },

  searchButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
  },
};
