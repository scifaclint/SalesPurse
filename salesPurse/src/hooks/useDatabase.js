import { useState, useEffect, useCallback } from "react";

// User hooks
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = async (name, password, phone, type) => {
    try {
      await window.api.addUser({ name, password, phone, type });
      await fetchUsers();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (id, name, password, phone, type) => {
    try {
      await window.api.updateUser({ id, name, password, phone, type });
      await fetchUsers();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await window.api.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refresh: fetchUsers,
  };
}

// Sales hooks
export function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.api.getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSale = async (customerName, phone, paymentMethod) => {
    try {
      await window.api.addSale({ customerName, phone, paymentMethod });
      await fetchSales();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSale = async (id, customerName, phone, paymentMethod) => {
    try {
      await window.api.updateSale({ id, customerName, phone, paymentMethod });
      await fetchSales();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSale = async (id) => {
    try {
      await window.api.deleteSale(id);
      await fetchSales();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    addSale,
    updateSale,
    deleteSale,
    refresh: fetchSales,
  };
}

// Products hooks
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (name, quantity, price, picture) => {
    try {
      await window.api.addProduct({ name, quantity, price, picture });
      await fetchProducts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, name, quantity, picture, price) => {
    try {
      await window.api.updateProduct({ id, name, quantity, picture, price });
      await fetchProducts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await window.api.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: fetchProducts,
  };
}
