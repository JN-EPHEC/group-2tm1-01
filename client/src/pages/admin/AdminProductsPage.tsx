import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, description: '', category: '' });

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Format inattendu:", data);
        }
      })
      .catch(err => console.error("Erreur chargement produits:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      fetch(`http://localhost:3000/api/products/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(updatedProd => {
        setProducts(products.map(p => p.id === updatedProd.id ? updatedProd : p));
      });
    } else {
      fetch(`http://localhost:3000/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(newProd => {
        setProducts([...products, newProd]);
      });
    }
    // Réinitialiser le formulaire
    setFormData({ name: '', price: 0, description: '', category: '' });
    setIsEditing(false);
  };

  const handeEditClick = (prod: Product) => {
    setFormData(prod);
    setIsEditing(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(products.filter(p => p.id !== id));
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Produits</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">{isEditing ? 'Modifier un produit' : 'Ajouter un produit'}</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Prix (€)</label>
                  <input type="number" step="0.01" className="form-control" name="price" value={formData.price || 0} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Catégorie</label>
                  <input type="text" className="form-control" name="category" value={formData.category || ''} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3}></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">{isEditing ? 'Mettre à jour' : 'Ajouter'}</button>
                {isEditing && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => { setIsEditing(false); setFormData({ name: '', price: 0, description: '', category: '' }); }}>
                    Annuler
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.price} €</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handeEditClick(p)}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(p.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;