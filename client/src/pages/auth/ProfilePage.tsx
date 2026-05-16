import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  setIsAuthenticated: (val: boolean) => void;
}

const ProfilePage = ({ setIsAuthenticated }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'infos' | 'history' | 'appointments'>('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    adresse: ''
  });

  const [appointments, setAppointments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include' // Important pour envoyer le cookie "access_token"
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFormData({
            prenom: data.user_metadata?.prenom || '',
            nom: data.user_metadata?.nom || '',
            email: data.email || '',
            phone: data.phone || '',
            adresse: data.user_metadata?.adresse || ''
          });
          
          const displayName = data.user_metadata?.prenom || data.email || 'User';
          setProfileImage(`https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff&size=150`);

          // Fetch user history
          fetchHistory(data.id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async (userId: string) => {
      try {
        const [ordersRes, apptsRes] = await Promise.all([
          fetch('http://localhost:3000/api/orders'),
          fetch('http://localhost:3000/api/appointments')
        ]);
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.filter((o: any) => o.log_id === userId));
        }
        if (apptsRes.ok) {
          const apptsData = await apptsRes.json();
          setAppointments(apptsData.filter((a: any) => a.log_id === userId));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSave = () => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir modifier vos informations personnelles ?");
    if (confirm) {
      setIsEditing(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="container py-4 text-center">Chargement du profil...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mon Profil</h1>

      <div className="row">
        {/* Sidebar/Menu Profile */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <div className="mb-3 position-relative d-inline-block">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="rounded-circle img-thumbnail" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle img-thumbnail bg-secondary d-flex align-items-center justify-content-center text-white" 
                    style={{ width: '120px', height: '120px', fontSize: '2rem' }}
                  >
                    <i className="bi bi-person"></i>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImageChange} 
                />
                <button 
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0"
                  title="Changer la photo"
                  onClick={handleCameraClick}
                >
                  <i className="bi bi-camera"></i>
                </button>
              </div>
              <h5 className="card-title">{formData.prenom && formData.nom ? `${formData.prenom} ${formData.nom}` : formData.email?.split('@')[0]}</h5>
              <p className="text-muted small">Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'}</p>
              
              <div className="list-group list-group-flush text-start mt-4">
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'infos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('infos')}
                >
                  <i className="bi bi-person me-2"></i> Mes informations
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <i className="bi bi-bag me-2"></i> Historique d'achats
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  <i className="bi bi-calendar-event me-2"></i> Mes rendez-vous
                </button>
                <a href="#" className="list-group-item list-group-item-action text-danger mt-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              
              {/* Tab: Informations */}
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
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInput} readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Téléphone</label>
                        <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleInput} readOnly={!isEditing} placeholder="Aucun" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Adresse complète</label>
                        <input type="text" name="adresse" className="form-control" value={formData.adresse} onChange={handleInput} readOnly={!isEditing} placeholder="Aucune" />
                      </div>
                      <div className="col-12 mt-4 text-end">
                        {!isEditing ? (
                          <button type="button" className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>
                            Modifier mes infos
                          </button>
                        ) : (
                          <>
                            <button type="button" className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>Annuler</button>
                            <button type="button" className="btn btn-success" onClick={handleSave}>Enregistrer les modifications</button>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: Historique d'achats */}
              {activeTab === 'history' && (
                <div>
                  <h4 className="mb-4 text-primary">Historique d'achats</h4>
                  {orders.length === 0 ? (
                    <p className="text-muted">Aucune commande pour le moment.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>#CMD-{order.id}</td>
                              <td>{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                              <td>{order.total} €</td>
                              <td>
                                <span className={`badge ${order.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Rendez-vous */}
              {activeTab === 'appointments' && (
                <div>
                  <h4 className="mb-4 text-primary">Mes rendez-vous</h4>
                  {appointments.length === 0 ? (
                    <p className="text-muted">Aucun rendez-vous planifié.</p>
                  ) : (
                    <div className="list-group">
                      {appointments.map((appt) => (
                        <div key={appt.id} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 border rounded ${appt.status === 'cancelled' ? 'bg-light' : ''}`}>
                          <div>
                            <h6 className={`mb-1 ${appt.status === 'cancelled' ? 'text-muted' : ''}`}>
                              {appt.note || 'Séance'}
                            </h6>
                            <small className="text-muted"><i className="bi bi-clock me-1"></i> {appt.date} à {appt.time}</small>
                          </div>
                          <span className={`badge rounded-pill ${appt.status === 'cancelled' ? 'bg-secondary' : 'bg-primary'}`}>
                            {appt.status}
                          </span>
                        </div>
                      ))}
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