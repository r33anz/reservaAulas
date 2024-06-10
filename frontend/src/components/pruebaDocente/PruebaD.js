// src/App.js
import React, { useEffect, useState } from 'react';
import echo from '../echo/echo';
import axios from "axios";
const apiUrl = process.env.REACT_APP_URL;
const App = () => {
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');
    const teacherId = sessionStorage.getItem('id');


    useEffect(() => {
        if (teacherId) {
            console.log(`Subscribing to channel: teacher.${teacherId}`);

            /*echo.channel(`teacher.${teacherId}`)
                .listen('.TeacherNotification', (e) => {
                    setNotifications(prevNotifications => [...prevNotifications, e.message]);
                    setCount(prevCount => prevCount + 1);
                });
                
                const broadcastChannel = echo.channel('broadcast');
                broadcastChannel.listen('.BroadcastNotification', (e) => {
                    console.log(`Broadcast event received: ${e.message}`);
                    setNotifications(prevNotifications => [...prevNotifications, e.message]);
                    setCount(prevCount => prevCount + 1);
                });*/
                const teacherChannel = echo.channel(`teacher.${teacherId}`);
                teacherChannel.listen('.TeacherNotification', (e) => {
                    console.log(`Event received: ${e.message}`);
                    setNotifications(prevNotifications => [...prevNotifications, e.message]);
                    setCount(prevCount => prevCount + 1);
                });
    
                const broadcastChannel = echo.channel('broadcast');
                broadcastChannel.listen('.BroadcastNotification', (e) => {
                    console.log(`Broadcast event received: ${e.message}`);
                    setNotifications(prevNotifications => [...prevNotifications, e.message]);
                    setCount(prevCount => prevCount + 1);
                });

            return () => {
                teacherChannel.stopListening('.TeacherNotification');
                echo.leaveChannel(`teacher.${teacherId}`);

                broadcastChannel.stopListening('.BroadcastNotification');
                echo.leaveChannel('broadcast');
            };
        }
    }, [teacherId]);

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
                <button onClick={sendNotification}>Send Notification</button>
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
