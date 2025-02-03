import React, { useState } from 'react';
import './LivePreview.css'; // Ensure this file contains necessary styles

function LivePreview({ formData }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="live-preview">
      <h3 className="live-preview-title">
        Live Preview 
        <span className="red-circle"></span>
      </h3>

      {/* Displaying Title and Description */}
      <h1 className="title">{formData.title}</h1>
      <p className="description">{formData.description}</p>

      {formData.tabs.length > 0 && (
        <>
          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            {formData.tabs.map((tab, tabIndex) => (
              <button
                key={tabIndex}
                className={`tab-button ${tabIndex === activeTabIndex ? 'active' : ''}`}
                onClick={() => setActiveTabIndex(tabIndex)}
              >
                {tab.title || `Tab ${tabIndex + 1}`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <h2 className="tab-title">{formData.tabs[activeTabIndex].title}</h2>
            {/* Display Tab Description */}
            {formData.tabs[activeTabIndex].description && (
              <p className="tab-description">{formData.tabs[activeTabIndex].description}</p>
            )}
            
            {/* Display Groups and Sections */}
            {formData.tabs[activeTabIndex].groups?.map((group, groupIndex) => (
              <div key={groupIndex} className="group-container">
                <h3 className="group-title">{group.title}</h3>
                
                {group.sections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="section-container">
                    <h4 className="section-title">{section.name}</h4>
                    <p className="section-description">{section.description}</p>
                    
                    <div className="links-container">
                      {section.links?.map((link, linkIndex) => (
                        <div key={linkIndex} className="link-item">
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
                        {link.type === 'book-svg' && (
                          <img
                            src="/icons/book-icon.svg"
                            alt="Book Icon"
                            className="link-icon"
                          />
                        )}
                        {link.type === 'excel-icon' && (
                          <img
                            src="/icons/excel-icon.svg"
                            alt="Excel Icon"
                            className="link-icon"
                          />
                        )}
                        {link.type === 'topic-icon' && (
                          <img
                            src="/icons/topic-icon.svg"
                            alt="Topic Icon"
                            className="link-icon"
                          />
                        )}
                        {link.type === 'txt-icon' && (
                          <img
                            src="/icons/txt-icon.svg"
                            alt="Text Icon"
                            className="link-icon"
                          />
                        )}
                        {/* Link text */}
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
        </>
      )}
    </div>
  );
}

export default LivePreview;
