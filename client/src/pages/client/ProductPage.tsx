import { Link } from 'react-router-dom';

const ProductPage = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Nos Produits et Matériel</h1>
        <Link to="/client/panier" className="btn btn-primary d-flex align-items-center gap-2">
          🛒 Mon Panier <span className="badge bg-light text-primary rounded-pill">3</span>
        </Link>
      </div>

      {/* Filtres */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label text-muted">Filtrer par catégorie</label>
          <select className="form-select shadow-sm">
            <option value="all">Tous les produits</option>
            <option value="cremes">Crèmes et Gels</option>
            <option value="materiel">Matériel de rééducation (Bandes, Haltères...)</option>
            <option value="ortho">Orthèses et maintien</option>
          </select>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="row g-4">
        
        {/* Produit 1 */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '220px', fontSize: '2rem' }}>
              🧴 [Image]
            </div>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">[Nom du produit : Gel chauffant]</h5>
              <p className="card-text text-muted small mb-2">
                [Zone de description : Gel idéal pour la préparation musculaire avant l'effort. Soulage rapidement.]
              </p>
              <div className="mb-3">
                <span className="text-warning">★★★★☆</span> <span className="text-muted small">([12] avis)</span>
              </div>
              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold text-primary">[15.00] €</span>
                <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
              </div>
            </div>
          </div>
        </div>

        {/* Produit 2 */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="bg-light text-secondary d-flex justify-content-center align-items-center rounded-top" style={{ height: '220px', fontSize: '2rem' }}>
              🎗️ [Image]
            </div>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">[Nom du produit : Bande élastique]</h5>
              <p className="card-text text-muted small mb-2">
                [Zone de description : Bande de résistance moyenne pour vos exercices à la maison.]
              </p>
              <div className="mb-3">
                <span className="text-warning">★★★★★</span> <span className="text-muted small">([8] avis)</span>
              </div>
              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold text-primary">[9.50] €</span>
                <button className="btn btn-outline-primary btn-sm">+ Ajouter</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProductPage;