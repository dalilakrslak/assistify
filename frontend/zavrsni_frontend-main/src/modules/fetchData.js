import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs
  } from 'firebase/firestore';
import { database } from './firebase.js';

const API_BASE_URL = 'https://magicplannerbe-production.up.railway.app';

export async function getChildren(managerId, includeCounter = false) {
    return fetch(`${API_BASE_URL}/api/v1/manager/children/${managerId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (includeCounter) {
                const employeesWithCounter = data.map((employee, index) => ({
                    ...employee,
                    counter: index + 1,
                }));
                return employeesWithCounter;
            }
            return data;
        })
        .catch((error) => {
            console.error(error);
        }
    );
}

export async function getEmployee(employeeId) {
    return fetch(`${API_BASE_URL}/api/v1/child/${employeeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      }
    );
}
  
  export async function updateEmployee(employeeId, updatedEmployee) {
    return fetch(`${API_BASE_URL}/api/v1/child/update/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployee),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      }
    );
}

export async function createEmployee(formData) {
    return fetch(`${API_BASE_URL}/api/v1/child/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      }
    );
}

export async function deleteEmployee(employeeId) {
  return fetch(`${API_BASE_URL}/api/v1/child/${employeeId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
      });
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


export async function getMaterials() {
    const materialsCollection = collection(database, 'materials');
    const materialsSnapshot = await getDocs(materialsCollection);
    const materials = [];
    materialsSnapshot.forEach((doc) => {
        materials.push({ id: doc.id, ...doc.data() });
    });
    return materials;
}

export async function deleteMaterial(id){
    const materialDocRef = doc(database, 'materials', id);
    await deleteDoc(materialDocRef);
}

export async function saveMaterial(name, fileType, url, createdAt) {
    try {
        const materialData = {
            name: name,
            contentType: fileType,
            downloadURL: url,
            created: createdAt,
        };
    
        const docRef = await addDoc(collection(database, 'materials'), materialData);
        console.log('Material added with ID: ', docRef.id);
    } 
    catch (error) {
        console.error('Error adding material: ', error);
    }
}

export async function updateUser(updatedUser) {
    return fetch(`${API_BASE_URL}/api/v1/manager/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
        mode: 'cors',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) => {
          console.error(error);
        }
    );
}

export async function getAccountSettings(id) {
  return fetch(`${API_BASE_URL}/api/v1/account/settings/${id}`)
      .then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .catch((error) => {
          console.error(error);
      });
}

export async function updateAccountSettings(id, updatedSettings) {
  return fetch(`${API_BASE_URL}/api/v1/account/settings/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSettings),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .catch((error) => {
      console.error(error);
  });
}

export async function getTasks(employeeId) {
  return fetch(`${API_BASE_URL}/api/v1/task/${employeeId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function deleteTask(taskId) {
  return fetch(`${API_BASE_URL}/api/v1/task/${taskId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function addSubTask(taskId, subTaskName) {
  return fetch(`${API_BASE_URL}/api/v1/task/sub`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: subTaskName,
      task: {
        id: taskId,
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function deleteSubTask(subTaskId) {
  return fetch(`${API_BASE_URL}/api/v1/task/sub/${subTaskId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

