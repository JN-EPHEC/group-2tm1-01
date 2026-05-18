import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/shop.css';

interface BackendProduct {
  id: number;
  name: string;
  price: number;
  imgIcon?: string;
  desc?: string;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  desc?: string;
}

const CartPage = () => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [cartStorage, setCartStorage] = useState<{ [id: number]: number }>({});
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'carte' | 'paypal' | 'bancontact'>('carte');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Charger les produits du backend ET le panier du local storage
  useEffect(() => {
    fetch('http://m1-4.ephec-ti.be:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error("Erreur chargement produits:", err));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartStorage(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de lecture du localStorage", e);
        setCartStorage({});
      }
    }
  }, []);

  // 2. Construire la liste des éléments du panier de manière dynamique
  const cartItems: CartItem[] = Object.entries(cartStorage).map(([idStr, quantity]) => {
    const productId = parseInt(idStr);
    const product = products.find(p => p.id === productId);
    return {
      productId,
      name: product ? product.name : `Produit #${productId}`,
      price: product ? product.price : 0,
      quantity,
      desc: product ? product.desc : ''
    };
  }).filter(item => item.quantity > 0);

  // Mettre à jour les quantités de manière synchronisée avec ProductPage
  const updateQuantity = (productId: number, delta: number) => {
    const currentQty = cartStorage[productId] || 0;
    const newQty = currentQty + delta;
    
    const newCart = { ...cartStorage };
    if (newQty <= 0) {
      delete newCart[productId];
    } else {
      newCart[productId] = newQty;
    }
    
    setCartStorage(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (productId: number) => {
    const newCart = { ...cartStorage };
    delete newCart[productId];
    setCartStorage(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Calculs financiers basés sur les données réelles du backend
  const totalArticles = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.21;
  const totalTTC = subtotal + tax;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      setError("Votre panier est vide.");
      return;
    }
    setError('');
    setStep('checkout');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!address) {
      setError("Veuillez renseigner votre adresse de livraison.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://m1-4.ephec-ti.be:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Transmet la session de l'utilisateur connecté
        body: JSON.stringify({
          address: address,
          paymentMethod: paymentMethod,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }),
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        setCartStorage({});
        setStep('success');
      } else {
        const errData = await response.json();
        setError(errData.error || "Une erreur est survenue lors de la validation.");
      }
    } catch (err) {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="container text-center py-5">
        <div className="mb-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h1 className="mb-3 text-success">Merci pour votre commande !</h1>
        <p className="lead mb-4">Votre commande a été validée et enregistrée avec succès.</p>
        <Link to="/client/produits" className="btn btn-primary btn-lg">Retourner à la boutique</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Mon Panier</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row g-4">
        {step === 'cart' ? (
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                
                <div className="row text-muted fw-bold pb-2 mb-3 border-bottom d-none d-md-flex">
                  <div className="col-6">Produit</div>
                  <div className="col-2 text-center">Quantité</div>
                  <div className="col-2 text-end">Prix</div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">Votre panier est vide.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.productId} className="row align-items-center mb-3 pb-3 border-bottom">
                      <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
                        <div className="bg-light rounded text-center text-muted d-flex align-items-center justify-content-center me-3 cart-item-image" style={{ width: '60px', height: '60px' }}>
                          ??
                        </div>
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          {item.desc && <small className="text-muted">{item.desc}</small>}
                        </div>
                      </div>
                      
                      <div className="col-6 col-md-2 d-flex justify-content-center">
                        <div className="input-group input-group-sm qty-input-group">
                          <button type="button" className="btn btn-outline-secondary" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                          <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                          <button type="button" className="btn btn-outline-secondary" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                        </div>
                      </div>
                      
                      <div className="col-3 col-md-2 text-end fw-bold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </div>
                      
                      <div className="col-3 col-md-2 text-end">
                        <button type="button" className="btn btn-sm btn-outline-danger" title="Supprimer" onClick={() => removeItem(item.productId)}>Supprimer</button>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>
          </div>
        ) : (
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h4 className="card-title text-primary mb-4">1. Livraison</h4>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label">Adresse de livraison complète</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Rue, Numéro, Ville, Code Postal..." 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        required 
                      />
                    </div>
                  </div>

                  <h4 className="card-title text-primary mb-4">2. Choix du mode de paiement</h4>
                  <div className="d-flex flex-wrap gap-3 mb-4">
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'carte' ? 'border-primary bg-light fw-bold' : ''}`} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('carte')}
                    >
                      <i className="bi bi-credit-card fs-2 d-block mb-2"></i>
                      <span>Carte Bancaire</span>
                    </div>
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'paypal' ? 'border-primary bg-light fw-bold' : ''}`} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <i className="bi bi-paypal fs-2 d-block mb-2"></i>
                      <span>PayPal</span>
                    </div>
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'bancontact' ? 'border-primary bg-light fw-bold' : ''}`} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod('bancontact')}
                    >
                      <i className="bi bi-phone fs-2 d-block mb-2"></i>
                      <span>Bancontact / Payconiq</span>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setStep('cart')}>Retour au panier</button>
                    <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                      {loading ? 'Traitement...' : 'Finaliser la commande'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title border-bottom border-secondary pb-3 mb-4">Résumé de la commande</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Sous-total ({totalArticles} articles)</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom border-secondary pb-3">
                <span className="text-muted">TVA (21%)</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total TTC</strong>
                <strong className="fs-5 text-primary">{totalTTC.toFixed(2)} €</strong>
              </div>
              
              {step === 'cart' && (
                <button 
                  className="btn btn-primary w-100 mb-3 btn-lg"
                  onClick={handleCheckoutClick}
                  disabled={cartItems.length === 0}
                >
                  Valider mon panier
                </button>
              )}
              <Link to="/client/produits" className="btn btn-outline-secondary w-100">Continuer mes achats</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
