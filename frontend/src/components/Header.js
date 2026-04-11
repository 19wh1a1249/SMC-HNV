import React from 'react';

function Header({ appointments, invoices }) {
  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.date === today).length;
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.amount), 0);
  const pendingAmount = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + parseFloat(i.amount), 0);

  return (
    <div>
      <div className="header">
        <div className="logo">SMC</div>
        <div className="header-text">
          <h1>SMC-HNV</h1>
          <p>Appointments, calendar &amp; invoices</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Total appointments</div>
          <div className="stat-value blue">{appointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today's appointments</div>
          <div className="stat-value">{todayCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Paid invoices</div>
          <div className="stat-value green">${paidAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending dues</div>
          <div className="stat-value amber">${pendingAmount.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;