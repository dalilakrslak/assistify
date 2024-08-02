import React, { useState, useEffect } from 'react';
import AddChildForm from './AddChildForm'; 
import '../styles/Home.css'; 
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getChildren, deleteEmployee  } from '../modules/fetchData';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
        const loggedInUserId = loggedInUser.id;
        const fetchData = async () => {
          try {
              const children = await getChildren(loggedInUserId, true);
              setEmployees(children);
          } catch (error) {
              console.error('Error fetching children:', error);
          }
      };
      fetchData();
    }
  }, []);

  const handleDeleteEmployee = (employeeId) => {
    deleteEmployee(employeeId)
      .then(() => {
        const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
        const updatedEmployeesWithCounter = updatedEmployees.map((employee, index) => ({
          ...employee,
          counter: index + 1,
        }));
        setEmployees(updatedEmployeesWithCounter);
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  };
  
  const toggleDropdown = (id) => {
    setOpenDropdownId(id === openDropdownId ? null : id);
  };

  const handleEmployeeAdded = (newEmployee) => {
    setShowModal(false);
    setEmployees([...employees, { ...newEmployee, counter: employees.length + 1 }]);
  };

  return (
    <div className="home-container">
      <div className="tekst">
        <h2>ZAPOSLENICI</h2>
        <button className="add-button" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} style={{ fontSize: '1.1em', marginRight: '5px' }}/> DODAJ ZAPOSLENIKA</button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span> 
            <AddChildForm onEmployeeAdded={handleEmployeeAdded} />
          </div>
        </div>
      )}

      <div className="employees-container">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-box">
            <div className="employee-actions" onClick={() => toggleDropdown(employee.id)}>
              <div className="counter">{employee.counter}</div>
              <div className="ellipsis">
                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                {openDropdownId === employee.id && (
                  <div className="dropdown">
                    <div className="dropdown-item" onClick={() => handleDeleteEmployee(employee.id)}>
                      <FontAwesomeIcon icon={faTrash} style={{ marginRight: '10px' }} /> Obriši
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Link key={employee.id} to={`/employee/${employee.id}` }>
              <div className="employee-info">
                <p className="employee-name">{employee.name} {employee.surname}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
