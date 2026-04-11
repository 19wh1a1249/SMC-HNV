import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://smc-hnv-production.up.railway.app/api';

function Invoices({ invoices, setInvoices }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [due, setDue] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAdd = async () => {
    if (!name || !amount || !date) {
      alert('Please fill in client name, amount and date.');
      return;
    }
    try {
      const res = await axios.post(`${API}/invoices`, {
        name, amount: parseFloat(amount), date, due, desc, status: 'pending'
      });
      setInvoices([...invoices, res.data]);
      setName(''); setAmount(''); setDate('');
      setDue(''); setDesc('');
    } catch (err) {
      alert('Error adding invoice.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await axios.delete(`${API}/invoices/${id}`);
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (err) {
      alert('Error deleting invoice.');
    }
  };

  const handleMarkPaid = async (inv) => {
    try {
      await axios.put(`${API}/invoices/${inv.id}`, { ...inv, status: 'paid' });
      setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: 'paid' } : i));
    } catch (err) {
      alert('Error updating invoice.');
    }
  };

  const handleEdit = (inv) => {
    setEditId(inv.id);
    setEditData({
      name: inv.name,
      amount: inv.amount,
      date: inv.date,
      due: inv.due_date || '',
      desc: inv.description || '',
      status: inv.status
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API}/invoices/${editId}`, editData);
      setInvoices(invoices.map(i => i.id === editId ? {
        ...i,
        name: editData.name,
        amount: editData.amount,
        date: editData.date,
        due_date: editData.due,
        description: editData.desc,
        status: editData.status
      } : i));
      setEditId(null);
    } catch (err) {
      alert('Error updating invoice.');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">Add new invoice</div>
        <div className="form-row">
          <div className="form-group">
            <label>Client name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Smith" />
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Invoice date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Due date</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Foundation work - Phase 1" />
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>Add invoice</button>
      </div>

      <div className="card">
        <div className="card-title">Invoice tracker</div>
        {invoices.length === 0 ? (
          <div className="empty">No invoices yet. Add one above!</div>
        ) : (
          invoices.map(inv => (
            <div key={inv.id}>
              {editId === inv.id ? (
                <div style={{ padding: '12px 0', borderBottom: '1px solid #e0ddd6' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Client name</label>
                      <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Amount ($)</label>
                      <input type="number" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Invoice date</label>
                      <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Due date</label>
                      <input type="date" value={editData.due} onChange={e => setEditData({ ...editData, due: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input value={editData.desc} onChange={e => setEditData({ ...editData, desc: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-primary" onClick={handleSaveEdit}>Save changes</button>
                    <button className="btn" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="list-item">
                  <div className="item-info">
                    <div className="item-name">
                      {inv.name}
                      <span className={`badge badge-${inv.status}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </div>
                    <div className="item-meta">
                      {inv.description || ''} · Issued {inv.date ? new Date(inv.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      {inv.due_date ? ` · Due ${new Date(inv.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="invoice-amount">${parseFloat(inv.amount).toLocaleString()}</div>
                    <div className="item-actions">
                      <button className="btn btn-warning" onClick={() => handleEdit(inv)}>Edit</button>
                      {inv.status !== 'paid' && (
                        <button className="btn btn-success" onClick={() => handleMarkPaid(inv)}>Mark paid</button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(inv.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Invoices;