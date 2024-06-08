// src/echo.js
// src/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '34501d8e5f67e7da7e0b',
    cluster: 'us2',
    forceTLS: true,
});

export default echo;
