// src/App.js
import React, { useEffect, useState } from 'react';
import echo from '../echo/echo';
import axios from "axios";
const apiUrl = process.env.REACT_APP_URL;
const App = () => {
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        echo.channel('notifications')
            .listen('NotificationCreated', (e) => {
                console.log(e.message);
                setNotifications(prevNotifications => [...prevNotifications, e.message]);
                setCount(prevCount => prevCount + 1);
            });

        return () => {
            echo.leaveChannel('notifications');
        };
    }, []);

    const sendNotification = async () => {
        try {
            await axios.post(`${apiUrl}/prueba`, { message });
            setMessage('');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your notification message"
                />
                
            </div>
            <div>
                <button>
                    Notificaciones <span>{count}</span>
                </button>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
