import React, { useState, useEffect } from 'react';

interface AppointmentType {
  id: number;
  customerName: string;
  date: string;
  time: string;
  status: 'booked' | 'cancelled' | 'done';
  notes: string;
}

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedAppt, setSelectedAppt] = useState<AppointmentType | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/appointments', { credentials: 'include' }) // 👈 Inclus les credentials
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedAppts = data.map((a: any) => ({
            id: a.id,
            // Si le backend renvoie la jointure avec la table profiles :
            customerName: a.profiles ? `${a.profiles.first_name} ${a.profiles.last_name}` : "Patient anonyme",
            date: a.date,
            time: a.time || a.hour, // s'adapte selon le nom de votre colonne heure
            status: a.status,
            notes: a.notes || ""
          }));
          setAppointments(formattedAppts);
        }
      })
      .catch(err => console.error("Erreur chargement rendez-vous:", err));
  }, [currentMonth]);

  const handleStatusChange = (id: number, newStatus: AppointmentType['status']) => {
    fetch(`http://localhost:3000/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if(res.ok) {
          setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
        }
      })
      .catch(err => console.error(err));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 0 = Sunday, 1 = Monday... on ajuste pour avoir Lundi (0) à Dimanche (6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Agenda des Rendez-vous</h2>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-primary" onClick={prevMonth}>&laquo; Précédent</button>
          <h4 className="m-0" style={{ minWidth: '200px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </h4>
          <button className="btn btn-outline-primary" onClick={nextMonth}>Suivant &raquo;</button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="row g-0">
            {dayNames.map(day => (
              <div key={day} className="col text-center py-2 bg-light border-bottom border-end fw-bold">
                {day}
              </div>
            ))}
          </div>

          <div className="row g-0">
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="col border-bottom border-end bg-light opacity-50" style={{ minHeight: '120px' }}></div>
            ))}

            {days.map(day => {
              // Formater la date courante (ex: 2026-05-01)
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              // Trouver les rdv pour ce jour
              const dayAppts = appointments
                .filter(a => a.date === dateStr)
                .sort((a, b) => a.time.localeCompare(b.time));

              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div key={day} className={`col border-bottom border-end p-2 ${isToday ? 'bg-primary bg-opacity-10' : ''}`} style={{ minHeight: '120px', minWidth: '14%' }}>
                  <div className="d-flex justify-content-between">
                    <span className={`fw-bold ${isToday ? 'text-primary' : ''}`}>{day}</span>
                    <span className="badge bg-secondary rounded-pill">{dayAppts.length > 0 ? dayAppts.length : ''}</span>
                  </div>
                  
                  <div className="mt-2 d-flex flex-column gap-1">
                    {dayAppts.map(appt => (
                      <div 
                        key={appt.id} 
                        className={`p-1 rounded small text-white lh-sm shadow-sm ${appt.status === 'booked' ? 'bg-primary' : appt.status === 'done' ? 'bg-success' : 'bg-danger'}`}
                        title={appt.notes || 'Pas de notes'}
                        style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                        onClick={() => setSelectedAppt(appt)}
                      >
                        <strong>{appt.time}</strong> {appt.customerName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Remplir la fin de la grille pour avoir des lignes nettes */}
            {Array.from({ length: (7 - ((blanks.length + days.length) % 7)) % 7 }).map((_, i) => (
              <div key={`end-blank-${i}`} className="col border-bottom border-end bg-light opacity-50" style={{ minHeight: '120px', minWidth: '14%' }}></div>
            ))}
          </div>
        </div>
      </div>

      {selectedAppt && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du rendez-vous</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedAppt(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Client :</strong> {selectedAppt.customerName}</p>
                <p><strong>Date & Heure :</strong> {new Date(selectedAppt.date).toLocaleDateString('fr-FR')} à {selectedAppt.time}</p>
                <p><strong>Notes :</strong> {selectedAppt.notes || 'Aucune note'}</p>
                <div className="mb-3">
                  <label className="form-label fw-bold">Statut</label>
                  <select 
                    className="form-select" 
                    value={selectedAppt.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as AppointmentType['status'];
                      handleStatusChange(selectedAppt.id, newStatus);
                      setSelectedAppt({ ...selectedAppt, status: newStatus });
                    }}
                  >
                    <option value="booked">Confirmé</option>
                    <option value="done">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedAppt(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;