import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/shop.css';

const CartPage = () => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [createAccount, setCreateAccount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CB' | 'PAYPAL' | 'BANCONTACT' | ''>('');
  const [errorValue, setErrorValue] = useState<string>('');

  const handleCheckoutClick = () => {
    setStep('checkout');
  };

  const handlePaymentSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setErrorValue("Veuillez sélectionner un mode de paiement.");
      return;
    }
    setErrorValue("");
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="container text-center py-5">
        <div className="mb-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h1 className="mb-3 text-success">Merci pour votre commande !</h1>
        <p className="lead mb-4">Votre paiement a été simulé avec succès. (Mode projet)</p>
        <Link to="/client/produits" className="btn btn-primary btn-lg">Retourner à la boutique</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Mon Panier</h1>
      
      <div className="row g-4">
        {step === 'cart' ? (
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                
                {/* Entête du tableau (caché sur petit écran) */}
                <div className="row text-muted fw-bold pb-2 mb-3 border-bottom d-none d-md-flex">
                  <div className="col-6">Produit</div>
                  <div className="col-2 text-center">Quantité</div>
                  <div className="col-2 text-end">Prix</div>
                </div>

                {/* Ligne Produit 1 */}
                <div className="row align-items-center mb-3 pb-3 border-bottom">
                  <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
                    <div className="bg-light rounded text-center text-muted d-flex align-items-center justify-content-center me-3 cart-item-image">
                      [Img]
                    </div>
                    <div>
                      <h6 className="mb-0">[Gel chauffant]</h6>
                      <small className="text-muted">[Texte court promo ou type]</small>
                    </div>
                  </div>
                  
                  <div className="col-6 col-md-2 d-flex justify-content-center">
                    <div className="input-group input-group-sm qty-input-group">
                      <button className="btn btn-outline-secondary">-</button>
                      <input type="text" className="form-control text-center" value="2" readOnly />
                      <button className="btn btn-outline-secondary">+</button>
                    </div>
                  </div>
                  
                  <div className="col-3 col-md-2 text-end fw-bold">
                    [30.00] €
                  </div>
                  
                  <div className="col-3 col-md-2 text-end">
                    <button className="btn btn-sm btn-outline-danger" title="Supprimer">Supprimer</button>
                  </div>
                </div>

                {/* Ligne Produit 2 */}
                <div className="row align-items-center mb-0">
                  <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
                    <div className="bg-light rounded text-center text-muted d-flex align-items-center justify-content-center me-3 cart-item-image">
                      [Img]
                    </div>
                    <div>
                      <h6 className="mb-0">[Bande élastique]</h6>
                    </div>
                  </div>
                  
                  <div className="col-6 col-md-2 d-flex justify-content-center">
                    <div className="input-group input-group-sm qty-input-group">
                      <button className="btn btn-outline-secondary">-</button>
                      <input type="text" className="form-control text-center" value="1" readOnly />
                      <button className="btn btn-outline-secondary">+</button>
                    </div>
                  </div>
                  
                  <div className="col-3 col-md-2 text-end fw-bold">
                    [9.50] €
                  </div>
                  
                  <div className="col-3 col-md-2 text-end">
                    <button className="btn btn-sm btn-outline-danger" title="Supprimer">Supprimer</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h4 className="card-title text-primary mb-4">1. Identité & Livraison</h4>
                <form onSubmit={handlePaymentSimulation}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Prénom</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nom</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Adresse Email</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Adresse de livraison</label>
                      <input type="text" className="form-control" placeholder="Rue, Numéro, Ville, Code Postal" required />
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="createAccount" 
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="createAccount">
                      Créer un compte pour suivre mes commandes futures
                    </label>
                  </div>

                  {/* Champs supplémentaires si création de compte demandée */}
                  {createAccount && (
                    <div className="card border-primary bg-light mb-4">
                      <div className="card-body">
                        <h6 className="card-title text-primary"><i className="bi bi-person-plus me-2"></i>Informations de profil</h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Prénom</label>
                            <input type="text" className="form-control" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Nom</label>
                            <input type="text" className="form-control" required />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Adresse Email</label>
                            <input type="email" className="form-control" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone</label>
                            <input type="tel" className="form-control" required />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Adresse de livraison par défaut</label>
                            <input type="text" className="form-control" placeholder="Rue, Numéro, Ville, Code Postal" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Mot de passe</label>
                            <input type="password" className="form-control" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Confirmer le mot de passe</label>
                            <input type="password" className="form-control" required />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {errorValue && (
                    <div className="alert alert-danger" role="alert">
                      {errorValue}
                    </div>
                  )}

                  <h4 className="card-title text-primary mb-4">2. Choix du mode de paiement</h4>
                  <div className="d-flex flex-wrap gap-3 mb-4">
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'CB' ? 'border-primary bg-primary text-white shadow' : 'bg-light text-muted'}`} 
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setPaymentMethod('CB')}
                    >
                      <i className="bi bi-credit-card fs-2 d-block mb-2"></i>
                      <span className="fw-bold">Carte Bancaire</span>
                    </div>
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'PAYPAL' ? 'border-primary bg-primary text-white shadow' : 'bg-light text-muted'}`} 
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setPaymentMethod('PAYPAL')}
                    >
                      <i className="bi bi-paypal fs-2 d-block mb-2"></i>
                      <span className="fw-bold">PayPal</span>
                    </div>
                    <div 
                      className={`border rounded p-3 text-center flex-fill ${paymentMethod === 'BANCONTACT' ? 'border-primary bg-primary text-white shadow' : 'bg-light text-muted'}`} 
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setPaymentMethod('BANCONTACT')}
                    >
                      <i className="bi bi-phone fs-2 d-block mb-2"></i>
                      <span className="fw-bold">Bancontact / Payconiq</span>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setStep('cart')}>Retour au panier</button>
                    <button type="submit" className="btn btn-success btn-lg">Simuler le paiement</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Résumé de commande */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title border-bottom border-secondary pb-3 mb-4">Résumé de la commande</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Sous-total (3 articles)</span>
                <span>[39.50] €</span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom border-secondary pb-3">
                <span className="text-muted">TVA (21%)</span>
                <span>[8.29] €</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total TTC</strong>
                <strong className="fs-5 text-primary">[47.79] €</strong>
              </div>
              
              {step === 'cart' && (
                <button 
                  className="btn btn-primary w-100 mb-3 btn-lg"
                  onClick={handleCheckoutClick}
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