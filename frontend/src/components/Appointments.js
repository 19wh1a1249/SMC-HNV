import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const TIME_SLOTS = [
  { period: 'Morning', slots: ['08:00', '09:00', '10:00', '11:00'] },
  { period: 'Afternoon', slots: ['12:00', '13:00', '14:00', '15:00'] },
  { period: 'Evening', slots: ['16:00', '17:00', '18:00', '19:00'] }
];

function formatTime(t) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return (hr % 12 || 12) + ':' + m + ' ' + (hr < 12 ? 'AM' : 'PM');
}

function Appointments({ appointments, setAppointments }) {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const bookedOnDate = appointments.filter(a => a.date === date);

  const handleBook = async () => {
    if (!name || !date || !selectedTime) {
      alert('Please fill in client name, date and select a time slot.');
      return;
    }
    try {
      const res = await axios.post(`${API}/appointments`, {
        name, purpose, date, time: selectedTime, notes
      });
      setAppointments([...appointments, res.data]);
      setName(''); setPurpose(''); setDate('');
      setNotes(''); setSelectedTime('');
    } catch (err) {
      alert('Error booking appointment.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await axios.delete(`${API}/appointments/${id}`);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      alert('Error cancelling appointment.');
    }
  };

  const handleEdit = (a) => {
    setEditId(a.id);
    setEditData({ name: a.name, purpose: a.purpose, date: a.date, time: a.time, notes: a.notes });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API}/appointments/${editId}`, editData);
      setAppointments(appointments.map(a => a.id === editId ? { ...a, ...editData } : a));
      setEditId(null);
    } catch (err) {
      alert('Error updating appointment.');
    }
  };

  const sorted = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <div className="card">
        <div className="card-title">Add new appointment</div>
        <div className="form-row">
          <div className="form-group">
            <label>Client name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Smith" />
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Site inspection" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => { setDate(e.target.value); setSelectedTime(''); }} />
          </div>
          <div className="form-group">
            <label>Selected time</label>
            <input value={selectedTime ? formatTime(selectedTime) : ''} placeholder="Pick a slot below" readOnly style={{ background: '#f5f5f3', cursor: 'default' }} />
          </div>
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes..." />
        </div>

        <div className="slots-section">
          <div className="slots-label">Available time slots — pick one</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: '#5DCAA5' }}></div> Available</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#F09595' }}></div> Booked</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#185FA5' }}></div> Selected</div>
          </div>
          {!date ? (
            <div className="no-date-msg">Please select a date to see available time slots</div>
          ) : (
            TIME_SLOTS.map(period => (
              <div className="slots-period" key={period.period}>
                <div className="slots-period-title">{period.period}</div>
                <div className="slots-grid">
                  {period.slots.map(slot => {
                    const conflict = bookedOnDate.find(a => a.time && a.time.slice(0, 5) === slot);
                    const isSelected = selectedTime === slot;
                    let cls = 'slot';
                    if (conflict) cls += ' booked';
                    else if (isSelected) cls += ' selected';
                    else cls += ' available';
                    return (
                      <div key={slot} className={cls} onClick={() => !conflict && setSelectedTime(slot)}>
                        <div>{formatTime(slot)}</div>
                        <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>
                          {conflict ? conflict.name : isSelected ? 'Selected' : 'Available'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="btn-row" style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleBook}>Book appointment</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">All appointments</div>
        {sorted.length === 0 ? (
          <div className="empty">No appointments yet. Add one above!</div>
        ) : (
          sorted.map(a => (
            <div key={a.id}>
              {editId === a.id ? (
                <div style={{ padding: '12px 0', borderBottom: '1px solid #e0ddd6' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Client name</label>
                      <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Purpose</label>
                      <input value={editData.purpose} onChange={e => setEditData({ ...editData, purpose: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input type="time" value={editData.time} onChange={e => setEditData({ ...editData, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea value={editData.notes} onChange={e => setEditData({ ...editData, notes: e.target.value })} />
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-primary" onClick={handleSaveEdit}>Save changes</button>
                    <button className="btn" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="list-item">
                  <div className="item-info">
                    <div className="item-name">{a.name}{a.purpose ? ` — ${a.purpose}` : ''}</div>
                    <div className="item-meta">
                      {a.date ? new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ''} at {formatTime(a.time ? a.time.slice(0, 5) : '00:00')}
                      {a.notes ? ` · ${a.notes}` : ''}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-warning" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Cancel</button>
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

export default Appointments;