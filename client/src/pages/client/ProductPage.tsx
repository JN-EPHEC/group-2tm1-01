﻿import { useEffect, useState } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
    
      .then(res => res.json())

      .then(data => setProducts(data))

      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Produits</h1>

      <div className="row g-4">

        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card p-3">

              <h5>{product.name}</h5>

              <p>{product.description}</p>

              <strong>{product.price} €</strong>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ProductPage;