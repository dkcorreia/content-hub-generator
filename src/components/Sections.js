import React from 'react';

function Sections({ sections, onSectionsChange }) {
  const handleAddSection = () => {
    const newSection = { name: '', description: '', links: [] };
    onSectionsChange([...sections, newSection]);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    onSectionsChange(updatedSections);
  };

  const handleAddLink = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].links.push({ url: '', type: 'none' });
    onSectionsChange(updatedSections);
  };

  const handleLinkChange = (sectionIndex, linkIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].links[linkIndex] = {
      ...updatedSections[sectionIndex].links[linkIndex],
      [field]: value,
    };
    onSectionsChange(updatedSections);
  };

  return (
    <div>
      <h3>Sections</h3>
      {sections.map((section, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Section Name"
            value={section.name}
            onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
          />
          <textarea
            placeholder="Section Description"
            value={section.description}
            onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
          />
          <div>
            <h4>Links</h4>
            {section.links.map((link, linkIndex) => (
              <div key={linkIndex}>
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, linkIndex, 'url', e.target.value)}
                />
                <select
                  value={link.type}
                  onChange={(e) => handleLinkChange(index, linkIndex, 'type', e.target.value)}
                >
                  <option value="none">No Icon</option>
                  <option value="zip">ZIP File</option>
                  <option value="pdf">PDF File</option>
                  <option value="html">HTML File</option>
                </select>
              </div>
            ))}
            <button onClick={() => handleAddLink(index)}>Add Link</button>
          </div>
        </div>
      ))}
      <button onClick={handleAddSection}>Add Section</button>
    </div>
  );
}

export default Sections;
