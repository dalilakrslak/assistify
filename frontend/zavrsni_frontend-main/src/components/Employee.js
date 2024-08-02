import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Employee.css";
import TaskTab from "./TaskTab";
import MobileSettingsTab from "./MobileSettingsTab";
import EmployeeDetailsTab from "./EmployeeDetailsTab";
import Calendar from "./Calendar";
import StatisticsTab from "./StatisticsTab";
import { getEmployee } from "../modules/fetchData";

function Employee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const employeeData = await getEmployee(id); 
          setEmployee(employeeData);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    setEmployee(updatedEmployee);
  };

  return (
    <div>
      <div className="employee-header">
        <div className="employee-lower-header">
          <div className="employee-basic-info">
            <div className="employee-basic-info-text">
              <p className="employee-title">
                {employee ? `${employee.name} ${employee.surname}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="employee-nav">
        <ul className="tab-employee">
          <li className="nav-item-employee">
            <button className={`nav-link-employee ${ activeTab === "details" ? "active" : "" }`} onClick={() => handleTabClick("details")} > Detalji </button>
          </li>
          <li className="nav-item-employee">
            <button className={`nav-link-employee ${ activeTab === "tasks" ? "active" : "" }`} onClick={() => handleTabClick("tasks")} > Zadaci </button>
          </li>
          <li className="nav-item-employee">
            <button className={`nav-link-employee ${ activeTab === "calendar" ? "active" : "" }`} onClick={() => handleTabClick("calendar")} > Kalendar </button>
          </li>
          <li className="nav-item-employee">
            <button className={`nav-link-employee ${ activeTab === "mobile" ? "active" : "" }`} onClick={() => handleTabClick("mobile")} > Mobilna aplikacija </button>
          </li>
          <li className="nav-item-employee">
            <button className={`nav-link-employee ${ activeTab === "statistics" ? "active" : "" }`} onClick={() => handleTabClick("statistics")} > Statistika </button>
          </li>
        </ul>
      </div>
      <div className="employee-details">
        {activeTab === "details" && (
          <EmployeeDetailsTab id = {id} onUpdate={handleEmployeeUpdate} />
        )}
        {activeTab === "tasks" && (
          <TaskTab employeeId={id} />
        )}
        {activeTab === "mobile" && (
          <MobileSettingsTab id = {id} />
        )}
        {activeTab === "calendar" && (
          <Calendar id = {id} />
        )}
        {activeTab === "statistics" && (
          <StatisticsTab id = {id} />
        )}
      </div>
    </div>
  );
}

export default Employee;
