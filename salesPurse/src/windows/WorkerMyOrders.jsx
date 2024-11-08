import { useState } from "react";
import { workerOrderStyles as styles } from "../styles/workerOrders";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { styled } from "../styles/mainWorkerSection";
import { FiCalendar, FiSearch, FiFilter, FiDownload, FiX } from "react-icons/fi";

const WorkerMyOrders = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data for today's sales
  const todaySales = [
    {
      id: 1,
      customerName: "John Doe",
      products: ["Excavator Parts x2", "Hydraulic Pump x1"],
      total: 5800,
      time: "10:30 AM",
      status: "Completed"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      products: ["Engine Filter x3"],
      total: 1050,
      time: "11:45 AM",
      status: "Pending"
    }
  ];

  // Monthly sales summary
  const monthlySummary = {
    totalSales: 45800,
    totalOrders: 28,
    averageOrderValue: 1635.71
  };

  return (
    <div style={styled.container}>
      <NavigationTabWorker />
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Orders</h1>
          <div style={styles.headerActions}>
            <button 
              style={styles.filterButton}
              onClick={() => setShowFilterModal(true)}
            >
              <FiFilter /> Filter Orders
            </button>
            <button style={styles.downloadButton}>
              <FiDownload /> Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryContainer}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>
              <FiCalendar />
            </div>
            <div style={styles.summaryInfo}>
              <h3 style={styles.summaryTitle}>Monthly Sales</h3>
              <p style={styles.summaryValue}>GH₵ {monthlySummary.totalSales}</p>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={{...styles.summaryIcon, backgroundColor: '#e0e7ff'}}>
              <FiCalendar />
            </div>
            <div style={styles.summaryInfo}>
              <h3 style={styles.summaryTitle}>Total Orders</h3>
              <p style={styles.summaryValue}>{monthlySummary.totalOrders}</p>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={{...styles.summaryIcon, backgroundColor: '#dcfce7'}}>
              <FiCalendar />
            </div>
            <div style={styles.summaryInfo}>
              <h3 style={styles.summaryTitle}>Average Order</h3>
              <p style={styles.summaryValue}>GH₵ {monthlySummary.averageOrderValue}</p>
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div style={styles.todaySalesSection}>
          <h2 style={styles.sectionTitle}>Today's Sales</h2>
          <div style={styles.salesGrid}>
            {todaySales.map((sale) => (
              <div key={sale.id} style={styles.saleCard}>
                <div style={styles.saleHeader}>
                  <h3 style={styles.customerName}>{sale.customerName}</h3>
                  <span style={styles[`status${sale.status}`]}>{sale.status}</span>
                </div>
                <div style={styles.productList}>
                  {sale.products.map((product, index) => (
                    <span key={index} style={styles.productItem}>{product}</span>
                  ))}
                </div>
                <div style={styles.saleFooter}>
                  <span style={styles.saleTime}>{sale.time}</span>
                  <span style={styles.saleTotal}>GH₵ {sale.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerMyOrders;
