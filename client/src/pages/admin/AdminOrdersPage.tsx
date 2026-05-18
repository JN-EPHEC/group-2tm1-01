import React, { useState, useEffect } from 'react';

interface Order {
  id: number;
  userId: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  items: string; // Simplifié pour l'affichage ("2x Crème, 1x Bande")
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const formatDate = (value?: string) => {
    if (!value) return 'Date inconnue';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    fetch('https://m1-4.ephec-ti.be:5173/api/orders', { credentials: 'include' }) // 👈 Ajout de credentials obligatoire pour l'admin !
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // On adapte les données reçues du backend pour l'affichage du tableau
          const formattedOrders = data.map((d: any) => ({
            id: d.id,
            userId: d.log_id || d.userId,
            customerName: d.profiles ? `${d.profiles.first_name} ${d.profiles.last_name}` : "Client inconnu",
            date: formatDate(d.order_date || d.created_at || d.date),
            total: Number(d.total_price || d.total || 0),
            status: d.status,
            // Si le backend inclut la jointure order_items :
            items: d.order_items && Array.isArray(d.order_items) 
              ? d.order_items.map((item: any) => `${item.quantity}x ${item.products?.name || 'Produit'}`).join(', ')
              : "Aucun article" 
          }));
          setOrders(formattedOrders);
        }
      })
      .catch(err => console.error("Erreur chargement commandes:", err));
  }, []);

  const handleStatusChange = (id: number, newStatus: Order['status']) => {
    fetch(`https://m1-4.ephec-ti.be:5173/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if(res.ok) {
          setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } else {
          console.error("Erreur mise à jour statut de la commande");
        }
      })
      .catch(err => console.error("Erreur réseau:", err));
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <span className="badge bg-warning text-dark">En attente</span>;
      case 'paid': return <span className="badge bg-info text-dark">Payé</span>;
      case 'shipped': return <span className="badge bg-primary">Expédié</span>;
      case 'cancelled': return <span className="badge bg-danger">Annulé</span>;
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
                      <option value="pending">En attente</option>
                      <option value="paid">Payé</option>
                      <option value="shipped">Expédié</option>
                      <option value="cancelled">Annulé</option>
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
