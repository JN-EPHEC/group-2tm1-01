import React, { useState, useMemo } from 'react';

type TransactionType = 'INCOME' | 'EXPENSE';
type TransactionStatus = 'PAID' | 'PENDING';

interface Transaction {
  id: string;
  year: number;
  month: number;
  type: TransactionType;
  date: string;
  amount: number;
  reference?: string; // N° attestation ou facture (surtout pour les entrées)
  status: TransactionStatus;
  comment: string;
}

const DashboardPage: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'HOME' | 'SUMMARY' | 'YEARS_LIST' | 'YEAR_DETAIL'>('HOME');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Data State (Simulation de base de données)
  const [years, setYears] = useState<number[]>([2025, 2026]);
  const [newYearInput, setNewYearInput] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', year: 2026, month: 5, type: 'INCOME', date: '2026-05-01', amount: 50.0, reference: 'ATT-001', status: 'PAID', comment: 'Consultation standard' },
    { id: '2', year: 2026, month: 5, type: 'INCOME', date: '2026-05-04', amount: 50.0, reference: 'ATT-002', status: 'PENDING', comment: 'À payer' },
    { id: '3', year: 2026, month: 5, type: 'EXPENSE', date: '2026-05-02', amount: 15.5, status: 'PAID', comment: 'Achat petit matériel' },
  ]);

  // Form States
  const [showForm, setShowForm] = useState<'NONE' | 'INCOME' | 'EXPENSE'>('NONE');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    reference: '',
    comment: ''
  });

  // --- ACTIONS ---

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(newYearInput);
    if (!isNaN(y) && !years.includes(y)) {
      setYears([...years, y].sort((a,b) => b-a));
      setNewYearInput('');
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear) return;
    
    const dateObj = new Date(formData.date);
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      type: showForm === 'INCOME' ? 'INCOME' : 'EXPENSE',
      date: formData.date,
      amount: parseFloat(formData.amount),
      reference: showForm === 'INCOME' ? formData.reference : undefined,
      status: showForm === 'INCOME' ? 'PENDING' : 'PAID', // Par défaut
      comment: formData.comment
    };

    setTransactions([...transactions, newTx]);
    setShowForm('NONE');
    setFormData({ date: '', amount: '', reference: '', comment: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Attention : Voulez-vous vraiment supprimer cet élément ?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleEdit = (_id: string) => {
    if (window.confirm('Attention : Vous allez modifier cet élément. Procéder ?')) {
      alert('Mode édition (à implémenter en détail). Vous pouvez basculer le statut depuis le tableau pour le moment.');
    }
  };

  const handleToggleStatus = (id: string) => {
    setTransactions(transactions.map(t => {
      if (t.id === id && t.type === 'INCOME') {
        return { ...t, status: t.status === 'PAID' ? 'PENDING' : 'PAID' };
      }
      return t;
    }));
  };

  // --- CALCULS & DONNEES DERIVEES ---

  const currentYearTransactions = useMemo(() => {
    let txs = transactions.filter(t => t.year === selectedYear);
    if (selectedMonth) txs = txs.filter(t => t.month === selectedMonth);
    if (searchQuery) {
      txs = txs.filter(t => t.reference?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedYear, selectedMonth, searchQuery]);

  const unpaidTotal = useMemo(() => 
    currentYearTransactions.filter(t => t.type === 'INCOME' && t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0)
  , [currentYearTransactions]);

  // --- COMPOSANTS DE VEUES ---

  const renderHome = () => (
    <div className="text-center mt-5">
      <h2 className="mb-4">Bienvenue sur le tableau de bord de gestion financière</h2>
      <p className="lead mb-5">Choisissez le mode d'affichage de vos entrées et sorties d'argent.</p>
      <div className="d-flex justify-content-center gap-4">
        <button className="btn btn-primary btn-lg px-4 py-3 shadow-sm" onClick={() => setView('SUMMARY')}>
          Tableau récapitulatif
        </button>
        <button className="btn btn-outline-primary btn-lg px-4 py-3 shadow-sm" onClick={() => setView('YEARS_LIST')}>
          Gérer par années
        </button>
      </div>
    </div>
  );

  const renderSummary = () => {
    // Calcul des stats globales par année
    const statsByYear = years.map(y => {
      const txs = transactions.filter(t => t.year === y);
      const income = txs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const expense = txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      return { year: y, income, expense, balance: income - expense };
    });

    return (
      <div>
        <button className="btn btn-secondary mb-4" onClick={() => setView('HOME')}>← Retour Accueil</button>
        <h3 className="mb-4">Tableau récapitulatif global</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Année</th>
                  <th className="text-success">Total Entrées</th>
                  <th className="text-danger">Total Sorties</th>
                  <th>Bilan</th>
                </tr>
              </thead>
              <tbody>
                {statsByYear.map(stat => (
                  <tr key={stat.year}>
                    <td className="fw-bold">{stat.year}</td>
                    <td className="text-success">+{stat.income.toFixed(2)} €</td>
                    <td className="text-danger">-{stat.expense.toFixed(2)} €</td>
                    <td className={stat.balance >= 0 ? "fw-bold text-success" : "fw-bold text-danger"}>
                      {stat.balance.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderYearsList = () => (
    <div>
      <button className="btn btn-secondary mb-4" onClick={() => setView('HOME')}>← Retour Accueil</button>
      <h3 className="mb-4">Mes Années Comptables</h3>
      
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex flex-wrap gap-3 mb-4">
            {years.sort((a,b) => b-a).map(y => (
              <button 
                key={y} 
                className="btn btn-lg btn-outline-dark px-5 py-4 fw-bold shadow-sm"
                onClick={() => { setSelectedYear(y); setView('YEAR_DETAIL'); setSelectedMonth(null); setShowForm('NONE'); }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title">Créer une nouvelle année</h5>
              <form onSubmit={handleCreateYear} className="mt-3">
                <div className="input-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Ex: 2027" 
                    value={newYearInput}
                    onChange={e => setNewYearInput(e.target.value)}
                    required
                  />
                  <button className="btn btn-success" type="submit">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderYearDetail = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-secondary" onClick={() => setView('YEARS_LIST')}>← Retour aux années</button>
        <h2 className="m-0">Gestion {selectedYear}</h2>
        <div className="bg-warning text-dark px-4 py-2 rounded-3 fw-bold shadow-sm">
          Total impayés : {unpaidTotal.toFixed(2)} €
        </div>
      </div>

      {/* Barre d'outils (Filtres et Actions) */}
      <div className="card shadow-sm mb-4 border-0 bg-light">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex gap-3 align-items-center flex-grow-1">
            <select 
              className="form-select w-auto" 
              value={selectedMonth || ''} 
              onChange={e => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Tous les mois</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Mois {i+1}</option>)}
            </select>
            
            <input 
              type="text" 
              className="form-control w-auto flex-grow-1" 
              placeholder="Rechercher par N° Attestation / Facture..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
          </div>
          
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={() => setShowForm(showForm === 'INCOME' ? 'NONE' : 'INCOME')}>
              + Ajouter Entrée
            </button>
            <button className="btn btn-danger" onClick={() => setShowForm(showForm === 'EXPENSE' ? 'NONE' : 'EXPENSE')}>
              - Ajouter Sortie
            </button>
          </div>
        </div>
      </div>

      {/* Formulaires d'ajout dynamically shown */}
      {showForm !== 'NONE' && (
        <div className={`card shadow-sm mb-4 border-0 border-start border-4 ${showForm === 'INCOME' ? 'border-success' : 'border-danger'}`}>
          <div className="card-body">
            <h5 className="card-title mb-3">
              {showForm === 'INCOME' ? '📥 Nouvelle Entrée d\'argent' : '📤 Nouvelle Sortie d\'argent'}
            </h5>
            <form onSubmit={handleAddTransaction} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Montant ({showForm === 'INCOME' ? '+' : '-'})</label>
                <div className="input-group">
                  <input type="number" step="0.01" min="0" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  <span className="input-group-text">€</span>
                </div>
              </div>
              {showForm === 'INCOME' && (
                <div className="col-md-3">
                  <label className="form-label">N° Attestion/Facture</label>
                  <input type="text" className="form-control" required value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
                </div>
              )}
              <div className={showForm === 'INCOME' ? "col-md-3" : "col-md-6"}>
                <label className="form-label">Commentaires</label>
                <input type="text" className="form-control" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} />
              </div>
              <div className="col-12 text-end mt-4">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setShowForm('NONE')}>Annuler</button>
                <button type="submit" className={`btn ${showForm === 'INCOME' ? 'btn-success' : 'btn-danger'}`}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau principal */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th className="px-3">Date</th>
                  <th>Montant</th>
                  <th>N° Ref</th>
                  <th>Statut</th>
                  <th>Commentaires</th>
                  <th className="text-end px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentYearTransactions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">Aucune donnée trouvée.</td></tr>
                ) : currentYearTransactions.map(tx => (
                  <tr key={tx.id} style={{ backgroundColor: tx.type === 'INCOME' ? 'rgba(25, 135, 84, 0.05)' : 'rgba(220, 53, 69, 0.05)' }}>
                    <td className="px-3">{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                    <td className={`fw-bold ${tx.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toFixed(2)} €
                    </td>
                    <td>{tx.reference || '-'}</td>
                    <td>
                      {tx.type === 'INCOME' ? (
                        <button 
                          className={`btn btn-sm ${tx.status === 'PAID' ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => handleToggleStatus(tx.id)}
                        >
                          {tx.status === 'PAID' ? 'Payé' : 'En attente'}
                        </button>
                      ) : (
                        <span className="badge bg-secondary">Réglé</span>
                      )}
                    </td>
                    <td className="text-muted small" style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {tx.comment}
                    </td>
                    <td className="text-end px-3">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(tx.id)}>✏️ Modif.</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tx.id)}>❌ Suppr.</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-2">
      {view === 'HOME' && renderHome()}
      {view === 'SUMMARY' && renderSummary()}
      {view === 'YEARS_LIST' && renderYearsList()}
      {view === 'YEAR_DETAIL' && renderYearDetail()}
    </div>
  );
};

export default DashboardPage;
