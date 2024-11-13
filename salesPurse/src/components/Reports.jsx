import { useState, useEffect, useMemo } from "react";
import { useSales, useProducts } from "../hooks/useDatabase";

const Reports = () => {
  const { sales, getSalesByDateRange } = useSales();
  const { products } = useProducts();
  const [selectedReport, setSelectedReport] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales data for the current year
  useEffect(() => {
    const fetchYearData = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        await getSalesByDateRange(startDate, endDate);
      } catch (err) {
        setError("Failed to fetch sales data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [getSalesByDateRange]);

  // Process sales data for reports
  const reportsData = useMemo(() => {
    if (!sales.length) return null;

    // Monthly sales data
    const monthly = Array(12).fill(0).map((_, index) => {
      const monthSales = sales.filter(sale => {
        const saleMonth = new Date(sale.created_at).getMonth();
        return saleMonth === index && sale.status === 'completed';
      });

      const totalSales = monthSales.reduce((sum, sale) => sum + sale.total_amount, 0);

      return {
        month: new Date(0, index).toLocaleString('default', { month: 'long' }),
        sales: totalSales
      };
    });

    // Top products data
    const productSales = {};
    sales.forEach(sale => {
      if (sale.status === 'completed') {
        sale.items.forEach(item => {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = {
              product: item.product_name,
              sales: 0
            };
          }
          productSales[item.product_id].sales += item.quantity;
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Categories data
    const categorySales = {};
    sales.forEach(sale => {
      if (sale.status === 'completed') {
        sale.items.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            if (!categorySales[product.category]) {
              categorySales[product.category] = {
                category: product.category,
                sales: 0
              };
            }
            categorySales[product.category].sales += item.quantity * item.price;
          }
        });
      }
    });

    const categories = Object.values(categorySales)
      .sort((a, b) => b.sales - a.sales);

    return {
      monthly,
      topProducts,
      categories
    };
  }, [sales, products]);

  const renderReport = () => {
    if (loading) {
      return <div className="text-center py-8">Loading reports...</div>;
    }

    if (error) {
      return <div className="text-red-600 py-8">{error}</div>;
    }

    if (!reportsData) {
      return <div className="text-center py-8">No data available</div>;
    }

    switch (selectedReport) {
      case "monthly":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.monthly.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    GH₵{item.sales.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "topProducts":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.topProducts.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "categories":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.categories.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    GH₵{item.sales.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <p>Select a report to view</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
        Sales Reports
      </h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedReport === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedReport("monthly")}
        >
          Monthly Sales
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedReport === "topProducts"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedReport("topProducts")}
        >
          Top Products
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedReport === "categories"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedReport("categories")}
        >
          Sales by Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report
          </h2>
          {renderReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
