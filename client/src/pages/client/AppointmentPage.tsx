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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  // Récupérer les rendez-vous existants
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://m1-4.ephec-ti.be:5173/api/appointments', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    };
    fetchAppointments();
  }, []);

  // Filtrer les créneaux déjà réservés pour la date sélectionnée
  const bookedSlots = appointments
    .filter(app => app.date === selectedDate && app.status !== 'cancelled')
    .map(app => app.time.substring(0, 5)); // S'assure du format "HH:MM"

  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour prendre un rendez-vous.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError("Veuillez slectionner une date et une heure.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://m1-4.ephec-ti.be:5173/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          status: 'booked',
          notes: formData.message,
        }),
      });

      if (response.ok) {
        // Redirection vers le profil
        navigate('/profil');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Détails erreur serveur:", errorData);
        if (response.status === 401) {
          setError("Vous devez être connecté pour prendre un rendez-vous.");
        } else {
          setError(errorData.error || "Erreur lors de la création du rendez-vous");
        }
      }
    } catch (error) {
      console.error("Erreur serveur", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1 className="mb-4">Prendre un rendez-vous</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row g-4">
        {/* étape 1 : Calendrier et Heures */}
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
                      // 0 = Dimanche, 6 = Samedi
                      if (day === 0 || day === 6) {
                        setError("Le cabinet est fermé le week-end. Veuillez choisir un jour en semaine.");
                        return;
                      }
                    }
                    setSelectedDate(dateValue);
                    setSelectedTime(""); // Reset l'heure si on change de date
                  }}
                  min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
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

        {/* étape 2 : Formulaire patient */}
        <div className="col-md-7">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h4 className="card-title mb-4 text-primary">2. Vos informations</h4>
              
              <form onSubmit={handleConfirmAppointment}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Prénom</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInput} className="form-control" placeholder="Ex: Jean" required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Nom</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInput} className="form-control" placeholder="Ex: Dupont" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Contact</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleInput} className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold mt-2">Votre message</label>
                    <textarea 
                      className="form-control" 
                      name="message"
                      value={formData.message} 
                      onChange={handleInput}
                      rows={4} 
                      placeholder="Détaillez ici vos besoins afin de planifier une séance adaptée"
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
