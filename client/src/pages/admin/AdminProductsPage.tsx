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
    fetch('https://m1-4.ephec-ti.be:5000/api/products')
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
      fetch(`https://m1-4.ephec-ti.be:5000/api/products/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) throw new Error('Erreur de modification');
        return res.json();
      })
      .then(updatedProd => {
        setProducts(products.map(p => p.id === updatedProd.id ? updatedProd : p));
        setFormData({ name: '', price: 0, description: '', category: '' });
        setIsEditing(false);
      })
      .catch(err => alert(err.message));
    } else {
      fetch(`https://m1-4.ephec-ti.be:5000/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) throw new Error('Erreur de création ou problème de permissions');
        return res.json();
      })
      .then(newProd => {
        setProducts([...products, newProd]);
        setFormData({ name: '', price: 0, description: '', category: '' });
        setIsEditing(false);
      })
      .catch(err => alert(err.message));
    }
  };

  const handeEditClick = (prod: Product) => {
    setFormData(prod);
    setIsEditing(true);
  };

  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
      fetch(`https://m1-4.ephec-ti.be:5000/api/products/${productToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      .then(() => {
        setProducts(products.filter(p => p.id !== productToDelete));
        setProductToDelete(null);
      });
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Produits</h2>
      {productToDelete !== null && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Voulez-vous vraiment supprimer ce produit ?</span>
          <div>
            <button className="btn btn-danger btn-sm me-2" onClick={confirmDelete}>Oui, supprimer</button>
            <button className="btn btn-secondary btn-sm" onClick={cancelDelete}>Annuler</button>
          </div>
        </div>
      )}
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
                  <select 
                    className="form-select" 
                    name="category" 
                    value={formData.category || ''} 
                    onChange={handleInputChange as any} 
                    required
                  >
                    <option value="" disabled>-- Sélectionner une catégorie --</option>
                    <option value="Soins et Massages">Soins et Massages</option>
                    <option value="Équipement Sportif">Équipement Sportif</option>
                    <option value="Accessoires">Accessoires</option>
                    <option value="Vêtements">Vêtements</option>
                    <option value="Nutrition">Nutrition</option>
                  </select>
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
                  {products.map((p, index) => (
                    <tr key={p.id ? `${p.id}-${index}` : `fallback-${index}`}>
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
