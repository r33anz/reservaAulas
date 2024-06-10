<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TeacherNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $teacherId;
    public $message;

    public function __construct($teacherId, $message)
    {
        $this->teacherId = $teacherId;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('teacher.'.$this->teacherId);
    }

    public function broadcastWith()
    {
        return ['message' => $this->message];
    }

    public function broadcastAs()
    {
        return 'TeacherNotification';
    }
    
}
