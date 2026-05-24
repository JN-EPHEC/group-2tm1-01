import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import '../../styles/DashboardPage.css';

type TransactionType = 'INCOME' | 'EXPENSE';
type TransactionStatus = 'PAID' | 'PENDING';

interface Transaction {
  id: string;
  year: number;
  month: number;
  type: TransactionType;
  date: string;
  amount: number;
  reference?: string;
  status: TransactionStatus;
  comment: string;
}

const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Navigation State from URL
  const view = (searchParams.get('view') as 'HOME' | 'SUMMARY' | 'YEARS_LIST' | 'YEAR_DETAIL') || 'HOME';
  const selectedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : null;
  const selectedMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!, 10) : null;

  // Helper pour l'URL
  const updateDashboardView = (
    newView: 'HOME' | 'SUMMARY' | 'YEARS_LIST' | 'YEAR_DETAIL',
    newYear?: number | null,
    newMonth?: number | null
  ) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', newView);
    
    if (newYear !== undefined) {
      if (newYear === null) newParams.delete('year');
      else newParams.set('year', newYear.toString());
    }
    
    if (newMonth !== undefined) {
      if (newMonth === null) newParams.delete('month');
      else newParams.set('month', newMonth.toString());
    }
    
    setSearchParams(newParams);
    setShowForm('NONE');
  };

  // Data State
  const [years, setYears] = useState<number[]>([2025, 2026]);
  const [newYearInput, setNewYearInput] = useState('');
  
  // Dashboard Chart State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showChart, setShowChart] = useState(false);
  
  // --- FETCH TRANSACTIONS API ---

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('https://m1-4.ephec-ti.be:5173/api/transactions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Mapping pour ajouter year et month depuis date
          const formattedTxs = data.map(tx => {
            const d = new Date(tx.date || new Date());
            return {
              ...tx,
              year: d.getFullYear(),
              month: d.getMonth() + 1,
              reference: tx.comment || '', // On utilise comment comme reference
            };
          });
          setTransactions(formattedTxs);
        }
      })
      .catch(err => console.error("Erreur de chargement des transactions", err));
  }, []);

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

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Objet envoyé à l'API (strictement les colonnes existantes dans la base de données)
    const newTxToSubmit = {
      type: showForm === 'INCOME' ? 'INCOME' : 'EXPENSE',
      date: formData.date,
      amount: parseFloat(formData.amount),
      status: showForm === 'INCOME' ? 'PENDING' : 'PAID',
      comment: formData.comment || formData.reference // On sauvegarde reference dans comment
    };

    try {
      const res = await fetch('https://m1-4.ephec-ti.be:5173/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTxToSubmit)
      });
      const savedTx = await res.json();
      
      // Adaptation pour l'état React interne
      const dateObj = new Date(savedTx.date || formData.date);
      const adaptedTx = {
        ...savedTx,
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        reference: savedTx.comment || formData.reference,
      };

      setTransactions([adaptedTx, ...transactions]);
      setShowForm('NONE');
      setFormData({ date: '', amount: '', reference: '', comment: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [showEditAlert, setShowEditAlert] = useState<boolean>(false);

  const handleDelete = (id: string) => {
    setTxToDelete(id);
  };

  const confirmDeleteTx = async () => {
    if (txToDelete) {
      try {
        await fetch(`https://m1-4.ephec-ti.be:5173/api/transactions/${txToDelete}`, { 
          method: 'DELETE',
          credentials: 'include'
        });
        setTransactions(transactions.filter(t => t.id !== txToDelete));
        setTxToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (_id: string) => {
    setShowEditAlert(true);
    setTimeout(() => setShowEditAlert(false), 3000);
  };

  const handleToggleStatus = async (id: string) => {
    const txToUpdate = transactions.find(t => t.id === id);
    if (!txToUpdate || txToUpdate.type !== 'INCOME') return;

    const newStatus = txToUpdate.status === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await fetch(`https://m1-4.ephec-ti.be:5173/api/transactions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      setTransactions(transactions.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  // --- CALCULS ---

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

  // --- VUES ---

  const renderHome = () => (
    <div className="text-center mt-5">
      <h2 className="mb-4">Bienvenue sur le tableau de bord</h2>
      <div className="d-flex justify-content-center gap-4">
        <button className="btn btn-primary btn-lg px-4 py-3 shadow-sm" onClick={() => updateDashboardView('SUMMARY')}>
          Tableau récapitulatif
        </button>
        <button className="btn btn-outline-primary btn-lg px-4 py-3 shadow-sm" onClick={() => updateDashboardView('YEARS_LIST')}>
          Gérer par années
        </button>
      </div>
    </div>
  );

  const renderSummary = () => {
    const filteredTxs = transactions.filter(t => {
      const txDate = new Date(t.date);
      if (startDate && txDate < new Date(startDate)) return false;
      if (endDate && txDate > new Date(endDate)) return false;
      return true;
    });

    const statsMap = new Map<string, { interval: string, income: number, expense: number }>();
    filteredTxs.forEach(t => {
      const interval = `${t.year}-${String(t.month).padStart(2, '0')}`;
      if (!statsMap.has(interval)) {
        statsMap.set(interval, { interval, income: 0, expense: 0 });
      }
      const current = statsMap.get(interval)!;
      if (t.type === 'INCOME') current.income += t.amount;
      if (t.type === 'EXPENSE') current.expense += t.amount;
    });
    
    const chartData = Array.from(statsMap.values()).map(d => ({
      ...d,
      total: d.income - d.expense
    })).sort((a, b) => a.interval.localeCompare(b.interval));

    const statsByYear = years.map(y => {
      const txs = filteredTxs.filter(t => t.year === y);
      const income = txs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const expense = txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      return { year: y, income, expense, balance: income - expense };
    });

    return (
      <div>
        <button className="btn btn-secondary mb-4" onClick={() => updateDashboardView('HOME')}>Retour Accueil</button>
        <h3 className="mb-4">Récapitulatif global</h3>

        <div className="card shadow-sm mb-4 bg-light border-0">
          <div className="card-body d-flex flex-wrap gap-3 align-items-end">
            <div>
              <label className="form-label text-muted small mb-1">Date de début</label>
              <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label text-muted small mb-1">Date de fin</label>
              <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div>
              <button 
                className={`btn ${showChart ? 'btn-outline-primary' : 'btn-primary'}`}
                onClick={() => setShowChart(!showChart)}
              >
                {showChart ? 'Cacher le graphique' : 'Voir le graphique'}
              </button>
            </div>
          </div>
        </div>
        
        {showChart && (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Flux Financiers</h5>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2a8821" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2a8821" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c02737" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c02737" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d1820c" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d1820c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="interval" axisLine={false} tickLine={false} dy={10} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="total" name="Bilan" stroke="#d1820c" strokeWidth={3} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="income" name="Revenus" stroke="#2a8821" strokeWidth={2} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" name="Dépenses" stroke="#c02737" strokeWidth={2} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover">
              <thead className="table-light">
                <tr><th>Année</th><th>Entrées</th><th>Sorties</th><th>Bilan</th></tr>
              </thead>
              <tbody>
                {statsByYear.map(stat => (
                  <tr key={stat.year}>
                    <td>{stat.year}</td>
                    <td className="text-success">+{stat.income.toFixed(2)} €</td>
                    <td className="text-danger">-{stat.expense.toFixed(2)} €</td>
                    <td className={stat.balance >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>{stat.balance.toFixed(2)} €</td>
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
      <button className="btn btn-secondary mb-4" onClick={() => updateDashboardView('HOME')}>Retour</button>
      <h3>Années Comptables</h3>
      <div className="row">
        <div className="col-md-8 d-flex flex-wrap gap-3">
          {years.map(y => (
            <button key={y} className="btn btn-lg btn-outline-dark px-5 py-4 fw-bold" onClick={() => updateDashboardView('YEAR_DETAIL', y)}>
              {y}
            </button>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Ajouter une année</h5>
            <form onSubmit={handleCreateYear} className="input-group">
              <input type="number" className="form-control" value={newYearInput} onChange={e => setNewYearInput(e.target.value)} required />
              <button className="btn btn-success" type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderYearDetail = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-secondary" onClick={() => updateDashboardView('YEARS_LIST', null)}>Retour</button>
        <h2>Gestion {selectedYear}</h2>
        <div className="bg-warning px-3 py-2 rounded fw-bold">Impayés : {unpaidTotal.toFixed(2)} €</div>
      </div>

      <div className="card shadow-sm mb-4 bg-light">
        <div className="card-body d-flex gap-3">
          <select className="form-select w-auto" value={selectedMonth || ''} onChange={e => updateDashboardView('YEAR_DETAIL', selectedYear, e.target.value ? parseInt(e.target.value, 10) : null)}>
            <option value="">Tous les mois</option>
            {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
          <input type="text" className="form-control" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button className="btn btn-success" onClick={() => setShowForm('INCOME')}>+ Entrée</button>
          <button className="btn btn-danger" onClick={() => setShowForm('EXPENSE')}>- Sortie</button>
        </div>
      </div>

      {showForm !== 'NONE' && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Nouveau {showForm === 'INCOME' ? 'Revenu' : 'Dépense'}</h5>
            <form onSubmit={handleAddTransaction} className="row g-3">
              <div className="col-md-3"><input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
              <div className="col-md-3"><input type="number" step="0.01" className="form-control" placeholder="Montant" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
              {showForm === 'INCOME' && <div className="col-md-3"><input type="text" className="form-control" placeholder="Référence" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} /></div>}
              <div className="col-md-3"><input type="text" className="form-control" placeholder="Commentaire" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} /></div>
              <div className="col-12 text-end">
                <button type="button" className="btn btn-link" onClick={() => setShowForm('NONE')}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive bg-white shadow-sm rounded">
        <table className="table table-hover m-0">
          <thead className="table-light">
            <tr><th>Date</th><th>Montant</th><th>Ref</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {currentYearTransactions.map(tx => (
              <tr key={tx.id} className={tx.type === 'INCOME' ? 'dashboard-row-income' : 'dashboard-row-expense'}>
                <td>{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                <td className={tx.type === 'INCOME' ? 'text-success fw-bold' : 'text-danger fw-bold'}>{tx.amount.toFixed(2)} €</td>
                <td>{tx.reference || '-'}</td>
                <td>
                  {tx.type === 'INCOME' ? (
                    <button className={`btn btn-sm ${tx.status === 'PAID' ? 'btn-success' : 'btn-warning'}`} onClick={() => handleToggleStatus(tx.id)}>
                      {tx.status === 'PAID' ? 'Payé' : 'En attente'}
                    </button>
                  ) : <span className="badge bg-secondary">Réglé</span>}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(tx.id)}>Modifier</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tx.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-2">
      {txToDelete && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Voulez-vous vraiment supprimer cet élément ?</span>
          <div>
            <button className="btn btn-danger btn-sm me-2" onClick={confirmDeleteTx}>Oui, supprimer</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setTxToDelete(null)}>Annuler</button>
          </div>
        </div>
      )}
      {showEditAlert && (
        <div className="alert alert-info">
          Mode édition (à implémenter en base).
        </div>
      )}
      {view === 'HOME' && renderHome()}
      {view === 'SUMMARY' && renderSummary()}
      {view === 'YEARS_LIST' && renderYearsList()}
      {view === 'YEAR_DETAIL' && renderYearDetail()}
    </div>
  );
};

export default DashboardPage;
