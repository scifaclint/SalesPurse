import { useState, useEffect } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await window.api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const validateUser = async (username, password) => {
    try {
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      return user || null;
    } catch (error) {
      console.error("Error validating user:", error);
      return null;
    }
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  return { users, validateUser, getUserById };
};

export const useSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await window.api.getSales();
        setSales(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  return { sales };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await window.api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return { products };
};
