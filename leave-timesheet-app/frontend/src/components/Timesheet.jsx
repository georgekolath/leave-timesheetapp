import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import AlertPopup from './AlertPopup';
function Timesheet({ setAlertInfo, compOffData = {} }) {
  // compOffData: { day: hours } from leave management
  // eslint-disable-next-line no-unused-vars
  const lastAlertedDate = useRef(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
  const today = new Date();
  // Calculate reference date for the selected week
  const refDate = new Date(today);
  refDate.setDate(refDate.getDate() + weekOffset * 7);
  // Only 5 working days: Monday to Friday
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [billable, setBillable] = useState({}); // {day: hours}
  const [nonBillable, setNonBillable] = useState({}); // {day: hours}
  const [compOffState, setCompOffState] = useState({}); // for persisted comp off
  // Removed unused: loadedTimesheet, setLoadedTimesheet
  const [alertQueue, setAlertQueue] = useState([]); // missing days queue
  // eslint-disable-next-line no-unused-vars
  const [alertIndex, setAlertIndex] = useState(0); // current alert index
  // eslint-disable-next-line no-unused-vars
  const [showAlert, setShowAlert] = useState(false);
  // New state for leave-applied validation popup
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [leaveAlertMsg, setLeaveAlertMsg] = useState('');
  // New state for success message popup
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch timesheet data for the current week on mount
  useEffect(() => {
    // Removed auto-refresh/reset logic to allow user input to persist
  }, [refDate]);

  // Alert logic (unchanged, but now based on billable/nonBillable)
  // Remove automatic alert logic from useEffect
  // Alert logic now only triggered on submit

  // Call this when user responds to alert (Yes/No)
  // Track if submit is pending after alerts
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const nextAlert = async () => {
    setAlertIndex(idx => {
      const nextIdx = idx + 1;
      if (nextIdx < alertQueue.length) {
        setAlertInfo({ date: alertQueue[nextIdx] });
        return nextIdx;
      } else {
        setShowAlert(false);
        setAlertInfo(null);
        if (pendingSubmit) {
          handleSave().then(() => {
            alert('Timesheet submitted!');
            setPendingSubmit(false);
          });
        }
        return nextIdx;
      }
    });
  };


  const handleBillableChange = (day, value) => {
    // New validation: If comp off exists and user enters billable
    const compOffVal = compOffData[day] !== undefined ? compOffData[day] : compOffState[day];
    if (compOffVal && value !== '') {
      setLeaveAlertMsg('Seems like you have already applied for a leave.');
      setShowLeaveAlert(true);
      return;
    }
    // ...existing code...
    const num = value === '' ? '' : Number(value);
    setBillable(prev => ({ ...prev, [day]: num }));
  };
  const handleNonBillableChange = (day, value) => {
    // ...existing code...
    const num = value === '' ? '' : Number(value);
    setNonBillable(prev => ({ ...prev, [day]: num }));
  };

  const handleSave = async () => {
    // Persist timesheet data to backend
    const userId = 1; // Replace with actual user logic if needed
    // Use refDate for correct week context
    const mergedCompOff = { ...compOffState, ...compOffData };
    for (const day of daysOfWeek) {
      // Use current state only
      const billableVal = billable[day] !== undefined ? billable[day] : '';
      const nonBillableVal = nonBillable[day] !== undefined ? nonBillable[day] : '';
      const compOffVal = mergedCompOff[day] !== undefined ? mergedCompOff[day] : '';
      const entry = {
        userId,
        date: getDateForDay(day, refDate),
        billable: billableVal,
        nonBillable: nonBillableVal,
        compOff: compOffVal
      };
      await fetch('/api/timesheet/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }
    // Only show browser alert for save, not for submit
    // alert('Timesheet saved!');
    // Update compOffState after save
    setCompOffState(mergedCompOff);
  };
  const handleSubmit = async () => {
    // On submit, check for missing entries
    const mergedCompOff = { ...compOffState, ...compOffData };
    const missing = daysOfWeek.filter(day => {
      const hasCompOff = mergedCompOff[day];
      const billableVal = Number(billable[day]);
      const nonBillableVal = Number(nonBillable[day]);
      const hasBillable = !isNaN(billableVal) && billableVal > 0;
      const hasNonBillable = !isNaN(nonBillableVal) && nonBillableVal > 0;
      return !hasCompOff && !hasBillable && !hasNonBillable;
    });
    if (missing.length > 0) {
      setAlertQueue(missing);
      setAlertIndex(0);
      setShowAlert(true);
      setAlertInfo({ date: missing[0] });
      setPendingSubmit(true);
      return;
    }
    // If no missing entries, proceed to save/submit
    await handleSave();
    setShowSuccess(true);
  };

  // Helper to get week start (Monday)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return d;
  }
  // Helper to get date string for a given day name in current week
  function getDateForDay(dayName, refDate) {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const monday = getWeekStart(refDate);
    const idx = weekDays.indexOf(dayName);
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    return d.toISOString().slice(0, 10);
  }


  return (
    <div className="container-fluid" style={{ minHeight: '500px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Timesheet</h2>
        <div>
          <button className="btn btn-secondary me-2" onClick={() => setWeekOffset(weekOffset - 1)}>&lt; Previous Week</button>
          <button className="btn btn-secondary" onClick={() => setWeekOffset(weekOffset + 1)}>Next Week &gt;</button>
        </div>
      </div>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th></th>
            {daysOfWeek.map(day => (
              <th key={day}>
                {day}
                <span style={{ fontSize: '0.9em', color: '#888', marginLeft: 6 }}>
                  {(() => {
                    const iso = getDateForDay(day, refDate);
                    const d = new Date(iso);
                    const dayNum = String(d.getDate()).padStart(2, '0');
                    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
                    return `${dayNum}/${monthNum}`;
                  })()}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Billable</strong></td>
            {daysOfWeek.map(day => (
              <td key={day}>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  max={24}
                  value={billable[day] || ''}
                  onChange={e => handleBillableChange(day, e.target.value)}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Non-billable</strong></td>
            {daysOfWeek.map(day => (
              <td key={day}>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  max={24}
                  value={nonBillable[day] || ''}
                  onChange={e => handleNonBillableChange(day, e.target.value)}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>Comp Off</strong></td>
            {daysOfWeek.map(day => (
              <td key={day}>
                <input
                  type="number"
                  className="form-control"
                  value={(compOffData[day] !== undefined ? compOffData[day] : compOffState[day]) || ''}
                  readOnly
                  style={{ background: '#eee' }}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="mb-3 text-center">
        <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
        <button className="btn btn-primary me-2" onClick={handleSubmit}>Submit Timesheet</button>
      </div>
      {/* New leave-applied alert popup, does not affect existing alert logic */}
      {showLeaveAlert && (
        <AlertPopup
          message={leaveAlertMsg}
          onOk={() => setShowLeaveAlert(false)}
          onClose={() => setShowLeaveAlert(false)}
        />
      )}
      {/* New success message popup for timesheet submission */}
      {showSuccess && (
        <AlertPopup
          message="Timesheet submitted successfully."
          onOk={() => setShowSuccess(false)}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
export default Timesheet;