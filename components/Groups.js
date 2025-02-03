import React from 'react';

function Groups({ groups, onGroupsChange }) {
  // Add a new group
  const handleAddGroup = () => {
    const newGroup = { title: '', sections: [] };
    onGroupsChange([...groups, newGroup]);
  };

  // Change group title
  const handleGroupTitleChange = (groupIndex, newTitle) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].title = newTitle;
    onGroupsChange(updatedGroups);
  };

  // Add a new section to a group
  const handleAddSectionToGroup = (groupIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].sections.push({ name: '', description: '', links: [] });
    onGroupsChange(updatedGroups);
  };

  // Change a section inside a group
  const handleSectionChangeInGroup = (groupIndex, sectionIndex, updatedSection) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].sections[sectionIndex] = updatedSection;
    onGroupsChange(updatedGroups);
  };

  return (
    <div>
      <h3>Groups</h3>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="group-container" style={{ border: '1px solid gray', padding: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Group Title"
            value={group.title}
            onChange={(e) => handleGroupTitleChange(groupIndex, e.target.value)}
          />
          <button onClick={() => handleAddSectionToGroup(groupIndex)}>Add Section to Group</button>
          <div>
            {group.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} style={{ marginLeft: '20px' }}>
                <input
                  type="text"
                  placeholder="Section Name"
                  value={section.name}
                  onChange={(e) =>
                    handleSectionChangeInGroup(groupIndex, sectionIndex, {
                      ...section,
                      name: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Section Description"
                  value={section.description}
                  onChange={(e) =>
                    handleSectionChangeInGroup(groupIndex, sectionIndex, {
                      ...section,
                      description: e.target.value,
                    })
                  }
                />
                {/* Link handling will go here */}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleAddGroup}>Add Group</button>
    </div>
  );
}

export default Groups;
