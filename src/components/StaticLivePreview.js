// StaticLivePreview.js
import React from 'react';
import './LivePreview.css'; // Reuse the same styles from your LivePreview

function StaticLivePreview({ formData }) {
  return (
    <div className="live-preview">
      {/* Removed the <h3 className="live-preview-title"> block 
          so "Live Preview" does NOT appear in the exported file
      */}

      <h1 className="title">{formData.title}</h1>
      <p className="description">{formData.description}</p>

      {formData.tabs.length > 0 && (
        <>
          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            {formData.tabs.map((tab, idx) => (
              <button
                key={idx}
                // Give the first tab "active" by default
                className={`tab-button ${idx === 0 ? 'active' : ''}`}
                data-tab-index={idx}
              >
                {tab.title || `Tab ${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Render ALL tabs at once; hide them by default except the first */}
          {formData.tabs.map((tab, idx) => (
            <div
              key={idx}
              id={`tab-content-${idx}`}
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
                              Keep local `src` for dev,
                              add `data-portal-src` for final server path.
                            */}
                            {link.type === 'zip' && (
                              <img
                                src="/icons/zip-icon.svg"
                                data-portal-src="/portal-asset/zip-icon"
                                alt="zip-icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'pdf' && (
                              <img
                                src="/icons/pdf-icon.svg"
                                data-portal-src="/portal-asset/pdf-icon"
                                alt="pdf-icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'html' && (
                              <img
                                src="/icons/html-icon.svg"
                                data-portal-src="/portal-asset/html-icon"
                                alt="html-icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'book-svg' && (
                              <img
                                src="/icons/book-icon.svg"
                                data-portal-src="/portal-asset/book-svg"
                                alt="book-svg"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'excel-icon' && (
                              <img
                                src="/icons/excel-icon.svg"
                                data-portal-src="/portal-asset/excel-icon"
                                alt="excel-icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'topic-icon' && (
                              <img
                                src="/icons/topic-icon.svg"
                                data-portal-src="/portal-asset/topic-icon"
                                alt="topic-icon"
                                className="link-icon"
                              />
                            )}
                            {link.type === 'txt-icon' && (
                              <img
                                src="/icons/txt-icon.svg"
                                data-portal-src="/portal-asset/txt-icon"
                                alt="txt-icon"
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

export default StaticLivePreview;
