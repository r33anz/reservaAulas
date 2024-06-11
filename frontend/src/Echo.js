import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'a4e9e5ec11a261881b84',
    cluster: 'sa1',
    forceTLS: true,
});

export default echo;