import { useState } from "react";
import { FiPrinter, FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useProducts, useSales } from "../hooks/useDatabase";
import { useSelector } from "react-redux";

const NewSaleContent = () => {
  const { products } = useProducts();
  const { addPendingSale } = useSales();
  const currentUser = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    products: [{ id: "", name: "", quantity: 1, price: 0, maxQuantity: 0 }],
    message: "",
    discount: 0
  });
  const [productSearches, setProductSearches] = useState([""]); // Track search term for each product row
  const [dropdownVisible, setDropdownVisible] = useState([]); // Track dropdown visibility for each row
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filter products based on search term
  const getFilteredProducts = (searchTerm) => {
    if (!searchTerm.trim()) return [];
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  };

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
    
    if (field === "id") {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.base_price,
          maxQuantity: selectedProduct.quantity,
          quantity: 1 // Reset quantity when product changes
        };
      }
    } else if (field === "quantity") {
      const maxQty = updatedProducts[index].maxQuantity;
      const newQty = Math.min(Math.max(1, parseInt(value) || 1), maxQty);
      updatedProducts[index].quantity = newQty;
    }
    
    setFormData({ ...formData, products: updatedProducts });
  };

  // Handle selecting product from dropdown
  const handleProductSelect = (index, product) => {
    const updatedProducts = [...formData.products];
    const updatedSearches = [...productSearches];
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      id: product.id, // Make sure to store the product ID
      name: product.name,
      price: product.base_price,
      maxQuantity: product.quantity,
      category: product.category
    };
    updatedSearches[index] = product.name;
    
    setFormData({ ...formData, products: updatedProducts });
    setProductSearches(updatedSearches);
    setDropdownVisible(prev => prev.map(() => false));
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

  // Validate product selection and stock
  const validateSale = () => {
    let isValid = true;
    let errorMessage = "";

    for (let i = 0; i < formData.products.length; i++) {
      const formProduct = formData.products[i];
      
      // Check if product exists in database
      const databaseProduct = products.find(p => p.name === formProduct.name);
      if (!databaseProduct) {
        errorMessage = `Please select a valid product from the list for row ${i + 1}`;
        isValid = false;
        break;
      }

      // Check if quantity is valid and in stock
      if (formProduct.quantity > databaseProduct.stock) {
        errorMessage = `Not enough stock for ${formProduct.name}. Available: ${databaseProduct.stock}`;
        isValid = false;
        break;
      }
    }

    return { isValid, errorMessage };
  };

  // Validate all inputs
  const validateInputs = () => {
    if (!formData.customerName.trim()) {
      return { isValid: false, message: "Customer name is required" };
    }

    if (!formData.customerPhone.trim()) {
      return { isValid: false, message: "Customer phone is required" };
    }

    // Validate phone number format (you can adjust the regex as needed)
    const phoneRegex = /^\+?[0-9]{10,}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/\s/g, ''))) {
      return { isValid: false, message: "Please enter a valid phone number" };
    }

    // Validate products
    const { isValid, errorMessage } = validateSale();
    if (!isValid) {
      return { isValid: false, message: errorMessage };
    }

    return { isValid: true, message: "" };
  };

  // Format sale data for database
  const formatSaleData = (status) => {
    // Get product IDs from the products array
    const itemsWithIds = formData.products.map(product => {
      const databaseProduct = products.find(p => p.name === product.name);
      return {
        product_id: databaseProduct.id, // Get actual product ID
        quantity: Number(product.quantity),
        price: Number(product.price)
      };
    });

    return {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      totalAmount: calculateTotal(),
      discountPercentage: Number(formData.discount),
      paymentMethod: status === 'completed' ? 'cash' : null, // You might want to add payment method selection
      workerId: currentUser.id, // This will be replaced with actual user ID
      notes: formData.message,
      items: itemsWithIds
    };
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      products: [{ id: "", name: "", quantity: 1, price: 0, maxQuantity: 0 }],
      message: "",
      discount: 0
    });
    setProductSearches([""]);
    setDropdownVisible([]);
    setError(null);
  };

  // Add this validation function
  const validateSaleBeforeCompletion = () => {
    // Check if customer details are provided
    if (!formData.customerName.trim()) {
      return "Customer name is required";
    }
    if (!formData.customerPhone.trim()) {
      return "Customer phone number is required";
    }

    // Validate products
    for (const product of formData.products) {
      if (!product.name) {
        return "Please select all products from the dropdown";
      }

      const inventoryProduct = products.find(p => p.name === product.name);
      if (!inventoryProduct) {
        return `Product "${product.name}" is not available in inventory`;
      }

      if (product.quantity > inventoryProduct.quantity) {
        return `Not enough stock for "${product.name}". Available: ${inventoryProduct.quantity}`;
      }

      if (product.quantity <= 0) {
        return `Invalid quantity for "${product.name}"`;
      }
    }

    return ""; // No errors
  };

  // Update the complete sale handler
  const handleCompleteSaleClick = () => {
    const error = validateSaleBeforeCompletion();
    if (error) {
      setValidationError(error);
      return;
    }
    setConfirmationModal(true);
  };

  // Add the actual sale completion function
  const handleConfirmSale = async () => {
    try {
      setLoading(true);
      await handleCompleteSale();
      setConfirmationModal(false);
      // Additional success handling (e.g., reset form, show success message)
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle save to pending
  const handleSavePending = async () => {
    const error = validateSaleBeforeCompletion();
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      setLoading(true);
      const saleData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        totalAmount: calculateTotal(),
        discount: formData.discount,
        created_by: currentUser.id,
        message: formData.message,
        items: formData.products.map(product => ({
          product_id: product.id,
          quantity: product.quantity,
          price: product.price
        }))
      };

      const result = await addPendingSale(saleData);
      
      if (result.success) {
        setSuccessMessage("Sale added to pending successfully!");
        // Reset form after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
          clearFields();
        }, 2000);
      } else {
        setValidationError(result.message);
      }
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add/Remove product rows
  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { id: "", name: "", quantity: 1, price: 0, maxQuantity: 0 }]
    });
    setProductSearches([...productSearches, ""]);
    setDropdownVisible([...dropdownVisible, false]);
  };

  const removeProductRow = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      const updatedSearches = productSearches.filter((_, i) => i !== index);
      const updatedDropdown = dropdownVisible.filter((_, i) => i !== index);
      
      setFormData({ ...formData, products: updatedProducts });
      setProductSearches(updatedSearches);
      setDropdownVisible(updatedDropdown);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Show error message if exists */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">New Sale</h1>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-5 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter customer name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Products</h2>
            <button 
              onClick={addProductRow}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              <FiPlus /> Add Product
            </button>
          </div>

          {formData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end p-4 bg-gray-50 rounded-lg mb-3">
              {/* Product Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Select Product</label>
                <select
                  value={product.id || ""}
                  onChange={(e) => handleProductChange(index, "id", e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option 
                      key={p.id} 
                      value={p.id}
                      disabled={p.quantity <= 0}
                    >
                      {p.name} - Stock: {p.quantity} - ₵{parseFloat(p.base_price).toFixed(2)}
                    </option>
                  ))}
                </select>
                {product.id && (
                  <div className="text-xs text-gray-500 mt-1">
                    Available Stock: {product.maxQuantity}
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max={product.maxQuantity}
                  disabled={!product.id}
                />
                {product.id && product.quantity > product.maxQuantity && (
                  <p className="text-red-500 text-xs">
                    Quantity exceeds available stock
                  </p>
                )}
              </div>

              {/* Price Display */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Price (₵)</label>
                <input
                  type="number"
                  value={product.price}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                  readOnly
                />
              </div>

              {formData.products.length > 1 && (
                <button 
                  onClick={() => removeProductRow(index)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="border-t border-b border-gray-200 py-5 mb-6">
          <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>GH₵ {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Discount (%):</span>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: e.target.value})}
              className="w-20 p-2 rounded-lg border border-gray-300 text-sm"
              min="0"
              max="100"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-semibold text-gray-800">
              GH₵ {calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Message Section */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="mt-2 w-full p-3 rounded-lg border border-gray-300 text-sm resize-vertical"
            placeholder="Add a message to the receipt..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <FiPrinter /> Print Receipt
          </button>
          <div className="flex gap-3">
            <button 
              onClick={handleCompleteSaleClick}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                text-white transition-colors`}
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
            <button 
              onClick={handleSavePending}
              disabled={loading || !isProductDetailsValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium
                ${(loading || !isProductDetailsValid()) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600'} 
                text-white transition-colors`}
            >
              <FiSave /> {loading ? 'Processing...' : 'Save as Pending'}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Error Modal */}
      {validationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Unable to Complete Sale</h3>
            <p className="text-gray-600 mb-4">{validationError}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setValidationError("")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Sale</h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">Please review the sale details:</p>
              <div className="space-y-2 text-sm">
                <p><strong>Customer:</strong> {formData.customerName}</p>
                <p><strong>Phone:</strong> {formData.customerPhone}</p>
                <p><strong>Products:</strong></p>
                {formData.products.map((product, index) => (
                  <div key={index}>
                    <p><strong>Product {index + 1}:</strong> {product.name}</p>
                    <p><strong>Quantity:</strong> {product.quantity}</p>
                    <p><strong>Price:</strong> GH₵ {product.price.toFixed(2)}</p>
                  </div>
                ))}
                <p><strong>Total:</strong> GH₵ {calculateTotal().toFixed(2)}</p>
                <p><strong>Discount:</strong> {formData.discount}%</p>
                <p><strong>Message:</strong> {formData.message}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmSale}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <p className="flex items-center">
            <span className="mr-2">✓</span>
            {successMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewSaleContent;
