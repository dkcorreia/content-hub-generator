import React, { useState } from 'react';
import './Tabs.css'; // Ensure this file contains the necessary styles

function Tabs({ tabs, onTabsChange }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Tab Handlers
  const handleTabTitleChange = (index, newTitle) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].title = newTitle;
    onTabsChange(updatedTabs);
  };

  const handleTabDescriptionChange = (index, newDescription) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].description = newDescription;
    onTabsChange(updatedTabs);
  };

  const handleRemoveTab = (index) => {
    if (window.confirm('Are you sure you want to delete this tab?')) {
      const updatedTabs = tabs.filter((_, tabIndex) => tabIndex !== index);
      onTabsChange(updatedTabs);
      setActiveTabIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleMoveLeft = (index) => {
    if (index > 0) {
      const updatedTabs = [...tabs];
      [updatedTabs[index - 1], updatedTabs[index]] = [updatedTabs[index], updatedTabs[index - 1]];
      onTabsChange(updatedTabs);
      setActiveTabIndex(index - 1);
    }
  };

  const handleMoveRight = (index) => {
    if (index < tabs.length - 1) {
      const updatedTabs = [...tabs];
      [updatedTabs[index + 1], updatedTabs[index]] = [updatedTabs[index], updatedTabs[index + 1]];
      onTabsChange(updatedTabs);
      setActiveTabIndex(index + 1);
    }
  };

  // Group Handlers
  const handleAddGroup = (tabIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups = updatedTabs[tabIndex].groups || [];
    updatedTabs[tabIndex].groups.push({ title: '', sections: [] });
    onTabsChange(updatedTabs);
  };

  const handleGroupTitleChange = (tabIndex, groupIndex, newTitle) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups[groupIndex].title = newTitle;
    onTabsChange(updatedTabs);
  };

  const handleRemoveGroup = (tabIndex, groupIndex) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      const updatedTabs = [...tabs];
      updatedTabs[tabIndex].groups.splice(groupIndex, 1);
      onTabsChange(updatedTabs);
    }
  };

  const handleMoveGroupUp = (tabIndex, groupIndex) => {
    if (groupIndex > 0) {
      const updatedTabs = [...tabs];
      const groups = updatedTabs[tabIndex].groups;
      [groups[groupIndex - 1], groups[groupIndex]] = [groups[groupIndex], groups[groupIndex - 1]];
      onTabsChange(updatedTabs);
    }
  };

  const handleMoveGroupDown = (tabIndex, groupIndex) => {
    const groups = tabs[tabIndex].groups;
    if (groupIndex < groups.length - 1) {
      const updatedTabs = [...tabs];
      [groups[groupIndex + 1], groups[groupIndex]] = [groups[groupIndex], groups[groupIndex + 1]];
      onTabsChange(updatedTabs);
    }
  };

  // Section Handlers
  const handleAddSection = (tabIndex, groupIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups[groupIndex].sections.push({ name: '', links: [] });
    onTabsChange(updatedTabs);
  };

  const handleSectionChange = (tabIndex, groupIndex, sectionIndex, newSection) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex] = newSection;
    onTabsChange(updatedTabs);
  };

  const handleRemoveSection = (tabIndex, groupIndex, sectionIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups[groupIndex].sections.splice(sectionIndex, 1);
    onTabsChange(updatedTabs);
  };

  const handleMoveSectionUp = (tabIndex, groupIndex, sectionIndex) => {
    if (sectionIndex > 0) {
      const updatedTabs = [...tabs];
      const sections = updatedTabs[tabIndex].groups[groupIndex].sections;
      [sections[sectionIndex - 1], sections[sectionIndex]] = [
        sections[sectionIndex],
        sections[sectionIndex - 1],
      ];
      onTabsChange(updatedTabs);
    }
  };

  const handleMoveSectionDown = (tabIndex, groupIndex, sectionIndex) => {
    const sections = tabs[tabIndex].groups[groupIndex].sections;
    if (sectionIndex < sections.length - 1) {
      const updatedTabs = [...tabs];
      [sections[sectionIndex + 1], sections[sectionIndex]] = [
        sections[sectionIndex],
        sections[sectionIndex + 1],
      ];
      onTabsChange(updatedTabs);
    }
  };

  // Link Handlers
  const handleAddLink = (tabIndex, groupIndex, sectionIndex) => {
    const updatedTabs = [...tabs];
    const section = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex];
    section.links.push({ type: '', url: '', displayText: '' });
    onTabsChange(updatedTabs);
  };

  const handleLinkChange = (tabIndex, groupIndex, sectionIndex, linkIndex, field, value) => {
    const updatedTabs = [...tabs];
    const section = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex];
    section.links[linkIndex] = {
      ...section.links[linkIndex],
      [field]: value,
    };
    onTabsChange(updatedTabs);
  };

  const handleMoveLinkUp = (tabIndex, groupIndex, sectionIndex, linkIndex) => {
    if (linkIndex > 0) {
      const updatedTabs = [...tabs];
      const links = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex].links;
      [links[linkIndex - 1], links[linkIndex]] = [links[linkIndex], links[linkIndex - 1]];
      onTabsChange(updatedTabs);
    }
  };
  
  const handleMoveLinkDown = (tabIndex, groupIndex, sectionIndex, linkIndex) => {
    const links = tabs[tabIndex].groups[groupIndex].sections[sectionIndex].links;
    if (linkIndex < links.length - 1) {
      const updatedTabs = [...tabs];
      [links[linkIndex + 1], links[linkIndex]] = [links[linkIndex], links[linkIndex + 1]];
      onTabsChange(updatedTabs);
    }
  };
  
  const handleRemoveLink = (tabIndex, groupIndex, sectionIndex, linkIndex) => {
    const updatedTabs = [...tabs];
    const links = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex].links;
    links.splice(linkIndex, 1);
    onTabsChange(updatedTabs);
  };
  

  return (
    <div>
      <h3>Tabs</h3>
      <div className="tabs-navigation">
        {tabs.map((tab, tabIndex) => (
          <div
            key={tabIndex}
            className={`tab-container ${tabIndex === activeTabIndex ? 'active-tab' : ''}`}
          >
            <button
              className={`tab-button ${tabIndex === activeTabIndex ? 'active' : ''}`}
              onClick={() => setActiveTabIndex(tabIndex)}
            >
              {tab.title || `Tab ${tabIndex + 1}`}
            </button>
            <div className="tab-actions">
              <button
                className="move-left-button"
                onClick={() => handleMoveLeft(tabIndex)}
                title="Move Tab Left"
              >
                
              </button>
              <button
                className="move-right-button"
                onClick={() => handleMoveRight(tabIndex)}
                title="Move Tab Right"
              >
                
              </button>
              <button
                className="remove-tab-button"
                onClick={() => handleRemoveTab(tabIndex)}
                title="Remove Tab"
              >
                
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="tab-content">
        {tabs.length > 0 && tabs[activeTabIndex] && (
          <div>
            <input
              type="text"
              value={tabs[activeTabIndex].title}
              placeholder="Tab Title"
              onChange={(e) => handleTabTitleChange(activeTabIndex, e.target.value)}
            />
            <textarea
              value={tabs[activeTabIndex].description || ''}
              placeholder="Tab Description"
              onChange={(e) => handleTabDescriptionChange(activeTabIndex, e.target.value)}
            />
            <button onClick={() => handleAddGroup(activeTabIndex)}>Add Group</button>
            {tabs[activeTabIndex].groups?.map((group, groupIndex) => (
              <div key={groupIndex} className="group-container">
                <input
                  type="text"
                  value={group.title}
                  placeholder="Group Title"
                  onChange={(e) => handleGroupTitleChange(activeTabIndex, groupIndex, e.target.value)}
                />
                <div className="group-actions">
                  <button
                    className="move-up-button"
                    onClick={() => handleMoveGroupUp(activeTabIndex, groupIndex)}
                    title="Move Group Up"
                  >
                    
                  </button>
                  <button
                    className="move-down-button"
                    onClick={() => handleMoveGroupDown(activeTabIndex, groupIndex)}
                    title="Move Group Down"
                  >
                    
                  </button>
                  <button
                    className="remove-group-button"
                    onClick={() => handleRemoveGroup(activeTabIndex, groupIndex)}
                    title="Remove Group"
                  >
                    
                  </button>
                </div>
                <button onClick={() => handleAddSection(activeTabIndex, groupIndex)}>
                  Add Section
                </button>
                {group.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="section-container">
                    <input
                      type="text"
                      value={section.name}
                      placeholder="Section Name"
                      onChange={(e) =>
                        handleSectionChange(activeTabIndex, groupIndex, sectionIndex, {
                          ...section,
                          name: e.target.value,
                        })
                      }
                    />
                    <div className="section-actions">
                      <button
                        className="move-up-button"
                        onClick={() =>
                          handleMoveSectionUp(activeTabIndex, groupIndex, sectionIndex)
                        }
                        title="Move Section Up"
                      >
                        
                      </button>
                      <button
                        className="move-down-button"
                        onClick={() =>
                          handleMoveSectionDown(activeTabIndex, groupIndex, sectionIndex)}
                        title="Move Section Down"
                      >
                        
                      </button>
                      <button
                       className="remove-tab-button"
                        onClick={() =>
                          handleRemoveSection(activeTabIndex, groupIndex, sectionIndex)
                        }
                        title="Remove Section"
                      >
                        
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddLink(activeTabIndex, groupIndex, sectionIndex)}
                    >
                      Add Link
                    </button>
                    {section.links.map((link, linkIndex) => (
  <div key={linkIndex} className="link-container">
    <select
      value={link.type}
      onChange={(e) =>
        handleLinkChange(
          activeTabIndex,
          groupIndex,
          sectionIndex,
          linkIndex,
          'type',
          e.target.value
        )
      }
    >
      <option value="">Select Link Type</option>
      <option value="zip">ZIP</option>
  <option value="pdf">PDF</option>
  <option value="html">HTML</option>
  <option value="book-svg">Book</option>
  <option value="excel-icon">Excel</option>
  <option value="topic-icon">Topic</option>
  <option value="txt-icon">Text</option>
    </select>
    <input
      type="text"
      value={link.url}
      placeholder="Link URL"
      onChange={(e) =>
        handleLinkChange(
          activeTabIndex,
          groupIndex,
          sectionIndex,
          linkIndex,
          'url',
          e.target.value
        )
      }
    />
    <input
      type="text"
      value={link.displayText}
      placeholder="Display Text"
      onChange={(e) =>
        handleLinkChange(
          activeTabIndex,
          groupIndex,
          sectionIndex,
          linkIndex,
          'displayText',
          e.target.value
        )
      }
    />
    <div className="link-actions">
      <button
        className="move-up-button"
        onClick={() =>
          handleMoveLinkUp(activeTabIndex, groupIndex, sectionIndex, linkIndex)
        }
        title="Move Link Up"
      >
        
      </button>
      <button
        className="move-down-button"
        onClick={() =>
          handleMoveLinkDown(activeTabIndex, groupIndex, sectionIndex, linkIndex)
        }
        title="Move Link Down"
      >
        
      </button>
      <button
        className="remove-link-button"
        onClick={() =>
          handleRemoveLink(activeTabIndex, groupIndex, sectionIndex, linkIndex)
        }
        title="Remove Link"
      >
        
      </button>
    </div>
  </div>
))}

                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tabs;