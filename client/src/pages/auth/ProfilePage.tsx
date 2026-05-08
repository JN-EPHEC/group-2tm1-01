import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  setIsAuthenticated: (val: boolean) => void;
}

const ProfilePage = ({ setIsAuthenticated }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'infos' | 'history' | 'appointments'>('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("https://i.pravatar.cc/150?img=3");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mon Profil</h1>

      <div className="row">
        {/* Sidebar/Menu Profile */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <div className="mb-3 position-relative d-inline-block">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="rounded-circle img-thumbnail" 
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
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
              <h5 className="card-title">Jean Dupont</h5>
              <p className="text-muted small">Membre depuis le 12 mai 2026</p>
              
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
                        <input type="text" className="form-control" defaultValue="Jean" readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nom</label>
                        <input type="text" className="form-control" defaultValue="Dupont" readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" defaultValue="jean.dupont@example.com" readOnly={!isEditing} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Téléphone</label>
                        <input type="tel" className="form-control" defaultValue="0470 12 34 56" readOnly={!isEditing} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Adresse complète</label>
                        <input type="text" className="form-control" defaultValue="Rue de la kiné 1, 1000 Bruxelles" readOnly={!isEditing} />
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
                        <tr>
                          <td>#CMD-84920</td>
                          <td>05/05/2026</td>
                          <td>47.79 €</td>
                          <td><span className="badge bg-success">Livrée</span></td>
                        </tr>
                        <tr>
                          <td>#CMD-84112</td>
                          <td>12/04/2026</td>
                          <td>15.00 €</td>
                          <td><span className="badge bg-success">Livrée</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Rendez-vous */}
              {activeTab === 'appointments' && (
                <div>
                  <h4 className="mb-4 text-primary">Mes rendez-vous</h4>
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 border rounded">
                      <div>
                        <h6 className="mb-1">Séance de Kiné Sportive</h6>
                        <small className="text-muted"><i className="bi bi-clock me-1"></i> Demain à 10:30</small>
                      </div>
                      <span className="badge bg-primary rounded-pill">À venir</span>
                    </div>
                    <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 border rounded bg-light">
                      <div>
                        <h6 className="mb-1 text-muted">Bilan Initial</h6>
                        <small className="text-muted"><i className="bi bi-clock me-1"></i> 10 Avril 2026</small>
                      </div>
                      <span className="badge bg-secondary rounded-pill">Terminé</span>
                    </div>
                  </div>
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