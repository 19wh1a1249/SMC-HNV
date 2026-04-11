import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Appointments from './components/Appointments';
import Invoices from './components/Invoices';
import Calendar from './components/Calendar';

const API = 'https://smc-hnv-production.up.railway.app/api';

function App() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get(`${API}/appointments`).then(res => setAppointments(res.data)).catch(console.error);
    axios.get(`${API}/invoices`).then(res => setInvoices(res.data)).catch(console.error);
  }, []);

  return (
    <div className="app">
      <Header appointments={appointments} invoices={invoices} />

      <div className="tabs">
        <button className={`tab${activeTab === 'appointments' ? ' active' : ''}`} onClick={() => setActiveTab('appointments')}>Appointments</button>
        <button className={`tab${activeTab === 'calendar' ? ' active' : ''}`} onClick={() => setActiveTab('calendar')}>Calendar</button>
        <button className={`tab${activeTab === 'invoices' ? ' active' : ''}`} onClick={() => setActiveTab('invoices')}>Invoices</button>
      </div>

      {activeTab === 'appointments' && <Appointments appointments={appointments} setAppointments={setAppointments} />}
      {activeTab === 'calendar' && <Calendar appointments={appointments} />}
      {activeTab === 'invoices' && <Invoices invoices={invoices} setInvoices={setInvoices} />}
    </div>
  );
}

export default App;