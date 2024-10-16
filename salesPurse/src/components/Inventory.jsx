import { useState, useEffect } from "react";

const InventoryManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      picture: "/api/placeholder/150/150",
      price: 19.99,
      quantity: 10,
    },
    {
      id: 2,
      name: "Product 2",
      picture: "/api/placeholder/150/150",
      price: 29.99,
      quantity: 15,
    },
    {
      id: 3,
      name: "Product 3",
      picture: "/api/placeholder/150/150",
      price: 39.99,
      quantity: 5,
    },
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
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

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: selectedProduct ? selectedProduct.name : "",
      picture: selectedProduct
        ? selectedProduct.picture
        : "/api/placeholder/150/150",
      price: selectedProduct ? selectedProduct.price : 0,
      quantity: selectedProduct ? selectedProduct.quantity : 0,
    };
    setProducts([...products, newProduct]);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
      );
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setSelectedProduct(null);
    }
  };

  const handleSearch = () => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleAddPicture = () => {
    // Placeholder for image capture functionality
    alert("Image capture functionality to be implemented");
  };

  // Calculate summary statistics
  const totalItems = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const averagePrice = totalValue / totalItems || 0;
  const lowStockItems = products.filter(
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
    button: {
      padding: "10px 20px",
      margin: "5px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#007bff",
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
          {selectedProduct && selectedProduct.picture ? (
            <img
              src={selectedProduct.picture}
              alt={selectedProduct.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
        <button style={styles.button} onClick={handleAddPicture}>
          Add Picture
        </button>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Product Name"
          value={selectedProduct ? selectedProduct.name : ""}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="number"
          name="price"
          placeholder="Price"
          value={selectedProduct ? selectedProduct.price : ""}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={selectedProduct ? selectedProduct.quantity : ""}
          onChange={handleInputChange}
        />
        <div>
          <button style={styles.button} onClick={handleAddProduct}>
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
        </div>
        <div style={styles.summarySection}>
          <h3>Inventory Summary</h3>
          <div style={styles.summaryItem}>
            Total Items in Stock: {totalItems}
          </div>
          <div style={styles.summaryItem}>
            Total Inventory Value: ${totalValue.toFixed(2)}
          </div>
          <div style={styles.summaryItem}>
            Average Product Price: ${averagePrice.toFixed(2)}
          </div>
          <div style={styles.summaryItem}>
            Low Stock Items (less than 5): {lowStockItems}
          </div>
          <div style={styles.summaryItem}>
            Total Unique Products: {products.length}
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
