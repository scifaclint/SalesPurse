import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useDatabase";

const InventoryManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [productList, setProductList] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Form state
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/api/placeholder/150/150");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setProductList([...products]);
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
    }
  };

  const clearFields = () => {
    setSelectedProduct(null);
    setProductName("");
    setProductPrice("");
    setProductQuantity("");
    setSelectedImage(null);
    setImagePreview("/api/placeholder/150/150");
    setInputValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setInputValue(e.target.value);
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      if (selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          picture: previewUrl,
          imageFile: file,
        });
      }
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: productName,
        picture: imagePreview,
        price: parseFloat(productPrice) || 0,
        quantity: parseInt(productQuantity) || 0,
        imageFile: selectedImage,
      };

      addProduct(
        newProduct.name,
        newProduct.quantity,
        newProduct.picture,
        newProduct.price
      );
      setProductList([...productList, newProduct]);
      clearFields();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        updateProduct(selectedProduct.id);
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
        deleteProduct(selectedProduct.id);
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

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      display: "flex",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    leftPanel: {
      flex: 1,
      marginRight: "20px",
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    hiddenInput: {
      display: "none",
    },
    button: {
      padding: "10px 20px",
      margin: "5px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
    },
    clearButton: {
      padding: "10px 20px",
      margin: "5px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#dc3545",
      color: "white",
    },
    disabledButton: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    productList: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      height: "400px",
      overflowY: "auto",
    },
    productItem: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
    },
    searchContainer: {
      display: "flex",
      marginBottom: "10px",
    },
    searchInput: {
      flex: 1,
      padding: "10px",
      marginRight: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    searchButton: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#28a745",
      color: "white",
    },
    pictureBox: {
      width: "150px",
      height: "150px",
      border: "1px solid #ccc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px",
      overflow: "hidden",
      objectFit: "cover",
    },
    summarySection: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "4px",
    },
    summaryItem: {
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2>Product Details</h2>
        <div style={styles.pictureBox}>
          <img
            src={selectedProduct ? selectedProduct.picture : imagePreview}
            alt="Product preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={styles.hiddenInput}
          accept="image/*"
          onChange={handleFileSelect}
          value={inputValue}
        />
        <button style={styles.button} onClick={handlePictureClick}>
          {selectedProduct ? "Update Picture" : "Select Picture"}
        </button>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Product Name"
          value={selectedProduct ? selectedProduct.name || "" : productName}
          onChange={
            selectedProduct
              ? handleInputChange
              : (e) => setProductName(e.target.value)
          }
        />
        <input
          style={styles.input}
          type="number"
          name="price"
          placeholder="Price"
          value={selectedProduct ? selectedProduct.price || "" : productPrice}
          onChange={
            selectedProduct
              ? handleInputChange
              : (e) => setProductPrice(e.target.value)
          }
        />
        <input
          style={styles.input}
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={
            selectedProduct ? selectedProduct.quantity || "" : productQuantity
          }
          onChange={
            selectedProduct
              ? handleInputChange
              : (e) => setProductQuantity(e.target.value)
          }
        />

        <div>
          <button
            style={{
              ...styles.button,
              ...(selectedProduct ? styles.disabledButton : {}),
            }}
            onClick={handleAddProduct}
            disabled={selectedProduct !== null}
          >
            Add
          </button>
          <button
            style={{
              ...styles.button,
              ...(selectedProduct ? {} : styles.disabledButton),
            }}
            onClick={handleUpdateProduct}
            disabled={!selectedProduct}
          >
            Update
          </button>
          <button
            style={{
              ...styles.button,
              ...(selectedProduct ? {} : styles.disabledButton),
            }}
            onClick={handleDeleteProduct}
            disabled={!selectedProduct}
          >
            Delete
          </button>
          <button style={styles.clearButton} onClick={clearFields}>
            Clear
          </button>
        </div>

        <div style={styles.summarySection}>
          <h3>Inventory Summary</h3>
          <div style={styles.summaryItem}>
            Total Items in Stock: {totalItems}
          </div>
          <div style={styles.summaryItem}>
            Total Inventory Value: GH₵ {totalValue.toFixed(2)}
          </div>
          <div style={styles.summaryItem}>
            Average Product Price: GH₵ {averagePrice.toFixed(2)}
          </div>
          <div style={styles.summaryItem}>
            Low Stock Items (less than 5): {lowStockItems}
          </div>
          <div style={styles.summaryItem}>
            Total Unique Products: {productList.length}
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <h2>Inventory</h2>
        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={styles.searchButton} onClick={handleSearch}>
            Search
          </button>
        </div>
        <div style={styles.productList}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={styles.productItem}
              onClick={() => setSelectedProduct(product)}
            >
              {product.name} - Quantity: {product.quantity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
