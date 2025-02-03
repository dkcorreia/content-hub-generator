import React, { useState, useEffect } from 'react';
import './ExportModal.css'; 
// You can create a dedicated CSS file if needed

function PrefilteredSearchModal({
  isOpen,
  onClose,
  onConfirm,
  defaultValue = '',
}) {
  const [searchString, setSearchString] = useState(defaultValue);

  // Sync local state if defaultValue changes while the modal is open
  useEffect(() => {
    setSearchString(defaultValue);
  }, [defaultValue]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(searchString);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '500px' }}>
        <h3>Prefiltered Search</h3>
        <p>
          Enter the prefiltered search string below. <br />
          (Use any instructions you want here.)
        </p>
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="e.g. productName:AMD AND docType:userguide"
          style={{ width: '90%', marginBottom: '1rem' }}
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button cancel-button">
            Cancel
          </button>git commit -a
          <button onClick={handleConfirm} className="modal-button confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrefilteredSearchModal;
