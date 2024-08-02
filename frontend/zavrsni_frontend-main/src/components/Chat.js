import React, { useState, useEffect } from 'react';
import '../styles/Chat.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserTie, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { database } from '../modules/firebase';
import { getChildren } from '../modules/fetchData';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [managerId, setManagerId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            const loggedInUserId = loggedInUser.id;
            setManagerId(loggedInUserId);
            const fetchData = async () => {
                try {
                    const children = await getChildren(loggedInUserId);
                    setEmployees(children);
                } catch (error) {
                    console.error('Error fetching children:', error);
                }
            };
    
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            signInAndListen();
        }
    }, [selectedEmployee]);
    
    const signInAndListen = async () => {
        try {
            const collectionRef = collection(database, selectedEmployee.email);
            const q = query(collectionRef, orderBy('createdAt', 'desc'));

            return onSnapshot(q, querySnapshot => {
                console.log('Received messages:');
                const receivedMessages = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt ? data.createdAt.toDate() : new Date(); 
                    return {
                        _id: doc.id,
                        createdAt,
                        text: data.text,
                        user: data.user
                    };
                });
                console.log(receivedMessages); 
                setMessages(receivedMessages); 
            });
        } catch (error) {
            console.log("Login error:", error.message);
        }
    };

    const onSendMessage = async (e) => {
        e.preventDefault();
    
        if (!selectedEmployee) return; 
    
        if (newMessage.trim() === '') return;
    
        const message = {
            text: newMessage,
            user: {
                _id: managerId,
                avatar: 'https://i.pravatar.cc/300'
            },
            createdAt: serverTimestamp() 
        };
    
        try {
            await addDoc(collection(database, selectedEmployee.email), message); 
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-container">
            <div className="employee-list">
                <h2>RAZGOVORI</h2>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="  Pretraži zaposlenike..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul>
                    {filteredEmployees.map((employee) => (
                        <li key={employee.id} className={selectedEmployee === employee ? 'selected' : ''} onClick={() => setSelectedEmployee(employee)}>
                            <div className="employee-icon">
                                <FontAwesomeIcon icon={ faUserTie } size='lg' />
                            </div>
                            <div className="employee-details">
                                <p className='employee-details-p'>{employee.name} {employee.surname}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-window">
                {selectedEmployee ? (
                    <div className="chat-window-content">
                        <div className="chat-header">
                            <h2>{selectedEmployee.name} {selectedEmployee.surname}</h2>
                        </div>
                        <div className="message-container">
                            {messages.map((message) => (
                                <div key={message._id} className={`message-poruka ${message.user._id === managerId ? 'sent' : 'received'}`}>

                                    <div className={`message ${message.user._id === managerId ? 'sent' : 'received'}`}>
                                        <p>{message.text}</p>
                                        <small>{message.user.name}</small>
                                        <div className="message-time">
                                            <span>{message.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> 
                        <form className="message-input" onSubmit={onSendMessage}>
                            <input 
                                type="text" 
                                placeholder="  Unesi poruku..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                        </form>
                    </div>
                ) : (
                    <div className="no-chat-selected">
                        <FontAwesomeIcon icon={faCommentDots} size="3x" color="#ccc" />
                        <p>Odaberite zaposlenika da biste započeli razgovor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
