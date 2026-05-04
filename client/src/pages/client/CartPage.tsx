import { Link } from 'react-router-dom';
import '../../styles/shop.css';

const CartPage = () => {
  return (
    <div>
      <h1 className="mb-4">Mon Panier</h1>
      
      <div className="row g-4">
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
              
              <button className="btn btn-primary w-100 mb-3 btn-lg">Payer la commande</button>
              <Link to="/client/produits" className="btn btn-outline-secondary w-100">Continuer mes achats</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;