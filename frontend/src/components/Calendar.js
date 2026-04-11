import React, { useState } from 'react';

function Calendar({ appointments }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = today.toISOString().split('T')[0];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="card">
      <div className="nav-row">
        <button className="btn" onClick={prevMonth}>&#8592; Prev</button>
        <span style={{ fontSize: '15px', fontWeight: '600' }}>{months[calMonth]} {calYear}</span>
        <button className="btn" onClick={nextMonth}>Next &#8594;</button>
      </div>

      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="cal-header">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d, i) => {
          if (!d) return <div key={i}></div>;
          const dateStr = calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
          const apts = appointments.filter(a => a.date === dateStr);
          const isToday = dateStr === todayStr;
          return (
            <div key={i} className={`cal-day${apts.length ? ' has-apt' : ''}${isToday ? ' today' : ''}`}>
              <div className="cal-day-num">{d}</div>
              {apts.map((a, j) => <div key={j} className="cal-dot"></div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;