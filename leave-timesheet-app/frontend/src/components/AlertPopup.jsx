import React, { useEffect, useRef } from 'react';

function AlertPopup({ date, message, onNo, onYes, onOk, onClose }) {
  const popupRef = useRef(null);
  // Only auto-close if no button handlers are provided
  useEffect(() => {
    if (!onOk && !onNo && !onYes) {
      const timer = setTimeout(onClose, 15000);
      if (popupRef.current) {
        popupRef.current.focus();
      }
      return () => clearTimeout(timer);
    } else {
      if (popupRef.current) {
        popupRef.current.focus();
      }
    }
  }, [onClose, onOk, onNo, onYes]);

  return (
    <>
      {/* Backdrop overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 999
      }} />
      {/* Popup */}
      <div
        ref={popupRef}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          background: '#fff',
          border: '1px solid #333',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          padding: '32px 24px',
          minWidth: '340px',
          zIndex: 1000,
          textAlign: 'center'
        }}
      >
        <p style={{ fontWeight: 500, marginBottom: 24 }}>
          {message ? message : <>Seems like you have missed to enter your time for {date}. Were you on leave that day?</>}
        </p>
        <div className="d-flex justify-content-center gap-3">
          {message && onOk ? (
            <button className="btn btn-primary" onClick={onOk}>OK</button>
          ) : (
            <>
              <button className="btn btn-success" onClick={onYes}>Yes</button>
              <button className="btn btn-danger" onClick={onNo}>No</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AlertPopup;