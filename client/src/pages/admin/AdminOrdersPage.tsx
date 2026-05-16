import React, { useState, useEffect } from 'react';

interface Order {
  id: number;
  userId: string;
  customerName: string;
  date: string;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  items: string; // Simplifié pour l'affichage ("2x Crème, 1x Bande")
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Remplacer par un vrai fetch API
    setOrders([
      { id: 101, userId: '1', customerName: 'Jean Dupont', date: '2026-05-16', total: 45.0, status: 'PENDING', items: '2x Crème de massage' },
      { id: 102, userId: '2', customerName: 'Marie Curie', date: '2026-05-15', total: 15.0, status: 'PREPARING', items: '1x Bande élastique' },
    ]);
  }, []);

  const handleStatusChange = (id: number, newStatus: Order['status']) => {
    // Appel API pour MAJ du statut
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return <span className="badge bg-warning text-dark">À préparer</span>;
      case 'PREPARING': return <span className="badge bg-info text-dark">En cours</span>;
      case 'READY': return <span className="badge bg-primary">Prêt</span>;
      case 'DELIVERED': return <span className="badge bg-success">Livré</span>;
      default: return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Commandes Clients</h2>
      <p className="text-muted">Gérez les commandes et marquez celles qui sont prêtes à être récupérées.</p>
      
      <div className="card mt-4">
        <div className="card-body">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Articles à préparer</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.date}</td>
                  <td>{o.items}</td>
                  <td>{o.total.toFixed(2)} €</td>
                  <td>{getStatusBadge(o.status)}</td>
                  <td>
                    <select 
                      className="form-select form-select-sm" 
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                    >
                      <option value="PENDING">À préparer</option>
                      <option value="PREPARING">En cours</option>
                      <option value="READY">Prêt / À récupérer</option>
                      <option value="DELIVERED">Livré</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">Aucune commande pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;