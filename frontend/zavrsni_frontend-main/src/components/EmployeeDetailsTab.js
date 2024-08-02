import React, { useState, useEffect } from "react";
import "../styles/EmployeeDetailsTab.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { getEmployee, updateEmployee } from "../modules/fetchData";

const EmployeeDetailsTab = ({ id, onUpdate }) => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const employeeData = await getEmployee(id);
          setEmployee(employeeData);
          setEditedEmployee(employeeData);
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEmployee(employee);
  };

  const handleSaveEdit = async () => {
    try {
      await updateEmployee(id, editedEmployee);
      setIsEditing(false);
      setEmployee(editedEmployee);
      onUpdate(editedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="postavke">
      {isEditing ? (
        <div className="forma">
          <div className="settings-group">
            <label className="settings-label" htmlFor="name"> {" "} Ime:{" "} </label>
            <input type="text" name="name" id="name" value={editedEmployee.name || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value }) } className="settings-input" />
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="surname"> {" "} Prezime:{" "} </label>
            <input type="text" name="surname" id="surname" value={editedEmployee.surname || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, surname: e.target.value, }) } className="settings-input" />
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="gender"> {" "} Spol:{" "} </label>
            <select name="gender" id="gender" value={ editedEmployee.kidMale !== undefined ? editedEmployee.kidMale.toString() : "" } onChange={(e) => setEditedEmployee({ ...editedEmployee, kidMale: e.target.value === "true", }) } className="settings-input" >
              <option value="true">Muški</option>
              <option value="false">Ženski</option>
            </select>
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="dateOfBirth"> {" "} Datum rođenja:{" "} </label>
            <input type="date" name="dateOfBirth" id="dateOfBirth" value={editedEmployee.dateOfBirth || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, dateOfBirth: e.target.value, }) } className="settings-input" />
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="qualities"> {" "} Kvalitete:{" "} </label>
            <textarea name="qualities" id="qualities" value={editedEmployee.qualities || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, qualities: e.target.value, }) } className="settings-input" />
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="preferences"> {" "} Preferencije:{" "} </label>
            <textarea name="preferences" id="preferences" value={editedEmployee.preferences || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, preferences: e.target.value, }) } className="settings-input" />
          </div>
          <div className="settings-group">
            <label className="settings-label" htmlFor="special"> {" "} Specijalni zahtjevi:{" "} </label>
            <textarea name="special" id="special" value={editedEmployee.special || ""} onChange={(e) => setEditedEmployee({ ...editedEmployee, special: e.target.value, }) } className="settings-input" />
          </div>
          <div className="buttons-container">
            <button onClick={handleCancelEdit} className="goBack"> <FontAwesomeIcon icon={faLeftLong} size="2x" style={{ color: "#07255d" }} /> </button>
            <button onClick={handleSaveEdit} className="saveUpdate"> {" "} SPREMI PROMJENE{" "} </button>
          </div>
        </div>
      ) : (
        <div className="details-emp">
          <p className="opis-emp"> {" "} <strong>Ime:</strong> {employee ? employee.name : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Prezime:</strong> {employee ? employee.surname : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Spol:</strong>{" "} {employee ? (employee.kidMale ? "Muški" : "Ženski") : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Datum rođenja: </strong>{" "} {employee ? new Date(employee.dateOfBirth).toLocaleDateString("en-GB") : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Kvalitete:</strong> {employee ? employee.qualities : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Preferencije:</strong>{" "} {employee ? employee.preferences : "-"}{" "} </p>
          <p className="opis-emp"> {" "} <strong>Specijalni zahtjevi:</strong>{" "} {employee ? employee.special : "-"}{" "} </p>
          <button className="employee-button" onClick={handleEdit}> {" "} UREDI{" "} </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailsTab;
