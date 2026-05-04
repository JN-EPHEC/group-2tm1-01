const ProductPage = () => {
  return (
    <div className="pb-5">
      <h1 className="mb-4">Nos Produits et Matériel</h1>

      <div className="row g-4">
        
        {/* Zone de filtres */}
        <div className="col-lg-2 col-md-3">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px', zIndex: 1 }}>
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
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="category" id="cat-ort" />
                  <label className="form-check-label" htmlFor="cat-ort">Orthèses</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone des produits */}
        <div className="col-lg-7 col-md-9">
          <div className="row g-4">
            {/* Produit 1 */}
            <div className="col-xl-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '180px', fontSize: '2rem' }}>
                  🧴 [Img]
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">[Gel chauffant]</h6>
                  <p className="card-text text-muted small mb-2">
                    Effet rapide pour la préparation à l'effort.
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold text-primary">15.00 €</span>
                    <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Produit 2 */}
            <div className="col-xl-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '180px', fontSize: '2rem' }}>
                  🎗️ [Img]
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">[Bande élastique]</h6>
                  <p className="card-text text-muted small mb-2">
                    Idéal pour vos exercices à domicile.
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold text-primary">9.50 €</span>
                    <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Produit 3 */}
            <div className="col-xl-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '180px', fontSize: '2rem' }}>
                  💪 [Img]
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">[Haltères 2kg]</h6>
                  <p className="card-text text-muted small mb-2">
                    Revêtement néoprène, prise en main facile.
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold text-primary">22.00 €</span>
                    <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Produit 4 */}
            <div className="col-xl-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '180px', fontSize: '2rem' }}>
                  🧊 [Img]
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">[Pack de Froid]</h6>
                  <p className="card-text text-muted small mb-2">
                    Poche réutilisable chaud/froid.
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold text-primary">8.00 €</span>
                    <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Zone du panier */}
        <div className="col-lg-3 col-md-12 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0 bg-light sticky-top" style={{ top: '20px', zIndex: 1 }}>
            <div className="card-body">
              <h5 className="card-title border-bottom border-secondary pb-3 mb-4 d-flex justify-content-between align-items-center">
                <span>🛒 Mon Panier</span>
                <span className="badge bg-primary rounded-pill">3 articles</span>
              </h5>
              
              {/* Article 1 */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-white">
                <div>
                  <div className="fw-bold fs-6">[Gel chauffant]</div>
                  <div className="text-muted small">15.00 € x 2</div>
                </div>
                <div className="fw-bold">30.00 €</div>
              </div>

              {/* Article 2 */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-white">
                <div>
                  <div className="fw-bold fs-6">[Bande élastique]</div>
                  <div className="text-muted small">9.50 € x 1</div>
                </div>
                <div className="fw-bold">9.50 €</div>
              </div>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Sous-total</span>
                <span>39.50 €</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted small border-bottom border-secondary pb-2">
                <span>TVA (21%)</span>
                <span>8.29 €</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total</strong>
                <strong className="fs-5 text-primary">47.79 €</strong>
              </div>
              
              <button className="btn btn-primary w-100 mb-2">Finaliser la commande</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProductPage;