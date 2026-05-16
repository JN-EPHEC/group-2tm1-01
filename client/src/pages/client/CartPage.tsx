import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/shop.css';

interface Product { id: number; name: string; imgIcon: string; desc: string; price: number; }
interface CartPageProps { isAuthenticated?: boolean; }

const CartPage = ({ isAuthenticated = false }: CartPageProps) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'CB' | 'PAYPAL' | 'BANCONTACT' | ''>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    fetch('http://localhost:3000/api/products').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setProducts(data);
    });
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateQty = (id: number, delta: number) => {
    setCart(prev => {
      const sq = prev[id] || 0;
      const nq = Math.max(0, sq + delta);
      const nc = { ...prev };
      if (nq === 0) delete nc[id]; else nc[id] = nq;
      localStorage.setItem('cart', JSON.stringify(nc));
      return nc;
    });
  };

  const getSub = () => Object.entries(cart).reduce((tot, [id, qt]) => {
    const p = products.find(prod => prod.id === parseInt(id));
    return tot + (p ? p.price * qt : 0);
  }, 0);

  const sub = getSub(); const tax = sub * 0.21; const tot = sub + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) { setErrorValue('Veuillez vous connecter pour valider la commande.'); return; }
    setStep('checkout');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) { setErrorValue('Veuillez choisir un moyen de paiement.'); return; }
    localStorage.removeItem('cart'); setCart({}); setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="container text-center py-5">
        <h1 className="text-success mb-4">Commande réussie !</h1>
        <Link to="/client/produits" className="btn btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  const entries = Object.entries(cart);

  return (
    <div>
      <h1 className="mb-4">Mon Panier</h1>
      {errorValue && <div className="alert alert-danger">{errorValue}</div>}
      {entries.length === 0 ? (
        <div className="alert alert-info">Panier vide. <Link to="/client/produits">Boutique</Link></div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                {step === 'cart' ? entries.map(([idStr, qt]) => {
                  const id = parseInt(idStr); const p = products.find(x => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="row align-items-center mb-3 pb-3 border-bottom">
                      <div className="col-6"><h6>{p.name}</h6></div>
                      <div className="col-2 text-center">
                        <button className="btn btn-sm btn-light" onClick={() => updateQty(id, -1)}>-</button>
                        <span className="mx-2">{qt}</span>
                        <button className="btn btn-sm btn-light" onClick={() => updateQty(id, 1)}>+</button>
                      </div>
                      <div className="col-4 text-end">{(p.price * qt).toFixed(2)} €</div>
                    </div>
                  );
                }) : (
                  <form onSubmit={handlePay}>
                    <h4>Paiement</h4>
                    <div className="form-check"><input type="radio" onChange={() => setPaymentMethod('CB')} className="form-check-input"/> <label>Carte Bancaire</label></div>
                    <div className="form-check"><input type="radio" onChange={() => setPaymentMethod('PAYPAL')} className="form-check-input"/> <label>PayPal</label></div>
                    <button className="btn btn-success mt-3">Payer {tot.toFixed(2)} €</button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0"><div className="card-body">
              <h5>Résumé</h5>
              <div className="d-flex justify-content-between"><span>HT</span><span>{sub.toFixed(2)} €</span></div>
              <div className="d-flex justify-content-between"><span>TVA</span><span>{tax.toFixed(2)} €</span></div>
              <div className="d-flex justify-content-between fw-bold mt-2 pt-2 border-top"><span>TTC</span><span>{tot.toFixed(2)} €</span></div>
              {step === 'cart' && <button className="btn btn-primary w-100 mt-3" onClick={handleCheckout}>Valider la commande</button>}
            </div></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
