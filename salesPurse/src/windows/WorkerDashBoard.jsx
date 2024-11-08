import { styles } from "../styles/worker";
import { styled } from "../styles/mainWorkerSection";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { FiDollarSign, FiPackage, FiTruck, FiClock, FiX } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const DashboardContent = () => {
  const salesData = [
    { day: "Mon", sales: 2400 },
    { day: "Tue", sales: 1398 },
    { day: "Wed", sales: 3800 },
    { day: "Thu", sales: 3908 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 3800 },
    { day: "Sun", sales: 4300 },
  ];

  const stats = [
    {
      title: "Today's Sales",
      value: "GH₵ 4,890",
      icon: <FiDollarSign />,
      color: "#4ade80"
    },
    {
      title: "Products Sold",
      value: "45 items",
      icon: <FiPackage />,
      color: "#60a5fa"
    },
    {
      title: "Pending Orders",
      value: "5 orders",
      icon: <FiTruck />,
      color: "#f97316",
      onClick: () => setShowPendingModal(true)
    },
    {
      title: "Average Time",
      value: "12 mins",
      icon: <FiClock />,
      color: "#a78bfa"
    }
  ];

  const [showPendingModal, setShowPendingModal] = useState(false);

  // Dummy pending sales data
  const pendingSales = [
    {
      id: 1,
      customerName: "John Doe",
      products: [
        { name: "Excavator Parts", quantity: 2, price: "1250" }
      ],
      total: "2,500",
      date: "2024-02-20"
    },
    // ... more pending sales
  ];

  const PendingSalesModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Pending Sales</h2>
          <button 
            onClick={() => setShowPendingModal(false)}
            style={{ 
              background: "none", 
              border: "none", 
              fontSize: "24px", 
              cursor: "pointer",
              color: "#64748b"
            }}
          >
            <FiX />
          </button>
        </div>

        <div style={styles.pendingSalesList}>
          {pendingSales.map((sale) => (
            <div key={sale.id} style={styles.pendingSaleCard}>
              <div style={styles.saleInfo}>
                <h3 style={styles.saleTitle}>{sale.customerName}</h3>
                <p style={styles.saleDetails}>
                  {sale.products.map(p => `${p.name} x${p.quantity}`).join(", ")}
                  <br />
                  Total: GH₵ {sale.total}
                </p>
                <small style={{ color: "#94a3b8" }}>{sale.date}</small>
              </div>
              <div style={styles.saleActions}>
                <button 
                  style={{ 
                    ...styles.actionButton, 
                    backgroundColor: "#22c55e",
                    color: "white"
                  }}
                  onClick={() => {/* Complete sale logic */}}
                >
                  Complete
                </button>
                <button 
                  style={{ 
                    ...styles.actionButton, 
                    backgroundColor: "#ef4444",
                    color: "white"
                  }}
                  onClick={() => {/* Delete sale logic */}}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styled.mainWrapper}>
      <div style={styles.welcomeHeader}>
        <h1 style={styles.welcomeTitle}>Welcome back, John!</h1>
        <p style={styles.welcomeDate}>
          {new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: stat.color + "20",
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>{stat.title}</p>
              <p style={styles.statValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styled.dashboardGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Weekly Sales Performance</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.activityCard}>
          <h3 style={styles.activityTitle}>Recent Activity</h3>
          <div style={styles.activityList}>
            {[1, 2, 3].map((_, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={{
                  ...styles.activityIcon,
                  backgroundColor: "#4f46e520",
                  color: "#4f46e5"
                }}>
                  <FiDollarSign />
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>New sale completed</p>
                  <p style={styles.activityTime}>2 minutes ago</p>
                </div>
                <div style={styles.activityAmount}>
                  GH₵ 350
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        style={styles.pendingButton}
        onClick={() => setShowPendingModal(true)}
      >
        <FiTruck />
        Pending Sales
        <span style={styles.pendingBadge}>
          {pendingSales.length}
        </span>
      </button>

      {showPendingModal && <PendingSalesModal />}
    </div>
  );
};

const WorkerDashboard = () => {
  return (
    <div style={styled.container}>
      <NavigationTabWorker />
      <DashboardContent />
    </div>
  );
};

export default WorkerDashboard;
