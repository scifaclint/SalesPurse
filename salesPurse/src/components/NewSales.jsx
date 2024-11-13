import { useState } from "react";
import { FiPrinter, FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useProducts } from "../hooks/useDatabase";
import { useSelector } from "react-redux";

const NewSaleContent = () => {
  const { products } = useProducts();
  const currentUser = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    products: [{ name: "", quantity: 1, price: 0 }],
    message: "",
    discount: 0
  });
  const [productSearches, setProductSearches] = useState([""]); // Track search term for each product row
  const [dropdownVisible, setDropdownVisible] = useState([]); // Track dropdown visibility for each row

  // Filter products based on search term
  const getFilteredProducts = (searchTerm) => {
    if (!searchTerm) return [];
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    const updatedSearches = [...productSearches];
    
    if (field === "name") {
      updatedSearches[index] = value;
      setProductSearches(updatedSearches);
      
      // If exact match found, select that product
      const selectedProduct = products.find(p => 
        p.name.toLowerCase() === value.toLowerCase()
      );
      
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          name: selectedProduct.name,
          price: selectedProduct.price
        };
        setFormData({ ...formData, products: updatedProducts });
        setDropdownVisible(prev => prev.map((v, i) => i === index ? false : v));
      }
    } else {
      updatedProducts[index][field] = value;
      setFormData({ ...formData, products: updatedProducts });
    }
  };

  // Handle selecting product from dropdown
  const handleProductSelect = (index, product) => {
    const updatedProducts = [...formData.products];
    const updatedSearches = [...productSearches];
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      name: product.name,
      price: product.price
    };
    updatedSearches[index] = product.name;
    
    setFormData({ ...formData, products: updatedProducts });
    setProductSearches(updatedSearches);
    setDropdownVisible(prev => prev.map((v, i) => i === index ? false : v));
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
      products: [{ name: "", quantity: 1, price: 0 }],
      message: "",
      discount: 0
    });
    setProductSearches([""]);
    setDropdownVisible([]);
    setError(null);
  };

  // Handle complete sale
  const handleCompleteSale = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate all inputs
      const { isValid, message } = validateInputs();
      if (!isValid) {
        setError(message);
        return;
      }

      // Format sale data
      const saleData = formatSaleData('completed');

      // Save completed sale to database
      await window.api.addSale(saleData);

      // Reset form
      resetForm();
      alert('Sale completed successfully!');

    } catch (err) {
      setError(err.message || 'Failed to complete sale');
      console.error('Error completing sale:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle save to pending
  const handleSavePending = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate all inputs
      const { isValid, message } = validateInputs();
      if (!isValid) {
        setError(message);
        return;
      }

      // Format sale data
      const saleData = formatSaleData('pending');

      // Save pending sale to database
      await window.api.addPendingSale(saleData);

      // Reset form
      resetForm();
      alert('Sale saved to pending successfully!');

    } catch (err) {
      setError(err.message || 'Failed to save pending sale');
      console.error('Error saving pending sale:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add/Remove product rows
  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", quantity: 1, price: 0 }]
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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Product</label>
                <div className="relative">
                  <input
                    type="text"
                    value={productSearches[index]}
                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    onFocus={() => setDropdownVisible(prev => prev.map((v, i) => i === index ? true : v))}
                    className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search through available products..."
                  />
                  {dropdownVisible[index] && productSearches[index] && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {getFilteredProducts(productSearches[index]).map(product => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleProductSelect(index, product)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{product.name}</span>
                            <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                          </div>
                          <span className="font-medium text-green-600">GH₵{product.price}</span>
                        </div>
                      ))}
                      {getFilteredProducts(productSearches[index]).length === 0 && (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Price (GH₵)</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, "price", e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                  min="0"
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
              onClick={handleCompleteSale}
              disabled={loading || !isProductDetailsValid()}
              className={`flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium
                ${(loading || !isProductDetailsValid()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} 
                transition-colors`}
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
            <button 
              onClick={handleSavePending}
              disabled={loading || !isProductDetailsValid()}
              className={`flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg text-sm font-medium
                ${(loading || !isProductDetailsValid()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'} 
                transition-colors`}
            >
              <FiSave /> {loading ? 'Processing...' : 'Save as Pending'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSaleContent;
