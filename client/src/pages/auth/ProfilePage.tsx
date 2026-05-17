/*import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
          
          // Génération d'une jolie photo de profil par défaut avec la première lettre si pas de photo
          const displayName = data.user_metadata?.prenom || data.email || 'User';
          setProfileImage(`https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff&size=150`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil', error);
      } finally {
        setLoading(false);
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
        {/* Sidebar/Menu Profile ----}
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

        {/* Content Area ----}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              
              {/* Tab: Informations ----}
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

              {/* Tab: Historique d'achats ----}
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

              {/* Tab: Rendez-vous -----}
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
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AppointmentType {
  id: number;
  date: string;
  time: string;
  status: string;
}

interface AppointmentPageProps {
  isAuthenticated: boolean;
}

const AppointmentPage = ({ isAuthenticated }: AppointmentPageProps) => {
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // State pour stocker les infos de l'utilisateur connecté
  const [userProfile, setUserProfile] = useState({ prenom: '', nom: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  // Récupérer les rendez-vous existants ET les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupération des rendez-vous
        const resAppts = await fetch('http://localhost:3000/api/appointments', { credentials: 'include' });
        if (resAppts.ok) {
          const data = await resAppts.json();
          setAppointments(data);
        }

        // 2. Récupération de l'utilisateur connecté pour pré-remplir la page
        const resUser = await fetch('http://localhost:3000/api/auth/me', { credentials: 'include' });
        if (resUser.ok) {
          const userData = await resUser.json();
          setUserProfile({
            prenom: userData.user_metadata?.prenom || '',
            nom: userData.user_metadata?.nom || '',
            email: userData.email || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };
    fetchData();
  }, []);

  const bookedSlots = appointments
    .filter(app => app.date === selectedDate && app.status !== 'cancelled')
    .map(app => app.time.substring(0, 5));

  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour prendre un rendez-vous.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError("Veuillez sélectionner une date et une heure.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          status: 'booked',
          notes: message,
        }),
      });

      if (response.ok) {
        navigate('/profil');
      } else {
        setError(response.status === 401 ? "Session expirée. Reconnectez-vous." : "Erreur lors de la création du rendez-vous");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Prendre un rendez-vous</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row g-4">
        {/* Étape 1 : Date & Heure */}
        <div className="col-md-5">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h4 className="card-title mb-4 text-primary">1. Date & Heure</h4>
              <div className="mb-4">
                <label className="form-label fw-bold">Sélectionner une date</label>
                <input 
                  type="date" 
                  className="form-control shadow-sm" 
                  value={selectedDate}
                  onChange={(e) => {
                    setError('');
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const day = new Date(dateValue).getDay();
                      if (day === 0 || day === 6) {
                        setError("Le cabinet est fermé le week-end.");
                        return;
                      }
                    }
                    setSelectedDate(dateValue);
                    setSelectedTime("");
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="form-label fw-bold">Créneaux disponibles</label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedDate ? allSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button 
                        key={slot}
                        type="button"
                        className={`btn ${selectedTime === slot ? 'btn-primary' : 'btn-outline-primary'}`}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot} {isBooked ? '(Réservé)' : ''}
                      </button>
                    );
                  }) : <p className="text-muted small">Veuillez d'abord choisir une date</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Étape 2 : Infos Patient (Lecture seule pour protéger ton profil !) */}
        <div className="col-md-7">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h4 className="card-title mb-4 text-primary">2. Vos informations</h4>
              <form onSubmit={handleConfirmAppointment}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Prénom</label>
                    <input type="text" className="form-control bg-light" value={userProfile.prenom} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Nom</label>
                    <input type="text" className="form-control bg-light" value={userProfile.nom} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email de contact</label>
                    <input type="text" className="form-control bg-light" value={userProfile.email} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold mt-2">Votre message / Motif de consultation</label>
                    <textarea 
                      className="form-control" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4} 
                      placeholder="Détaillez vos besoins pour adapter la séance..."
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4 text-end">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Création...' : 'Confirmer le rendez-vous'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppointmentPage;