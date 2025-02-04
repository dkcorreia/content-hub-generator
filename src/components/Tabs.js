// src/components/Tabs.js

import React, { useState } from 'react';
import './Tabs.css'; 
import PrefilteredSearchModal from './PrefilteredSearchModal'; // The new modal







function Tabs({ tabs, onTabsChange }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // === Modal state for "Add/Edit Prefiltered Search" ===
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSectionInfo, setModalSectionInfo] = useState({
    tabIndex: null,
    groupIndex: null,
    sectionIndex: null,
  });
  // We'll store the existing or new search string so the modal can be pre-filled
  const [currentSearchString, setCurrentSearchString] = useState('');

  // =================== TABS Handlers (Unchanged) ===================
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
      [updatedTabs[index - 1], updatedTabs[index]] = [
        updatedTabs[index],
        updatedTabs[index - 1],
      ];
      onTabsChange(updatedTabs);
      setActiveTabIndex(index - 1);
    }
  };

  const handleMoveRight = (index) => {
    if (index < tabs.length - 1) {
      const updatedTabs = [...tabs];
      [updatedTabs[index + 1], updatedTabs[index]] = [
        updatedTabs[index],
        updatedTabs[index + 1],
      ];
      onTabsChange(updatedTabs);
      setActiveTabIndex(index + 1);
    }
  };

  // =================== GROUP Handlers (Unchanged) ===================
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
      [groups[groupIndex - 1], groups[groupIndex]] = [
        groups[groupIndex],
        groups[groupIndex - 1],
      ];
      onTabsChange(updatedTabs);
    }
  };

  const handleMoveGroupDown = (tabIndex, groupIndex) => {
    const groups = tabs[tabIndex].groups;
    if (groupIndex < groups.length - 1) {
      const updatedTabs = [...tabs];
      const groupList = updatedTabs[tabIndex].groups;
      [groupList[groupIndex + 1], groupList[groupIndex]] = [
        groupList[groupIndex],
        groupList[groupIndex + 1],
      ];
      onTabsChange(updatedTabs);
    }
  };

  // =================== SECTION Handlers (Unchanged) ===================
  const handleAddSection = (tabIndex, groupIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].groups[groupIndex].sections.push({
      name: '',
      description: '',
      links: [],
      prefilteredSearchString: '', // Initialize
      prefilteredSearchResults:[]
    });
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

  // =================== LINK Handlers (Unchanged) ===================
  const handleAddLink = (tabIndex, groupIndex, sectionIndex) => {
    const updatedTabs = [...tabs];
    const section = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex];
    section.links.push({ type: '', url: '', displayText: '' });
    onTabsChange(updatedTabs);
  };

  const handleLinkChange = (
    tabIndex,
    groupIndex,
    sectionIndex,
    linkIndex,
    field,
    value
  ) => {
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

  // =================== NEW Prefiltered Search Modal Handlers ===================
  // 1) Open the Modal (pass existing string if any)
  const handleOpenPrefilteredSearchModal = (tIndex, gIndex, sIndex, existingString) => {
    setModalSectionInfo({ tabIndex: tIndex, groupIndex: gIndex, sectionIndex: sIndex });
    setCurrentSearchString(existingString || '');
    setIsSearchModalOpen(true);
  };

  // 2) Close the Modal (Cancel)
  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // 3) Confirm from Modal => Store the user’s search string in that section
  const handleConfirmSearchModal = (searchString) => {
    setIsSearchModalOpen(false);

    const { tabIndex, groupIndex, sectionIndex } = modalSectionInfo;
    if (tabIndex === null || groupIndex === null || sectionIndex === null) return;

    const updatedTabs = [...tabs];
    const section = updatedTabs[tabIndex].groups[groupIndex].sections[sectionIndex];
    //start to pull the prefiltered result
    let filter = decodeURIComponent(decodeURIComponent(searchString)).replaceAll("+"," ")
    let filter_list = filter.split("*")
    let product_filters = []
    let doc_type_filters = []
    for(let i=0; i< filter_list.length; i++) {
      let item_filter = filter_list[i];
      let key_value_list = item_filter.split("~");
      if (key_value_list.length===2) {
        alert(key_value_list[0])
        alert(key_value_list[1].split("_"))
        if (key_value_list[0] == "Product_custom") {
          product_filters = key_value_list[1].split("_")
        }
        if (key_value_list[0] == "Document_Type_custom") {
          doc_type_filters = key_value_list[1].split("_")
        }
      }
        
    }
    let FT_Server = "https://xilinx-staging.fluidtopics.net"
          var payload = {

              "contentLocale": "en-US",
              "filters": [{
                      "key": "ft:document_type",
                      "values": ["map", "document"]
                  }, {
                      "key": "Product_custom",
                      "values": product_filters
                  }, 
                  {
                      "key": "isLatest",
                      "values": ["true"]
                  }
              ],
              "sort": [{
                      "key": "ft:lastPublication",
                      "order": "DESC"
                  }
              ],
              "paging": {
                  "perPage": 1000,
                  "page": 1
              }

          }
      if (doc_type_filters.length !== 0) {
        payload = {

          "contentLocale": "en-US",
          "filters": [{
                  "key": "ft:document_type",
                  "values": ["map", "document"]
              }, {
                  "key": "Product_custom",
                  "values": product_filters
              }, {
                "key": "Document_Type_custom",
                "values": doc_type_filters
            },
              {
                  "key": "isLatest",
                  "values": ["true"]
              }
          ],
          "sort": [{
                  "key": "ft:lastPublication",
                  "order": "DESC"
              }
          ],
          "paging": {
              "perPage": 1000,
              "page": 1
          }

      }
      }
      let url = FT_Server + '/api/khub/clustered-search';
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer YxfWiNQvM7Ejje6WRSmCQ2K77NMskNoK' },
      body: JSON.stringify( payload)
  };
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(function(data) {
    console.log(data["results"].length)
    let html_string = "<ul>"
    let my_doc_result = []
    for (let i = 0; i < data["results"].length; i++) {
            let result = data["results"][i]["entries"][0]
            //console.log(result)
            let result_type = result["type"]
            let result_title = ""
            let result_url = ""
            let metadatas = []
            let document_type = ""
            let description = ""
            let release_date = ""
            if (result_type == "MAP") {
                result_title = result["map"]["title"]
                    //result_url  = result["map"]["readerUrl"]
                    metadatas = result["map"]["metadata"]
            } else if (result_type == "DOCUMENT") {
                result_title = result["document"]["title"]
                    //result_url  = result["document"]["readerUrl"]
                    metadatas = result["document"]["metadata"]

            }
            for (let i = 0; i < metadatas.length; i++) {
                let key = metadatas[i]["key"]
                    if (key == "Document_Type") {
                        if (metadatas[i]["values"] == null)
                            continue;

                        document_type = metadatas[i]["values"][0]
                    }
                    if (key == "Release_Date") {
                        if (metadatas[i]["values"] == null)
                            continue;

                        release_date = metadatas[i]["values"][0]
                    }
                    if (key == "ft:description") {
                        if (metadatas[i]["values"] == null)
                            continue;

                        description = metadatas[i]["values"][0]
                    }
                    if (key == "ft:prettyUrl") {
                        if (metadatas[i]["values"] == null)
                            continue;
                        if (result_type == "MAP") {

                            result_url = "/r/" + metadatas[i]["values"][0]
                        } else if (result_type == "DOCUMENT") {
                            result_url = "/v/u/" + metadatas[i]["values"][0]

                        }
                    }
            }
            html_string += "<li><a href=" + "'" + result_url + "'" + ">" + result_title + "</a>"
            html_string += "<p>Document Type:" + document_type + "</p>"
            if (description.length !== 0) {
                html_string += "<p>Description: " + description + "</p></li>"
            }
            my_doc_result.push({
                "document_type": document_type,
                "description": description,
                "title": result_title,
                "link": result_url,
                "release_date": release_date
            })
            //html_string +=my_doc_result
    }
    html_string += "</ul>"
    // console.log(html_string)
    section.prefilteredSearchString = searchString
    section.prefilteredSearchResults = my_doc_result
    onTabsChange(updatedTabs);


  });
  };

  return (
    <div>
      <h3>Tabs</h3>

      {/* ========== Tabs Navigation ========== */}
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
              />
              <button
                className="move-right-button"
                onClick={() => handleMoveRight(tabIndex)}
                title="Move Tab Right"
              />
              <button
                className="remove-tab-button"
                onClick={() => handleRemoveTab(tabIndex)}
                title="Remove Tab"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========== Active Tab Content ========== */}
      <div className="tab-content">
        {tabs.length > 0 && tabs[activeTabIndex] && (
          <div>
            {/* Tab Title & Description */}
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

            {/* Add Group */}
            <button onClick={() => handleAddGroup(activeTabIndex)}>Add Group</button>

            {/* Groups */}
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
                  />
                  <button
                    className="move-down-button"
                    onClick={() => handleMoveGroupDown(activeTabIndex, groupIndex)}
                    title="Move Group Down"
                  />
                  <button
                    className="remove-group-button"
                    onClick={() => handleRemoveGroup(activeTabIndex, groupIndex)}
                    title="Remove Group"
                  />
                </div>

                <button onClick={() => handleAddSection(activeTabIndex, groupIndex)}>
                  Add Section
                </button>

                {/* Sections */}
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
                        onClick={() => handleMoveSectionUp(activeTabIndex, groupIndex, sectionIndex)}
                        title="Move Section Up"
                      />
                      <button
                        className="move-down-button"
                        onClick={() => handleMoveSectionDown(activeTabIndex, groupIndex, sectionIndex)}
                        title="Move Section Down"
                      />
                      <button
                        className="remove-tab-button"
                        onClick={() =>
                          handleRemoveSection(activeTabIndex, groupIndex, sectionIndex)
                        }
                        title="Remove Section"
                      />
                    </div>

                    {/* ========== "Add/Edit Prefiltered Search" Button ========== */}
                    <button
                      onClick={() =>
                        handleOpenPrefilteredSearchModal(
                          activeTabIndex,
                          groupIndex,
                          sectionIndex,
                          section.prefilteredSearchString,
                          section.prefilteredSearchResults
                        )
                      }
                      style={{ marginRight: '10px' }}
                    >
                      {section.prefilteredSearchString
                        ? 'Edit Prefiltered Search String'
                        : 'Add Prefiltered Search String'}
                    </button>

                    {/* ========== "Add Link" Button ========== */}
                    <button
                      onClick={() => handleAddLink(activeTabIndex, groupIndex, sectionIndex)}
                    >
                      Add Link
                    </button>

                    {/* Show the prefiltered search if set */}
                    {section.prefilteredSearchString && (
                      <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#555' }}>
                        Test: {section.prefilteredSearchString}
                      </div>
                    )}

                    {/* Existing Links */}
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
                          />
                          <button
                            className="move-down-button"
                            onClick={() =>
                              handleMoveLinkDown(activeTabIndex, groupIndex, sectionIndex, linkIndex)
                            }
                            title="Move Link Down"
                          />
                          <button
                            className="remove-link-button"
                            onClick={() =>
                              handleRemoveLink(activeTabIndex, groupIndex, sectionIndex, linkIndex)
                            }
                            title="Remove Link"
                          />
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

      {/* ========== The PrefilteredSearchModal for adding/editing a search string ========== */}
      <PrefilteredSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onConfirm={handleConfirmSearchModal}
        defaultValue={currentSearchString}
      />
    </div>
  );
}

export default Tabs;
