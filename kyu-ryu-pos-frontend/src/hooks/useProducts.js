import { useState, useEffect } from 'react';

const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products logic here
  }, []);

  return { products, setProducts };
};

export default useProducts;
