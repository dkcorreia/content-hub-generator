import React, { useEffect, useState } from 'react';

function FormInput({ formData, onFormChange }) {
  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");
  const [tabs, setTabs] = useState(formData.tabs || []);

  // Update the local state when formData changes (e.g., when loading saved data)
  useEffect(() => {
    setTitle(formData.title || "");
    setDescription(formData.description || "");
    setTabs(formData.tabs || []);
  }, [formData]);

  const handleAddTab = () => {
    const newTab = {
      title: "",
      sections: [],
    };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    onFormChange({ title, description, tabs: updatedTabs });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onFormChange({ title: e.target.value, description, tabs });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    onFormChange({ title, description: e.target.value, tabs });
  };

  return (
    <div>
      <h3>Content Hub Form</h3>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={handleDescriptionChange} />
      </div>
      <div>
        <button onClick={handleAddTab}>Add Tab</button>
      </div>
      {/* We can expand here to add sections and other inputs */}
    </div>
  );
}

export default FormInput;
