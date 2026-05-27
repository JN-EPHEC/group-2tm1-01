import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AppointmentType {
  id: number;
  user_id: string; // Pour s'assurer du filtrage par compte
  log_id?: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

interface OrderType {
  id: number;
  created_at?: string;
  order_date?: string;
  date?: string;
  log_id?: string;
  total_price: number;
  total?: number;
  status: string;
  order_items?: any[];
}

interface ProfilePageProps {
  setIsAuthenticated: (val: boolean) => void;
  setIsAdmin?: (val: boolean) => void;
}

const ProfilePage = ({ setIsAuthenticated, setIsAdmin }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'infos' | 'history' | 'appointments'>('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    adresse: ''
  });

  const formatDate = (value?: string) => {
    if (!value) return 'Date inconnue';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Récupération de l'utilisateur connecté
        const response = await fetch('https://m1-4.ephec-ti.be:5173/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            prenom: userData.user_metadata?.prenom || '',
            nom: userData.user_metadata?.nom || '',
            email: userData.email || '',
            phone: userData.user_metadata?.phone || '',
            adresse: userData.user_metadata?.adresse || ''
          });
          
          const displayName = userData.user_metadata?.prenom || userData.email || 'User';
          setProfileImage(`https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff&size=150`);

          // 2. Récupération et filtrage des Rendez-vous de CET utilisateur uniquement
          const resAppts = await fetch('https://m1-4.ephec-ti.be:5173/api/appointments', {
            credentials: 'include'
          });
          if (resAppts.ok) {
            const apptsData = await resAppts.json();
            const myAppts = apptsData.filter((app: any) => app.log_id === userData.id || app.user_id === userData.id || app.id_user === userData.id);
            setAppointments(myAppts);
          }

          // 3. Récupération et filtrage des Commandes de CET utilisateur uniquement (IDs 8 et 9)
          const resOrders = await fetch('https://m1-4.ephec-ti.be:5173/api/orders', {
            credentials: 'include'
          });
          if (resOrders.ok) {
            const ordersData = await resOrders.json();
            const myOrders = ordersData.filter((order: any) => order.log_id === userData.id || order.user_id === userData.id || order.id_user === userData.id);
            setOrders(myOrders);
          }

        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du profil', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, setIsAuthenticated]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('https://m1-4.ephec-ti.be:5173/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prenom: formData.prenom,
          nom: formData.nom,
          phone: formData.phone,
          adresse: formData.adresse
        })
      });

      if (res.ok) {
        setIsEditing(false);
      } else {
        alert("Erreur lors de la mise à jour du profil.");
      }
    } catch (err) {
      console.error("Erreur mise à jour", err);
      alert("Impossible de joindre le serveur.");
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('https://m1-4.ephec-ti.be:5173/api/auth/logout', { method: 'POST', credentials: 'include' });
      setIsAuthenticated(false);
      if (setIsAdmin) setIsAdmin(false);
      navigate('/');
    } catch (err) {
      console.error("Erreur déconnexion", err);
    }
  };

  if (loading) {
    return <div className="container py-4 text-center">Chargement du profil...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mon Profil</h1>

      <div className="row">
        {/* Sidebar / Menu Profile */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <div className="mb-3">
                {profileImage && (
                  <img src={profileImage} alt="Profile" className="rounded-circle img-thumbnail" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                )}
              </div>
              <h5 className="card-title">{formData.prenom} {formData.nom}</h5>
              
              <div className="list-group list-group-flush text-start mt-4">
                <button className={`list-group-item list-group-item-action ${activeTab === 'infos' ? 'active' : ''}`} onClick={() => setActiveTab('infos')}>
                  <i className="bi bi-person me-2"></i> Mes informations
                </button>
                <button className={`list-group-item list-group-item-action ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                  <i className="bi bi-calendar-event me-2"></i> Mes rendez-vous ({appointments.length})
                </button>
                <button className={`list-group-item list-group-item-action ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                  <i className="bi bi-bag me-2"></i> Historique d'achats ({orders.length})
                </button>
                <a href="#" className="list-group-item list-group-item-action text-danger mt-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de Contenu Principale */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              
              {/* Onglet : Informations */}
              {activeTab === 'infos' && (
                <div>
                  <h4 className="mb-4 text-primary">Informations personnelles</h4>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Prénom</label>
                        <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleInput} readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nom</label>
                        <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleInput} readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} disabled />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Téléphone</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInput} readOnly={!isEditing} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Adresse complète</label>
                        <input type="text" name="adresse" className="form-control" value={formData.adresse} onChange={handleInput} readOnly={!isEditing} />
                      </div>
                      <div className="col-12 mt-4 text-end">
                        {!isEditing ? (
                          <button type="button" className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>Modifier mes infos</button>
                        ) : (
                          <>
                            <button type="button" className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>Annuler</button>
                            <button type="button" className="btn btn-success" onClick={handleSave}>Enregistrer</button>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Onglet : Rendez-vous */}
              {activeTab === 'appointments' && (
                <div>
                  <h4 className="mb-4 text-primary">Mes rendez-vous</h4>
                  {appointments.length === 0 ? (
                    <p className="text-muted">Vous n'avez aucun rendez-vous planifié.</p>
                  ) : (
                    <div className="list-group">
                      {appointments.map((app) => (
                        <div key={app.id} className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded">
                          <div>
                            <h6 className="mb-1">Consultation Cabinet</h6>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i> Le {formatDate(app.date)} à {app.time.substring(0, 5)}
                            </small>
                            {app.notes && <p className="mb-0 mt-1 small text-secondary"><i>Motif : {app.notes}</i></p>}
                          </div>
                          <span className={`badge rounded-pill ${app.status === 'booked' ? 'bg-primary' : 'bg-secondary'}`}>
                            {app.status === 'booked' ? 'Confirmé' : app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Onglet : Historique de commandes (DYNAMIQUE) */}
              {activeTab === 'history' && (
                <div>
                  <h4 className="mb-4 text-primary">Historique de mes commandes</h4>
                  {orders.length === 0 ? (
                    <p className="text-muted">Aucune commande enregistrée pour le moment.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover border align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Articles</th>
                            <th>Total</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => {
                            const itemsText = order.order_items && Array.isArray(order.order_items) && order.order_items.length > 0
                              ? order.order_items.map((item: any) => `${item.quantity}x ${item.products?.name || 'Produit'}`).join(', ')
                              : "Aucun article";
                            return (
                              <tr key={order.id}>
                                <td className="fw-bold">#{order.id}</td>
                                <td>{formatDate(order.order_date || order.created_at || order.date)}</td>
                                <td className="small text-muted">{itemsText}</td>
                                <td>{(order.total_price ?? order.total ?? 0).toFixed(2)} €</td>
                                <td>
                                  <span className={`badge rounded-pill ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                    {order.status === 'completed' ? 'Livré' : order.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
