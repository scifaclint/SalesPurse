import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useDatabase";

const InventoryManagement = () => {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    getLowStockProducts 
  } = useProducts();

  const [productList, setProductList] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    base_price: "",
    quantity: "",
    reorder_point: "5",
    picture: null
  });
  const [imagePreview, setImagePreview] = useState("/api/placeholder/150/150");
  const [inputValue, setInputValue] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setProductList(products);
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  const clearFields = () => {
    setSelectedProduct(null);
    setProductForm({
      name: "",
      category: "",
      base_price: "",
      quantity: "",
      reorder_point: "5",
      picture: null
    });
    setImagePreview("/api/placeholder/150/150");
    setInputValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    setInputValue(e.target.value);
    
    if (file) {
      try {
        // Convert file to binary data
        const buffer = await file.arrayBuffer();
        const binary = new Uint8Array(buffer);
        
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        if (selectedProduct) {
          setSelectedProduct({
            ...selectedProduct,
            picture: binary // Store binary data
          });
        } else {
          setProductForm({
            ...productForm,
            picture: binary // Store binary data
          });
        }
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try again.");
      }
    }
  };

  const renderProductImage = (binaryData) => {
    if (!binaryData) return "/api/placeholder/150/150";
    
    try {
      // Convert binary data to base64
      const base64String = btoa(
        String.fromCharCode.apply(null, binaryData)
      );
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error rendering image:", error);
      return "/api/placeholder/150/150";
    }
  };

  const handleAddProduct = async () => {
    try {
      await addProduct({
        name: productForm.name,
        category: productForm.category,
        quantity: parseInt(productForm.quantity) || 0,
        base_price: parseFloat(productForm.base_price) || 0,
        reorder_point: parseInt(productForm.reorder_point) || 5,
        picture: productForm.picture // Binary data
      });
      clearFields();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        await updateProduct({
          id: selectedProduct.id,
          name: selectedProduct.name,
          category: selectedProduct.category,
          quantity: parseInt(selectedProduct.quantity) || 0,
          base_price: parseFloat(selectedProduct.base_price) || 0,
          reorder_point: parseInt(selectedProduct.reorder_point) || 5,
          picture: selectedProduct.picture // Binary data
        });
        clearFields();
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        clearFields();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleSearch = () => {
    setFilteredProducts(
      productList.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const totalItems = productList.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const totalValue = productList.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const averagePrice = totalValue / totalItems || 0;
  const lowStockItems = productList.filter(
    (product) => product.quantity < 5
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-5 flex gap-5 font-sans">
      {/* Left Panel */}
      <div className="w-[400px] flex flex-col">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {/* Image Preview */}
        <div className="w-[150px] h-[150px] border border-gray-300 flex justify-center items-center mb-4 overflow-hidden">
          <img
            src={selectedProduct 
              ? renderProductImage(selectedProduct.picture) 
              : imagePreview}
            alt="Product preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          value={inputValue}
        />
        
        {/* Image Upload Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded mb-4 hover:bg-blue-700 transition-colors"
        >
          {selectedProduct ? "Update Picture" : "Select Picture"}
        </button>

        {/* Form Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={selectedProduct ? selectedProduct.name : productForm.name}
          onChange={handleInputChange}
          className="w-full p-2.5 mb-3 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={selectedProduct ? selectedProduct.category : productForm.category}
          onChange={handleInputChange}
          className="w-full p-2.5 mb-3 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="base_price"
          placeholder="Base Price"
          value={selectedProduct ? selectedProduct.base_price : productForm.base_price}
          onChange={handleInputChange}
          className="w-full p-2.5 mb-3 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={selectedProduct ? selectedProduct.quantity : productForm.quantity}
          onChange={handleInputChange}
          className="w-full p-2.5 mb-3 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="reorder_point"
          placeholder="Reorder Point"
          value={selectedProduct ? selectedProduct.reorder_point : productForm.reorder_point}
          onChange={handleInputChange}
          className="w-full p-2.5 mb-3 border border-gray-300 rounded"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={handleAddProduct}
            disabled={selectedProduct !== null}
            className={`px-5 py-2.5 rounded transition-colors
              ${selectedProduct 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Add
          </button>
          <button
            onClick={handleUpdateProduct}
            disabled={!selectedProduct}
            className={`px-5 py-2.5 rounded transition-colors
              ${!selectedProduct 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Update
          </button>
          <button
            onClick={handleDeleteProduct}
            disabled={!selectedProduct}
            className={`px-5 py-2.5 rounded transition-colors
              ${!selectedProduct 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            Delete
          </button>
          <button 
            onClick={clearFields}
            className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-bold mb-3">Inventory Summary</h3>
          <div className="space-y-2">
            <div><strong>Total Items:</strong> {totalItems}</div>
            <div><strong>Total Inventory Value:</strong> ₵{totalValue.toFixed(2)}</div>
            <div><strong>Average Price Per Item:</strong> ₵{averagePrice.toFixed(2)}</div>
            <div><strong>Low Stock Items:</strong> {lowStockItems}</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Inventory</h2>
        
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2.5 border border-gray-300 rounded"
          />
          <button 
            onClick={handleSearch}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Search
          </button>
        </div>

        {/* Product List */}
        <div className="border border-gray-300 rounded h-[400px] overflow-y-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => setSelectedProduct(product)}
              className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
            >
              {/* Product Image Thumbnail */}
              <div className="w-12 h-12 border border-gray-200 rounded overflow-hidden">
                <img
                  src={renderProductImage(product.picture)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div>
                <h4 className="font-bold">{product.name}</h4>
                <p>Price: ₵{product.base_price}</p>
                <p>Quantity: {product.quantity}</p>
                <p className={`text-sm ${
                  product.quantity <= product.reorder_point 
                    ? 'text-red-500' 
                    : 'text-green-500'
                }`}>
                  Status: {product.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
