import React from 'react';
import './ExportModal.css';

function ExportModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Export to Portal</h3>
        <p>
          You are about to export the HTML and XML files to a ZIP archive for the portal. Please ensure all information is correct before proceeding.
        </p>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-button confirm-button">
            Confirm Export
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
