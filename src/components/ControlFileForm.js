import React from 'react';

function ControlFileForm({ controlData, onControlChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onControlChange({
      ...controlData,
      [name]: value,
    });
  };

  return (
    <div className="control-file-form">
      <h3>Control File Metadata</h3>
      <div className="form-group">
        <label>Origin ID:</label>
        <input
          type="text"
          name="originId"
          value={controlData.originId}
          onChange={handleInputChange}
          placeholder="e.g., UG1730-en-us"
        />
      </div>
      <div className="form-group">
        <label>File Path:</label>
        <input
          type="text"
          name="filePath"
          value={controlData.filePath}
          onChange={handleInputChange}
          placeholder="e.g., ug1730-amd-cloud-graphics.html"
        />
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="ft:title"
          value={controlData['ft:title']}
          onChange={handleInputChange}
          placeholder="e.g., AMD Cloud Graphics"
        />
      </div>
      <div className="form-group">
        <label>Locale:</label>
        <input
          type="text"
          name="ft:locale"
          value={controlData['ft:locale']}
          onChange={handleInputChange}
          placeholder="e.g., en-US"
        />
      </div>
      <div className="form-group">
        <label>Document ID:</label>
        <input
          type="text"
          name="Document ID"
          value={controlData['Document ID']}
          onChange={handleInputChange}
          placeholder="e.g., UG1730"
        />
      </div>
      <div className="form-group">
        <label>Cluster ID:</label>
        <input
          type="text"
          name="ft:clusterId"
          value={controlData['ft:clusterId']}
          onChange={handleInputChange}
          placeholder="e.g., UG1730"
        />
      </div>
      <div className="form-group">
        <label>Revision:</label>
        <input
          type="text"
          name="Revision"
          value={controlData.Revision}
          onChange={handleInputChange}
          placeholder="e.g., English"
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="ft:description"
          value={controlData['ft:description']}
          onChange={handleInputChange}
          placeholder="e.g., This page includes technical documents for AMD Cloud Graphics products."
        />
      </div>
      <div className="form-group">
        <label>URL:</label>
        <input
          type="text"
          name="url"
          value={controlData.url}
          onChange={handleInputChange}
          placeholder="e.g., ug1730-amd-cloud-graphics"
        />
      </div>
      <div className="form-group">
        <label>Is Latest:</label>
        <input
          type="text"
          name="isLatest"
          value={controlData.isLatest}
          onChange={handleInputChange}
          placeholder="e.g., true"
        />
      </div>
      <div className="form-group">
        <label>Product:</label>
        <input
          type="text"
          name="Product"
          value={controlData.Product}
          onChange={handleInputChange}
          placeholder="e.g., GPU Accelerators & Cloud Graphics"
        />
      </div>
      <div className="form-group">
        <label>Document Type:</label>
        <input
          type="text"
          name="Document Type"
          value={controlData['Document Type']}
          onChange={handleInputChange}
          placeholder="e.g., Landing page"
        />
      </div>
      <div className="form-group">
        <label>Release Date:</label>
        <input
          type="date"
          name="Release Date"
          value={controlData['Release Date']}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Edition:</label>
        <input
          type="date"
          name="ft:lastEdition"
          value={controlData['ft:lastEdition']}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Is New:</label>
        <input
          type="text"
          name="isNew"
          value={controlData.isNew}
          onChange={handleInputChange}
          placeholder="e.g., true"
        />
      </div>
    </div>
  );
}

export default ControlFileForm;
