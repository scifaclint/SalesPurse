export const checkStockStyles = {
  mainContent: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f3f4f6',
    overflowY: 'auto',
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },

  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
  },

  searchBar: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
  },

  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
  },

  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    backgroundColor: '#ffffff',
  },

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
    maxWidth: '900px',
    margin: '0 auto 32px auto',
  },

  statCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },

  statInfo: {
    flex: 1,
  },

  statTitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },

  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
  },

  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '900px',
    margin: '0 auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#4b5563',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  tr: {
    borderBottom: '1px solid #e5e7eb',
  },

  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
  },

  statusInStock: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },

  statusLowStock: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },

  statusOutStock: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },

  '@media (max-width: 1024px)': {
    statsContainer: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '0 20px',
    },
  },

  '@media (max-width: 768px)': {
    statsContainer: {
      gridTemplateColumns: '1fr',
      maxWidth: '400px',
    },
    
    tableContainer: {
      margin: '0 20px',
      overflowX: 'auto',
    },
    
    table: {
      minWidth: '700px',
    }
  }
};