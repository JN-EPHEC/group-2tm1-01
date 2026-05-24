import React, { useState, useEffect } from 'react';

interface AppointmentType {
  id: number;
  customerName: string;
  date: string;
  time: string;
  status: 'pending' | 'booked' | 'cancelled' | 'done';
  notes: string;
}

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedAppt, setSelectedAppt] = useState<AppointmentType | null>(null);

  useEffect(() => {
    fetch('http://m1-4.ephec-ti.be:5000/api/appointments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedAppts = data.map((a: any) => {
            const cleanDate = a.date && a.date.includes('T') ? a.date.split('T')[0] : a.date;

            return {
              id: a.id,
              customerName: a.profiles ? `${a.profiles.first_name} ${a.profiles.last_name}` : "Patient anonyme",
              date: cleanDate,
              time: a.time || a.hour || "",
              status: a.status || 'pending',
              notes: a.notes || ""
            };
          });
          setAppointments(formattedAppts);
        }
      })
      .catch(err => console.error("Erreur chargement rendez-vous:", err));
  }, [currentMonth]);

  const handleStatusChange = (id: number, newStatus: AppointmentType['status']) => {
    fetch(`http://m1-4.ephec-ti.be:5000/api/appointments/${id}/status`, {
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
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              const dayAppts = appointments
                .filter(a => a.date === dateStr)
                .sort((a, b) => a.time.localeCompare(b.time));

              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div key={day} className={`col border-bottom border-end p-2 ${isToday ? 'bg-primary bg-opacity-10' : ''}`} style={{ minHeight: '120px', minWidth: '14%' }}>
                  <div className="d-flex justify-content-between">
                    <span className={`fw-bold ${isToday ? 'text-primary' : ''}`}>{day}</span>
                    {dayAppts.length > 0 && <span className="badge bg-secondary rounded-pill">{dayAppts.length}</span>}
                  </div>
                  
                  <div className="mt-2 d-flex flex-column gap-1">
                    {dayAppts.map(appt => {
                      let badgeColor = 'bg-primary';
                      if (appt.status === 'pending') badgeColor = 'bg-warning text-dark';
                      else if (appt.status === 'done') badgeColor = 'bg-success';
                      else if (appt.status === 'cancelled') badgeColor = 'bg-danger';

                      return (
                        <div 
                          key={appt.id} 
                          className={`p-1 rounded small lh-sm shadow-sm ${badgeColor}`}
                          title={appt.notes || 'Pas de notes'}
                          style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                          onClick={() => setSelectedAppt(appt)}
                        >
                          <strong>{appt.time}</strong> {appt.customerName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
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
                <p><strong>Date & Heure :</strong> {selectedAppt.date} à {selectedAppt.time}</p>
                <p><strong>Notes / Motif :</strong> {selectedAppt.notes || 'Aucune note fournie'}</p>
                <div className="mb-3">
                  <label className="form-label fw-bold">Modifier le statut</label>
                  <select 
                    className="form-select" 
                    value={selectedAppt.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as AppointmentType['status'];
                      handleStatusChange(selectedAppt.id, newStatus);
                      setSelectedAppt({ ...selectedAppt, status: newStatus });
                    }}
                  >
                    <option value="pending">En attente</option>
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
