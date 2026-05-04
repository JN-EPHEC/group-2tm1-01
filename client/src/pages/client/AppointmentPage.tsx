const AppointmentPage = () => {
  return (
    <div>
      <h1 className="mb-4">Prendre un rendez-vous</h1>
      
      <div className="row g-4">
        {/* Étape 1 : Calendrier et Heures */}
        <div className="col-md-5">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h4 className="card-title mb-4 text-primary">1. Date & Heure</h4>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Sélectionner une date</label>
                <input type="date" className="form-control shadow-sm" />
              </div>

              <div>
                <label className="form-label fw-bold">Créneaux disponibles</label>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary">09:00</button>
                  <button className="btn btn-outline-primary">09:30</button>
                  <button className="btn btn-secondary" disabled>10:00 (Réservé)</button>
                  <button className="btn btn-outline-primary">10:30</button>
                  <button className="btn btn-outline-primary">11:00</button>
                  <button className="btn btn-outline-primary">14:00</button>
                  <button className="btn btn-outline-primary">14:30</button>
                  <button className="btn btn-outline-primary">15:00</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Étape 2 : Formulaire patient */}
        <div className="col-md-7">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h4 className="card-title mb-4 text-primary">2. Vos informations</h4>
              
              <form>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Prénom</label>
                    <input type="text" className="form-control" placeholder="Ex: Jean" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Nom</label>
                    <input type="text" className="form-control" placeholder="Ex: Dupont" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Contact</label>
                    <input type="text" className="form-control"  />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold mt-2">Votre message</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      placeholder="Détaillez ici vos besoins afin de planifier une séance adpatée"
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4 text-end">
                    <button type="submit" className="btn btn-primary btn-lg">Confirmer le rendez-vous</button>
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