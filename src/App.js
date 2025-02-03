import React, { useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import FormInput from './components/FormInput';
import Tabs from './components/Tabs';
import LivePreview from './components/LivePreview';
import ControlFileForm from './components/ControlFileForm';
import ExportModal from './components/ExportModal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import InstructionalLinks from './components/InstructionalLinks';
import './App.css';

/** 
 * NEW: A static preview component that displays all tabs at once,
 * each in its own <div>, hidden by default except the first tab.
 * We'll use this ONLY for export, so the exported HTML has clickable tabs
 * without needing React.
 */
function StaticLivePreview({ formData }) {
  return (
    <div className="live-preview">
      {/* Removed the "Live Preview" heading so it won't appear in the exported file */}
      
      <h1 className="title">{formData.title}</h1>
      <p className="description">{formData.description}</p>

      {formData.tabs.length > 0 && (
        <>
          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            {formData.tabs.map((tab, idx) => (
              <button
                key={idx}
                className={`tab-button ${idx === 0 ? 'active' : ''}`} // Make first tab active
                data-tab-index={idx}
              >
                {tab.title || `Tab ${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Render ALL tabs; hide them by default except the first */}
          {formData.tabs.map((tab, idx) => (
            <div
              key={idx}
              id={`tab-content-${idx}`} // unique ID
              className="tab-content"
              style={{ display: idx === 0 ? 'block' : 'none' }}
            >
              <h2 className="tab-title">{tab.title}</h2>
              {tab.description && <p className="tab-description">{tab.description}</p>}

              {tab.groups?.map((group, groupIndex) => (
                <div key={groupIndex} className="group-container">
                  <h3 className="group-title">{group.title}</h3>

                  {group.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="section-container">
                      <h4 className="section-title">{section.name}</h4>
                      <p className="section-description">{section.description}</p>

                      <div className="links-container">
                        {section.links?.map((link, linkIndex) => (
                          <div key={linkIndex} className="link-item">
                            {/* 
                              If you have additional link types (book-svg, excel-icon, etc.),
                              replicate them here just like in LivePreview.js
                            */}
                            {link.type === 'zip' && (
                              <img
                                src="/icons/zip-icon.svg"
                                alt="ZIP Icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'pdf' && (
                              <img
                                src="/icons/pdf-icon.svg"
                                alt="PDF Icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'html' && (
                              <img
                                src="/icons/html-icon.svg"
                                alt="HTML Icon"
                                className="link-icon"
                              />
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-url"
                            >
                              {link.displayText || link.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/** 
 * Main App component 
 */
function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tabs: [],
  });

  const [controlData, setControlData] = useState({
    originId: "",
    filePath: "",
    'ft:title': "",
    'ft:locale': "",
    'Document ID': "",
    'ft:clusterId': "",
    Revision: "",
    'ft:description': "",
    url: "",
    isLatest: "",
    Product: "",
    'Document Type': "",
    'Release Date': "",
    'ft:lastEdition': "",
    isNew: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ---------------------------------------------------------
  // 1) Load saved data from localStorage on mount
  // ---------------------------------------------------------
  useEffect(() => {
    const savedData = localStorage.getItem('contentHubData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.formData) setFormData(parsedData.formData);
      if (parsedData.controlData) setControlData(parsedData.controlData);
    }
  }, []);

  // ---------------------------------------------------------
  // 2) Handlers for form changes
  // ---------------------------------------------------------
  const handleFormChange = (data) => setFormData(data);
  const handleControlChange = (data) => setControlData(data);

  // ---------------------------------------------------------
  // 3) Save & Load Progress
  // ---------------------------------------------------------
  const saveProgress = () => {
    const allData = { formData, controlData };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const dateTime = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${formData.title || 'content-hub'}_progress_${dateTime}.json`;
    saveAs(blob, fileName);
  };

  const loadProgress = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          if (loadedData.formData && loadedData.controlData) {
            setFormData(loadedData.formData);
            setControlData(loadedData.controlData);
            alert('Progress loaded successfully!');
          } else {
            alert('Invalid file format. Please upload a valid progress file.');
          }
        } catch {
          alert('Error loading progress: Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // ---------------------------------------------------------
  // 4) Reset Progress
  // ---------------------------------------------------------
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      setFormData({
        title: "",
        description: "",
        tabs: [],
      });
      setControlData({
        originId: "",
        filePath: "",
        'ft:title': "",
        'ft:locale': "",
        'Document ID': "",
        'ft:clusterId': "",
        Revision: "",
        'ft:description': "",
        url: "",
        isLatest: "",
        Product: "",
        'Document Type': "",
        'Release Date': "",
        'ft:lastEdition': "",
        isNew: ""
      });
      localStorage.removeItem('contentHubData');
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ---------------------------------------------------------
  // 5) Export: Confirm Modal (for ZIP)
  // ---------------------------------------------------------
  const handleExportToPortal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmExport = () => {
    setIsModalOpen(false);
    exportToZIP();
  };

  // ---------------------------------------------------------
  // 6) Combined CSS from App.css, Tabs.css, LivePreview.css
  // ---------------------------------------------------------
  const combinedCSS = `
    /* START: App.css */
    .App {
      display: flex;
      flex-direction: row;
      gap: 20px;
      padding: 20px;
      font-family: 'Roboto', sans-serif;
    }
    .form-section {
      width: 40%;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .preview-section {
      width: 55%;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }
    input[type="text"],
    textarea {
      width: 95%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: 'Roboto', sans-serif;
    }
    button {
      background: #007bff;
      color: #ffffff;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 10px;
      font-family: 'Roboto', sans-serif;
    }
    button:hover {
      background: #0056b3;
    }
    button.save-button {
      background: #28a745;
    }
    button.reset-button {
      background: #dc3545;
    }
    button.save-button:hover {
      background: #218838;
    }
    button.reset-button:hover {
      background: #c82333;
    }
    h1, h2, h3, h4, h5 {
      margin-bottom: 10px;
      font-family: 'Roboto', sans-serif;
      margin-top: 50px;
    }
    h1 {
      font-size: 32px;
      line-height: 1.125;
      font-weight: 600;
    }
    h2 {
      font-size: 21px;
      line-height: 1.19;
      font-weight: 600;
    }
    .link, a {
      text-decoration: none;
      color: #06c;
    }
    .docs-link {
      font-size: 17px;
      line-height: 1.47;
      font-weight: 400;
      padding: 0 .7em 0 0;
      color: #06c;
    }
    .button-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    .button-container-top {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-bottom: 10px;
    }
    .button-container button,
    .button-container input[type="file"],
    .button-container-top button,
    .button-container-top input[type="file"] {
      margin: 0;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .preview-tabs-navigation {
      display: flex;
      border-bottom: 2px solid #bbb;
      margin-bottom: 20px;
    }
    .preview-tab {
      font-family: 'Arial', sans-serif;
      padding: 8px 16px;
      cursor: default;
      border: none;
      background: #f5f5f5;
      color: #555;
    }
    .preview-tab.active {
      background: #2e2e2e;
      color: #fff;
    }
    .preview-tab:hover {
      background: #3c3c3c;
    }
    /* END: App.css */

    /* START: Tabs.css */
    .tabs-navigation {
      display: flex;
      border-bottom: 2px solid #ccc;
      margin-bottom: 20px;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 5px;
      scrollbar-width: thin;
      scrollbar-color: #bbb #f2f2f2;
    }
    .tabs-navigation::-webkit-scrollbar {
      height: 8px;
    }
    .tabs-navigation::-webkit-scrollbar-thumb {
      background: #bbb;
      border-radius: 4px;
      border: 2px solid #f2f2f2;
    }
    .tabs-navigation::-webkit-scrollbar-thumb:hover {
      background: #999;
    }
    .tabs-navigation::-webkit-scrollbar-track {
      background: #f2f2f2;
    }
    .tab-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-right: 10px;
      position: relative;
    }
    .tab-button {
      font-family: 'Roboto', sans-serif;
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background: #d3d3d3;
      transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
      color: #333;
      margin-top: 5px;
      margin-bottom: 3px;
    }
    .tab-button.active {
      background: #4a4a4a;
      color: #fff;
      font-weight: bold;
    }
    .tab-button:hover {
      background: #707070;
      color: #fff;
    }
    .tab-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
      margin-right: 4px;
    }
    .remove-tab-button,
    .move-left-button,
    .move-right-button {
      background-color: #d3d3d3;
      border: none;
      cursor: pointer;
      font-size: 12px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      padding: 0;
    }
    .remove-tab-button:hover {
      background-color: #e06666;
      color: white;
    }
    .move-left-button:hover,
    .move-right-button:hover {
      background-color: #6aa84f;
      color: white;
    }
    .remove-tab-button::before {
      content: "✖";
      font-size: 14px;
      color: inherit;
    }
    .move-left-button::before {
      content: "◀";
      font-size: 12px;
    }
    .move-right-button::before {
      content: "▶";
      font-size: 12px;
    }
    .group-container {
      border: 1px solid gray;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
      background: #f9f9f9;
    }
    .group-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
      margin-bottom: 10px;
    }
    .move-up-button,
    .move-down-button,
    .remove-group-button {
      background-color: #d3d3d3;
      border: none;
      cursor: pointer;
      font-size: 12px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      padding: 0;
    }
    .move-up-button:hover,
    .move-down-button:hover {
      background-color: #6aa84f;
      color: white;
    }
    .remove-group-button:hover {
      background-color: #e06666;
      color: white;
    }
    .move-up-button::before {
      content: "▲";
      font-size: 12px;
    }
    .move-down-button::before {
      content: "▼";
      font-size: 12px;
    }
    .remove-group-button::before {
      content: "✖";
      font-size: 14px;
      color: inherit;
    }
    .section-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
      margin-bottom: 10px;
    }
    .move-up-button,
    .move-down-button,
    .remove-section-button {
      background-color: #d3d3d3;
      border: none;
      cursor: pointer;
      font-size: 12px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      padding: 0;
    }
    .remove-section-button:hover {
      background-color: #e06666;
      color: white;
    }
    .remove-section-button::before {
      content: "✖";
      font-size: 14px;
      color: inherit;
    }
    .active-tab {
      border-left: 0px solid #4a4a4a;
      padding-left: 0px;
    }
    .link-actions {
      display: flex;
      gap: 5px;
      margin-top: 5px;
    }
    .move-up-button,
    .move-down-button,
    .remove-link-button {
      background-color: #d3d3d3;
      border: none;
      cursor: pointer;
      font-size: 12px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      padding: 0;
    }
    .move-up-button:hover,
    .move-down-button:hover {
      background-color: #6aa84f;
      color: white;
    }
    .remove-link-button:hover {
      background-color: #e06666;
      color: white;
    }
    .move-up-button:before {
      content: "▲";
      font-size: 12px;
    }
    .move-down-button:before {
      content: "▼";
      font-size: 12px;
    }
    .remove-link-button:before {
      content: "✖";
      font-size: 14px;
    }
    /* END: Tabs.css */

    /* START: LivePreview.css */
    .live-preview {
      font-family: 'Roboto', sans-serif;
      border: 1px solid #ccc;
      padding: 20px;
      margin-top: 20px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .tabs-navigation {
      margin-bottom: 15px;
    }
    .tab-button {
      margin-right: 5px;
      padding: 8px 15px;
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      margin-top: 25px;
    }
    .tab-content {
      border: none;
    }
    .tab-content h2 {
      margin-top: 0;
      color: #444;
    }
    .tab-content h3 {
      color: #555;
      margin-bottom: 10px;
    }
    .tab-content p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    .title {
      font-size: 32px;
      line-height: 1.125;
      font-weight: 400;
      letter-spacing: .004em;
      font-family: 'Roboto', sans-serif;
    }
    .tab-title {
      font-size: 21px;
      line-height: 1.19048;
      font-weight: 600;
      letter-spacing: 0.011em;
      font-family: 'Roboto', sans-serif;
    }
    a,
    .link:link,
    .link:visited {
      text-decoration: none;
      color: #06c;
    }
    .docs-link {
      font-size: 17px;
      line-height: 1.47059;
      font-weight: 400;
      letter-spacing: -.022em;
      font-family: 'Roboto', sans-serif;
      display: inline-block;
      padding: 0 .7em 0 0;
    }
    .live-preview-title {
      color: red;
      display: inline-flex;
      align-items: center;
    }
    .red-circle {
      width: 15px;
      height: 15px;
      background-color: red;
      border-radius: 50%;
      margin-left: 10px;
    }
    .group-container {
      border: 1px solid darkgray;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 2px;
    }
    .live-preview a {
      color: rgba(0, 81, 198, 1);
      text-decoration: none;
    }
    .live-preview a:hover {
      text-decoration: underline;
    }
    .live-preview a:visited {
      color: rgba(0, 81, 198, 1);
    }
    /* END: LivePreview.css */
  `;

  // ---------------------------------------------------------
  // 7) A small vanilla JS script so tabs are clickable
  //    in the exported static HTML
  // ---------------------------------------------------------
  const tabToggleScript = `
  (function() {
    const tabButtons = document.querySelectorAll('.tabs-navigation .tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const idx = button.getAttribute('data-tab-index');
  
        // Remove 'active' from all tab buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add 'active' to clicked button
        button.classList.add('active');
  
        // Hide all .tab-content
        document.querySelectorAll('.tab-content').forEach(div => {
          div.style.display = 'none';
        });
  
        // Show only the clicked tab
        const target = document.getElementById('tab-content-' + idx);
        if (target) {
          target.style.display = 'block';
        }
      });
    });
  })();
  `;
  
    // ---------------------------------------------------------
    // 8) Export to HTML (uses <StaticLivePreview>)
    // ---------------------------------------------------------
    const exportToHTML = () => {
      const staticPreview = ReactDOMServer.renderToStaticMarkup(
        <StaticLivePreview formData={formData} />
      );
  
      const finalHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${formData.title}</title>
        <style>
         body {
           max-width: 1200px;
           margin: 0 auto;
         }
          ${combinedCSS}
        </style>
      </head>
      <body>
        ${staticPreview}
        <script>${tabToggleScript}</script>
      </body>
      </html>
    `;
    
  
      const blob = new Blob([finalHTML], { type: "text/html;charset=utf-8" });
      saveAs(blob, "content.html");
    };
  
    // ---------------------------------------------------------
    // 9) Export to ZIP (uses <StaticLivePreview>)
    // ---------------------------------------------------------
    const exportToZIP = () => {
      const zip = new JSZip();
  
      const staticPreview = ReactDOMServer.renderToStaticMarkup(
        <StaticLivePreview formData={formData} />
      );
  
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${formData.title}</title>
        <style>
    +     body {
    +       max-width: 1200px;
    +       margin: 0 auto;
    +     }
          ${combinedCSS}
        </style>
      </head>
      <body>
        ${staticPreview}
        <script>${tabToggleScript}</script>
      </body>
      </html>
    `;
    
  
      zip.file("content.html", htmlContent);
  
      // Build metadata.xml from controlData
      const xmlContent = `
        <?xml version="1.0" encoding="UTF-8"?>
        <controlFile>
          <resources>
            <resource>
              ${Object.entries(controlData).map(
                ([key, value]) => `<meta key="${key}"><value>${value}</value></meta>`
              ).join("\n")}
            </resource>
          </resources>
        </controlFile>
      `;
      zip.file("metadata.xml", xmlContent);
  
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "content-hub.zip");
      });
    };
  
    // ---------------------------------------------------------
    // 10) Export to XML (unchanged)
    // ---------------------------------------------------------
    const exportToXML = () => {
      const xmlContent = `
        <?xml version="1.0" encoding="UTF-8"?>
        <controlFile>
          <resources>
            <resource>
              ${Object.entries(controlData).map(
                ([key, value]) => `<meta key="${key}"><value>${value}</value></meta>`
              ).join("\n")}
            </resource>
          </resources>
        </controlFile>
      `;
      const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
      saveAs(blob, "metadata.xml");
    };
  
    // ---------------------------------------------------------
    // 11) Render the App
    // ---------------------------------------------------------
    return (
      <div className="App">
        <div className="form-section">
          <InstructionalLinks />
  
          <FormInput 
  formData={formData}
  onFormChange={handleFormChange}
/>
  
          <Tabs
            tabs={formData.tabs || []}
            onTabsChange={(tabs) => setFormData({ ...formData, tabs })}
          />
  
  <ControlFileForm
  controlData={controlData}
  onControlChange={handleControlChange}
/>
        </div>
  
        <div className="preview-section">
          <div className="button-container-top">
            <button onClick={saveProgress} className="save-button">Save Progress</button>
            <input
              type="file"
              onChange={loadProgress}
              className="upload-button"
              accept=".json"
              ref={fileInputRef}
            />
            <button onClick={handleReset} className="reset-button">Reset</button>
            {/* Export buttons */}
            <button onClick={exportToHTML} className="export-button">Export to HTML</button>
            <button onClick={exportToXML} className="export-button">Export to XML</button>
            <button onClick={handleExportToPortal} className="export-button">Export to Portal (ZIP)</button>
          </div>
  
          <h2>Live Preview</h2>
          {/* 
            Locally, we show <LivePreview> with React state for the "active tab."
            The static version is only used for exports (HTML/ZIP).
          */}
          <LivePreview formData={formData} />
        </div>
  
        <ExportModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmExport}
        />
      </div>
    );
  }
  
  export default App;