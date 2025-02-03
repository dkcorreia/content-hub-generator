// src/components/InstructionalLinks.js
import React from 'react';

function InstructionalLinks() {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="instructionalLinks">Instructional Links: </label>
      <select id="instructionalLinks" style={{ marginLeft: '10px', padding: '5px' }}>
        <option value="">-- Select a Link --</option>
        <option value="https://docs.amd.com/p/ug1720-ai-engine-landing">AI Engine Landing Page Documentation</option>
        <option value="https://docs.amd.com/help/contenthub">Content Hub Generator Help Guide</option>
        <option value="https://docs.amd.com/standards/guidelines">Content Formatting Guidelines</option>
      </select>
    </div>
  );
}

export default InstructionalLinks;
