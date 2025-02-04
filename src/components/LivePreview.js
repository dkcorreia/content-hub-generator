// src/components/LivePreview.js
import React, { useState } from 'react';
import './LivePreview.css'; // your existing styles



function LivePreview({ formData }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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
  return (
    <div className="live-preview">
      <h3 className="live-preview-title">
        Live Preview
        <span className="red-circle"></span>
      </h3>

      <h1 className="title">{formData.title}</h1>
      <p className="description">{formData.description}</p>

      {formData.tabs.length > 0 && (
        <>
          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            {formData.tabs.map((tab, tabIndex) => (
              <button
                key={tabIndex}
                className={`tab-button ${
                  tabIndex === activeTabIndex ? 'active' : ''
                }`}
                onClick={() => setActiveTabIndex(tabIndex)}
              >
                {tab.title || `Tab ${tabIndex + 1}`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <h2 className="tab-title">
              {formData.tabs[activeTabIndex].title}
            </h2>
            {formData.tabs[activeTabIndex].description && (
              <p className="tab-description">
                {formData.tabs[activeTabIndex].description}
              </p>
            )}

            {/* Groups */}
            {formData.tabs[activeTabIndex].groups?.map((group, groupIndex) => (
              <div key={groupIndex} className="group-container">
                <h3 className="group-title">{group.title}</h3>

                {/* Sections */}
                {group.sections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="section-container">
                    <h4 className="section-title">{section.name}</h4>
                    <p className="section-description">
                      {section.description}
                    </p>

                    {/* Links */}
                    <div className="links-container">
                      {section.links?.map((link, linkIndex) => (
                        <div key={linkIndex} className="link-item">
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
                    <div className='pre-filter-box .pagination' dangerouslySetInnerHTML={{ __html: render_result(section.prefilteredSearchResults) }}></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LivePreview;
