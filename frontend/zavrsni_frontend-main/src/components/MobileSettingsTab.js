import React, { useState, useEffect } from "react";
import "../styles/MobileSettingsTab.css";
import QRCode from "react-qr-code";
import { RingLoader } from "react-spinners";
import { getAccountSettings, updateAccountSettings } from "../modules/fetchData";

const MobileSettingsTab = ({ id }) => {
  const [accountSettings, setAccountSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFontColor, setSelectedFontColor] = useState("#000");
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState("#000");
  const [selectedPriorityTaskColor, setSelectedPriorityTaskColor] = useState("#000");
  const [selectedNormalTaskColor, setSelectedNormalTaskColor] =  useState("#000");
  const [selectedSubTaskColor, setSelectedSubTaskColor] = useState("#000");
  const [selectedProgressColor, setSelectedProgressColor] = useState("#000");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAccountSettings(id);
        setAccountSettings(data);
        setLoading(false);
        setSelectedFontColor(data.colorForFont);
        setSelectedBackgroundColor(data.colorForBackground);
        setSelectedPriorityTaskColor(data.colorOfPriorityTask);
        setSelectedNormalTaskColor(data.colorOfNormalTask);
        setSelectedSubTaskColor(data.colorForSubtask);
        setSelectedProgressColor(data.colorForProgress);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, [id]);

  const saveAccountSettings = async () => {
    try {
      await updateAccountSettings(id, {
        font: accountSettings.font,
        fontSize: accountSettings.fontSize,
        colorForFont: selectedFontColor,
        colorForBackground: selectedBackgroundColor,
        colorOfPriorityTask: selectedPriorityTaskColor,
        colorOfNormalTask: selectedNormalTaskColor,
        colorForSubtask: selectedSubTaskColor,
        colorForProgress: selectedProgressColor,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleFontChange = (selectedFont) => {
    setAccountSettings({ ...accountSettings, font: selectedFont });
  };

  const handleFontSizeChange = (newFontSize) => {
    setAccountSettings({ ...accountSettings, fontSize: newFontSize });
  };

  const handleColorChange = (color, key) => {
    switch (key) {
      case "font":
        setSelectedFontColor(color);
        break;
      case "background":
        setSelectedBackgroundColor(color);
        break;
      case "priorityTask":
        setSelectedPriorityTaskColor(color);
        break;
      case "normalTask":
        setSelectedNormalTaskColor(color);
        break;
      case "subTask":
        setSelectedSubTaskColor(color);
        break;
      case "progress":
        setSelectedProgressColor(color);
        break;
      default:
        break;
    }
  };

  const handleSaveSettings = () => {
    saveAccountSettings();
  };

  return (
    <div className="postavke-mobilne">
      <div className="details-mobile">
        <div className="form-group">
          <label htmlFor="font">Font:</label>
          <select value={accountSettings ? accountSettings.font : ""} onChange={(e) => handleFontChange(e.target.value)} className="font-select">
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Impact">Impact</option>
            <option value="Arial Narrow">Arial Narrow</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Palatino Linotype">Palatino Linotype</option>
            <option value="Garamond">Garamond</option>
            <option value="MS Sans Serif">MS Sans Serif</option>
            <option value="MS Serif">MS Serif</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fontSize">Veličina fonta:</label>
          <div className="font-size-input">
            <input type="number" id="fontSize" value={accountSettings ? accountSettings.fontSize : ""} onChange={(e) => handleFontSizeChange(e.target.value)} />
          </div>
        </div>
        <div className="form-group color-group">
          <label htmlFor="fontColor">Boja fonta:</label>
          <input type="color" id="fontColor" value={selectedFontColor} onChange={(e) => handleColorChange(e.target.value, "font")} />
        </div>
        <div className="form-group color-group">
          <label htmlFor="backgroundColor">Boja pozadine:</label>
          <input type="color" id="backgroundColor" value={selectedBackgroundColor} onChange={(e) => handleColorChange(e.target.value, "background")} />
        </div>
        <div className="form-group color-group">
          <label htmlFor="priorityTaskColor">Boja za prioritetne zadatke:</label>
          <input type="color" id="priorityTaskColor" value={selectedPriorityTaskColor} onChange={(e) => handleColorChange(e.target.value, "priorityTask")} />
        </div>
        <div className="form-group color-group">
          <label htmlFor="normalTaskColor">Boja za manje prioritetne zadatke:</label>
          <input type="color" id="normalTaskColor" value={selectedNormalTaskColor} onChange={(e) => handleColorChange(e.target.value, "normalTask")} />
        </div>
        <div className="form-group color-group">
          <label htmlFor="subTaskColor">Boja za podzadatke:</label>
          <input type="color" id="subTaskColor" value={selectedSubTaskColor} onChange={(e) => handleColorChange(e.target.value, "subTask")} />
        </div>
        <div className="form-group color-group">
          <label htmlFor="progressColor">Boja napretka:</label>
          <input type="color" id="progressColor" value={selectedProgressColor} onChange={(e) => handleColorChange(e.target.value, "progress")} />
        </div>
        <button className="mobile-save" onClick={handleSaveSettings}>SPREMI PROMJENE</button>
      </div>
      <div className="qr-code">
        <h2>QR KOD ZA PRIJAVU:</h2>
        {loading ? (
          <div className="loading-spinner">
            <RingLoader color="#000" loading={loading} />
          </div>
        ) : (
          <QRCode size={250} bgColor="white" fgColor="black" value={accountSettings ? accountSettings.phoneLoginString : ''} />
        )}
      </div>
    </div>
  );
};

export default MobileSettingsTab;
