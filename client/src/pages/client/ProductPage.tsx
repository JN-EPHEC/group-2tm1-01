import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/shop.css';

interface Product {
  id: number;
  name: string;
  imgIcon: string;
  desc: string;
  price: number;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error("Erreur chargement produits:", err));
      
    // Charger le panier depuis le localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + delta); // Empêche d'aller en dessous de 0
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = newQty;
      }
      localStorage.setItem('cart', JSON.stringify(newCart)); // Sauvegarde
      return newCart;
    });
  };

  const getSubtotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find(p => p.id === parseInt(id));
      return total + (product ? product.price * qty : 0);
    }, 0);
  };

  const subtotal = getSubtotal();
  const tax = subtotal * 0.21; // TVA 21%
  const total = subtotal + tax;

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="pb-5">
      <h1 className="mb-4">Nos Produits et Matériel</h1>

      <div className="row g-4">
        
        {/* Zone de filtres */}
        <div className="col-lg-2 col-md-3">
          <div className="card shadow-sm border-0 sticky-top sticky-sidebar">
            <div className="card-body">
              <h5 className="card-title text-primary border-bottom pb-2 mb-3">Filtres</h5>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Catégories</label>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="category" id="cat-all" defaultChecked />
                  <label className="form-check-label" htmlFor="cat-all">Tous les produits</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="category" id="cat-cremes" />
                  <label className="form-check-label" htmlFor="cat-cremes">Crèmes et Gels</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="category" id="cat-mat" />
                  <label className="form-check-label" htmlFor="cat-mat">Matériel</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone des produits */}
        <div className="col-lg-7 col-md-9">
          <div className="row g-4">
            {products.map(product => {
              const qty = cart[product.id] || 0;
              return (
                <div className="col-xl-4 col-sm-6" key={product.id}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top product-image-placeholder">
                      {product.imgIcon} [Img]
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title fw-bold">{product.name}</h6>
                      <p className="card-text text-muted small mb-2">
                        {product.desc}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fs-5 fw-bold text-primary">{product.price.toFixed(2)} €</span>
                        </div>
                        {/* Contrôles de quantité */}
                        {qty > 0 ? (
                          <div className="d-flex justify-content-between align-items-center bg-light rounded px-2 py-1">
                            <button onClick={() => updateQuantity(product.id, -1)} className="btn btn-sm btn-outline-secondary border-0 fw-bold fs-5">-</button>
                            <span className="fw-bold px-3">{qty}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="btn btn-sm btn-outline-primary border-0 fw-bold fs-5">+</button>
                          </div>
                        ) : (
                          <button onClick={() => updateQuantity(product.id, 1)} className="btn btn-outline-primary btn-sm w-100">
                            + Ajouter au panier
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone du panier */}
        <div className="col-lg-3 col-md-12 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0 bg-light sticky-top sticky-sidebar">
            <div className="card-body">
              <h5 className="card-title border-bottom border-secondary pb-3 mb-4 d-flex justify-content-between align-items-center">
                <span>Mon Panier</span>
                <span className="badge bg-primary rounded-pill">{totalItems} {totalItems > 1 ? 'articles' : 'article'}</span>
              </h5>
              
              {totalItems === 0 ? (
                <p className="text-muted text-center my-4">Votre panier est vide.</p>
              ) : (
                <>
                  {Object.entries(cart).map(([id, qty]) => {
                    const product = products.find(p => p.id === parseInt(id));
                    if (!product) return null;
                    return (
                      <div key={id} className="mb-3 pb-2 border-bottom border-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold fs-6">{product.name}</div>
                          <div className="fw-bold">{(product.price * qty).toFixed(2)} €</div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className="text-muted small">{product.price.toFixed(2)} € / u</span>
                          
                          <div className="input-group input-group-sm qty-input-group">
                            <button onClick={() => updateQuantity(product.id, -1)} className="btn btn-outline-secondary" type="button">-</button>
                            <input 
                              type="text" 
                              className="form-control text-center px-1" 
                              value={qty} 
                              readOnly 
                            />
                            <button onClick={() => updateQuantity(product.id, 1)} className="btn btn-outline-primary" type="button">+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="d-flex justify-content-between mb-2 text-muted small mt-4">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 text-muted small border-bottom border-secondary pb-2">
                    <span>TVA (21%)</span>
                    <span>{tax.toFixed(2)} €</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-4">
                    <strong className="fs-5">Total</strong>
                    <strong className="fs-5 text-primary">{total.toFixed(2)} €</strong>
                  </div>
                  
                  <Link to="/client/panier" className="btn btn-primary w-100 mb-2">Finaliser la commande</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;