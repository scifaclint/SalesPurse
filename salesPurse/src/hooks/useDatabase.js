// @ts-nocheck
import { useState, useEffect } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const result = await window.api.getUsers();
      setUsers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add user
  const addUser = async (userData) => {
    try {
      const result = await window.api.addUser({
        username: userData.username,
        name: userData.name,
        password: userData.password,
        phone: userData.phone,
        type: userData.type
      });
      
      if (result.success) {
        await fetchUsers();
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  // Update user
  const updateUser = async (userData) => {
    try {
      const result = await window.api.updateUser(userData.id, userData);
      if (result.success) {
        await fetchUsers(); // Refresh the users list
        return result;
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (err) {
      throw err;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const result = await window.api.deleteUser(userId);
      if (result.success) {
        await fetchUsers(); // Refresh the users list
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (err) {
      throw err;
    }
  };

  // Add updateLastLogin function
  const updateLastLogin = async (userId) => {
    try {
      const result = await window.api.updateLastLogin(userId);
      if (result.success) {
        await fetchUsers(); // Refresh users list
        return result;
      } else {
        throw new Error(result.message || 'Failed to update last login');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    updateLastLogin
  };
};

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [pendingSales, setPendingSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    try {
      const data = await window.api.getSales();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchPendingSales = async () => {
    try {
      const data = await window.api.getPendingSales();
      setPendingSales(data);
    } catch (error) {
      console.error("Error fetching pending sales:", error);
    }
  };

  const addPendingSale = async (saleData) => {
    try {
      const result = await window.api.addPendingSale(saleData);
      if (result) {
        await fetchPendingSales();
        return { success: true, id: result };
      }
      return { success: false, message: 'Failed to add pending sale' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchSales(), fetchPendingSales()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    sales,
    pendingSales,
    loading,
    error,
    addPendingSale,
    fetchPendingSales,
    fetchSales
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const result = await window.api.getProducts();
      setProducts(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      const result = await window.api.addProduct(productData);
      if (result) {
        await fetchProducts(); // Refresh the products list
        return result;
      } else {
        throw new Error('Failed to add product');
      }
    } catch (err) {
      throw err;
    }
  };

  // Update product
  const updateProduct = async (productData) => {
    try {
      const result = await window.api.updateProduct(productData);
      if (result) {
        await fetchProducts(); // Refresh the products list
        return result;
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const result = await window.api.deleteProduct({ id });
      if (result) {
        await fetchProducts(); // Refresh the products list
        return result;
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      throw err;
    }
  };

  // Get low stock products
  const getLowStockProducts = async () => {
    try {
      return await window.api.getLowStockProducts();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts
  };
};
