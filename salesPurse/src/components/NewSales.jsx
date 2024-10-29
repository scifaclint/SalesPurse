import { useState } from "react";
import { newSalesStyles as styles } from "../styles/newSales";

const NewSaleContent = () => {
  const [saleData, setSaleData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    paymentMethod: "cash",
    products: [{ id: 1, name: "", quantity: 1, price: "", discount: 0 }],
  });

  const handleCustomerChange = (e) => {
    setSaleData({
      ...saleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...saleData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setSaleData({
      ...saleData,
      products: updatedProducts,
    });
  };

  const addProduct = () => {
    setSaleData({
      ...saleData,
      products: [
        ...saleData.products,
        { id: Date.now(), name: "", quantity: 1, price: "", discount: 0 },
      ],
    });
  };

  const removeProduct = (index) => {
    if (saleData.products.length > 1) {
      const updatedProducts = saleData.products.filter((_, i) => i !== index);
      setSaleData({
        ...saleData,
        products: updatedProducts,
      });
    }
  };

  const calculateTotal = () => {
    return saleData.products.reduce((total, product) => {
      const subtotal = (product.price || 0) * (product.quantity || 0);
      const discount = (subtotal * (product.discount || 0)) / 100;
      return total + (subtotal - discount);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting sale:", saleData);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create New Sale</h1>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        {/* Customer Information Section */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Customer Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Name*</label>
              <input
                type="text"
                name="customerName"
                value={saleData.customerName}
                onChange={handleCustomerChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number*</label>
              <input
                type="tel"
                name="customerPhone"
                value={saleData.customerPhone}
                onChange={handleCustomerChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method</label>
              <select
                name="paymentMethod"
                value={saleData.paymentMethod}
                onChange={handleCustomerChange}
                style={styles.select}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="momo">Mobile Money</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Products</h2>
          <div style={styles.productsContainer}>
            {saleData.products.map((product, index) => (
              <div key={product.id} style={styles.productRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Product Name*</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity*</label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    style={styles.input}
                    min="1"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Unit Price*</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                    style={styles.input}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Discount (%)</label>
                  <input
                    type="number"
                    value={product.discount}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "discount",
                        parseFloat(e.target.value)
                      )
                    }
                    style={styles.input}
                    min="0"
                    max="100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  style={{ ...styles.button, ...styles.removeButton }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addProduct}
            style={{ ...styles.button, ...styles.addButton }}
          >
            Add Product
          </button>
        </div>

        {/* Summary Section */}
        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>GHC {calculateTotal().toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total Amount:</span>
            <span>GHC {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          style={{ ...styles.button, ...styles.submitButton }}
        >
          Complete Sale
        </button>
      </form>
    </div>
  );
};

export default NewSaleContent;
