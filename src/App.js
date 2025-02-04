// src/App.js
import React, { useState, useEffect, useRef } from "react";
import FormInput from "./components/FormInput";
import Tabs from "./components/Tabs";
import LivePreview from "./components/LivePreview";
import ControlFileForm from "./components/ControlFileForm";
import ExportModal from "./components/ExportModal";
import InstructionalLinks from "./components/InstructionalLinks";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

/**
 * 1. Embedded export CSS (with .prefiltered-search added).
 */
const EMBEDDED_EXPORT_CSS = `
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

.live-preview {
  font-family: 'Roboto', sans-serif;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 32px;
  line-height: 1.125;
  font-weight: 400;
  margin-bottom: 10px;
}

.description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.tab-content {
  margin-bottom: 20px;
}
.tab-title {
  font-size: 21px;
  font-weight: 600;
  margin-top: 0;
  color: #444;
}
.tab-description {
  color: #555;
  margin-bottom: 15px;
}

.group-container {
  border: 1px solid darkgray;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  background: #f9f9f9;
}
.group-title {
  font-size: 18px;
  margin-top: 0;
  color: #333;
}

.section-container {
  margin-left: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}
.section-container:last-child {
  border-bottom: none;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-bottom: 5px;
}
.section-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.links-container {
  margin-left: 20px;
}
.link-item {
  margin-bottom: 5px;
}
.link-item a {
  color: rgba(0, 81, 198, 1);
  text-decoration: none;
}
.link-item a:hover {
  text-decoration: underline;
}

/* Prefiltered search style */
.prefiltered-search {
  margin-top: 10px;
  font-style: italic;
  color: #444;
}
`;

/**
 * 2. Helper function to generate the FULL HTML for exporting,
 *    including inline <style> tags and all tabs/groups/sections/links,
 *    plus the "prefilteredSearchString" snippet.
 */
function generateExportedHTML(formData) {
  const render_result = (prefiltered_results) =>{
    let innerhtml = "<ul>"
    for (let i = 0; i < prefiltered_results.length; i++) {
      let prefiltered_result = prefiltered_results[i]
      const {
        document_type,
        description,
        title,
        link,
        release_date
    } = prefiltered_result;
    const li = `<li><a href= ${link}>${title}</a><p>Document Type: ${document_type}</p><p>Description: ${description}</p></li>`;
    innerhtml +=li +"<br><br>";
    }    
    innerhtml +="</ul>"
    return innerhtml
  };
  const tabsHtml = (formData.tabs || []).map((tab) => {
    const groupsHtml = (tab.groups || []).map((group) => {
      const sectionsHtml = (group.sections || []).map((section) => {
        // Build links HTML
        const linksHtml = (section.links || [])
          .map((link) => {
            const displayText = link.displayText || link.url || "Untitled Link";
            return `
              <div class="link-item">
                <a href="${link.url || "#"}" target="_blank" rel="noopener noreferrer">
                  ${displayText}
                </a>
              </div>
            `;
          })
          .join("");
          
                
        // Prefiltered search snippet
        const prefilteredSearchHtml = section.prefilteredSearchString
          ? `<div className='pre-filter-box .pagination' dangerouslySetInnerHTML={{ __html: render_result(section.prefilteredSearchResults) }}></div>`
          : "";

        return `
          <div class="section-container">
            <h4 class="section-title">${section.name || ""}</h4>
            <p class="section-description">${section.description || ""}</p>
            <div class="links-container">
              ${linksHtml}
            </div>
          <div className='pre-filter-box .pagination'>${render_result(section.prefilteredSearchResults)}</div>   
          </div>
        `;
      }).join("");

      return `
        <div class="group-container">
          <h3 class="group-title">${group.title || ""}</h3>
          ${sectionsHtml}
        </div>
      `;
    }).join("");

    return `
      <div class="tab-content">
        <h2 class="tab-title">${tab.title || ""}</h2>
        <p class="tab-description">${tab.description || ""}</p>
        ${groupsHtml}
      </div>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${formData.title || "Content Hub"}</title>
  <style>${EMBEDDED_EXPORT_CSS}</style>
</head>
<body>
  <div class="live-preview">
    <h1 class="title">${formData.title || ""}</h1>
    <p class="description">${formData.description || ""}</p>
    ${tabsHtml}
  </div>
</body>
</html>
`;
}

function App() {
  // =============== State ===============
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tabs: []
  });

  const [controlData, setControlData] = useState({
    originId: "",
    filePath: "",
    "ft:title": "",
    "ft:locale": "",
    "Document ID": "",
    "ft:clusterId": "",
    Revision: "",
    "ft:description": "",
    url: "",
    isLatest: "",
    Product: "",
    "Document Type": "",
    "Release Date": "",
    "ft:lastEdition": "",
    isNew: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem("contentHubData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.formData) setFormData(parsedData.formData);
      if (parsedData.controlData) setControlData(parsedData.controlData);
    }
  }, []);

  // =============== Handlers ===============
  const saveProgress = () => {
    const allData = { formData, controlData };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${formData.title || "content-hub"}_progress_${dateTime}.json`;
    saveAs(blob, fileName);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setFormData({
        title: "",
        description: "",
        tabs: []
      });
      setControlData({
        originId: "",
        filePath: "",
        "ft:title": "",
        "ft:locale": "",
        "Document ID": "",
        "ft:clusterId": "",
        Revision: "",
        "ft:description": "",
        url: "",
        isLatest: "",
        Product: "",
        "Document Type": "",
        "Release Date": "",
        "ft:lastEdition": "",
        isNew: ""
      });
      localStorage.removeItem("contentHubData");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
            alert("Progress loaded successfully!");
          } else {
            alert("Invalid file format. Please upload a valid progress file.");
          }
        } catch {
          alert("Error loading progress: Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleControlChange = (data) => {
    setControlData(data);
  };

  // =============== Export Functions ===============
  const exportToHTML = () => {
    const fullHtml = generateExportedHTML(formData);
    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    saveAs(blob, "content.html");
  };

  const exportToZIP = () => {
    const zip = new JSZip();

    // Generate the styled content.html
    const htmlContent = generateExportedHTML(formData);
    zip.file("content.html", htmlContent);

    // Generate metadata.xml
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<controlFile>
  <resources>
    <resource>
${Object.entries(controlData)
  .map(([key, value]) => `<meta key="${key}"><value>${value}</value></meta>`)
  .join("\n")}
    </resource>
  </resources>
</controlFile>`;

    zip.file("metadata.xml", xmlContent);

    // Finalize ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "content-hub.zip");
    });
  };

  const exportToXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<controlFile>
  <resources>
    <resource>
${Object.entries(controlData)
  .map(([key, value]) => `<meta key="${key}"><value>${value}</value></meta>`)
  .join("\n")}
    </resource>
  </resources>
</controlFile>`;

    const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
    saveAs(blob, "metadata.xml");
  };

  const handleExportToPortal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmExport = () => {
    setIsModalOpen(false);
    exportToZIP();
  };

  return (
    <div className="App">
      <div className="form-section">
        <InstructionalLinks />
        <FormInput formData={formData} onFormChange={setFormData} />
        <Tabs
          tabs={formData.tabs || []}
          onTabsChange={(tabs) => setFormData({ ...formData, tabs })}
        />
        <ControlFileForm controlData={controlData} onControlChange={setControlData} />
      </div>

      <div className="preview-section">
        <div className="button-container-top">
          <button onClick={saveProgress} className="save-button">
            Save Progress
          </button>
          <input
            type="file"
            onChange={loadProgress}
            className="upload-button"
            accept=".json"
            ref={fileInputRef}
          />
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
          <button onClick={exportToHTML} className="export-button">
            Export to HTML
          </button>
          <button onClick={exportToXML} className="export-button">
            Export to XML
          </button>
          <button onClick={handleExportToPortal} className="export-button">
            Export to Portal (ZIP)
          </button>
        </div>

        <h2>Live Preview</h2>
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
