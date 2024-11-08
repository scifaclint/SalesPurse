import { useState } from "react";
import { newSalesStyles as styles } from "../styles/newSales";
import { FiPrinter, FiPlus, FiTrash2, FiSave } from "react-icons/fi";

const NewSaleContent = () => {
  // Dummy product database (will be replaced with real DB later)
  const availableProducts = [
    { id: 1, name: "Excavator Parts", basePrice: 2500 },
    { id: 2, name: "Hydraulic Pump", basePrice: 1800 },
    { id: 3, name: "Engine Filter", basePrice: 350 },
    { id: 4, name: "Track Chains", basePrice: 4200 },
    { id: 5, name: "Bucket Teeth", basePrice: 750 }
  ];

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    products: [{ name: "", quantity: 1, price: 0 }],
    message: "",
    discount: 0
  });

  // Check if product details are valid
  const isProductDetailsValid = () => {
    return formData.products.every(product => 
      product.name !== "" && 
      Number(product.quantity) > 0 && 
      Number(product.price) > 0
    );
  };

  // Handle product selection
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    
    if (field === "name") {
      const selectedProduct = availableProducts.find(p => p.name === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        name: value,
        price: selectedProduct?.basePrice || 0
      };
    } else {
      updatedProducts[index][field] = value;
    }
    
    setFormData({ ...formData, products: updatedProducts });
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return formData.products.reduce((sum, product) => 
      sum + (Number(product.price) * Number(product.quantity)), 0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * Number(formData.discount)) / 100;
    return subtotal - discountAmount;
  };

  // Handle form submission
  const handleCompleteSale = () => {
    if (isProductDetailsValid()) {
      console.log("Completing sale:", formData);
      // Add your sale completion logic here
    }
  };

  const handleSavePending = () => {
    if (isProductDetailsValid()) {
      console.log("Saving to pending:", formData);
      // Add your pending sale logic here
    }
  };

  // Add/Remove product rows
  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", quantity: 1, price: 0 }]
    });
  };

  const removeProductRow = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: updatedProducts });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>New Sale</h1>
      </div>

      <div style={styles.formCard}>
        {/* Customer Details */}
        <div style={styles.customerSection}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              style={styles.input}
              placeholder="Enter customer name"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              style={styles.input}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Products Section */}
        <div style={styles.productSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Products</h2>
            <button onClick={addProductRow} style={styles.addButton}>
              <FiPlus /> Add Product
            </button>
          </div>

          {formData.products.map((product, index) => (
            <div key={index} style={styles.productRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product</label>
                <select
                  value={product.name}
                  onChange={(e) => handleProductChange(index, "name", e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select a product</option>
                  {availableProducts.map((prod) => (
                    <option key={prod.id} value={prod.name}>
                      {prod.name} - GH₵{prod.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  style={styles.input}
                  min="1"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (GH₵)</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, "price", e.target.value)}
                  style={styles.input}
                  min="0"
                />
              </div>

              {formData.products.length > 1 && (
                <button 
                  onClick={() => removeProductRow(index)}
                  style={styles.removeButton}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div style={styles.totalsSection}>
          <div style={styles.totalRow}>
            <span>Subtotal:</span>
            <span>GH₵ {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Discount (%):</span>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: e.target.value})}
              style={styles.discountInput}
              min="0"
              max="100"
            />
          </div>
          <div style={styles.totalRow}>
            <span style={styles.grandTotal}>Total:</span>
            <span style={styles.grandTotal}>GH₵ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Message Section */}
        <div style={styles.messageSection}>
          <label style={styles.label}>Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            style={styles.textarea}
            placeholder="Add a message to the receipt..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button style={styles.printButton}>
            <FiPrinter /> Print Receipt
          </button>
          <div style={styles.mainActions}>
            <button 
              onClick={handleCompleteSale}
              style={{
                ...styles.completeButton,
                opacity: isProductDetailsValid() ? 1 : 0.5,
                cursor: isProductDetailsValid() ? "pointer" : "not-allowed",
              }}
              disabled={!isProductDetailsValid()}
            >
              Complete Sale
            </button>
            <button 
              onClick={handleSavePending}
              style={{
                ...styles.pendingButton,
                opacity: isProductDetailsValid() ? 1 : 0.5,
                cursor: isProductDetailsValid() ? "pointer" : "not-allowed",
              }}
              disabled={!isProductDetailsValid()}
            >
              <FiSave /> Save as Pending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSaleContent;
