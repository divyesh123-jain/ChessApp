import React from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRoom } from '@huddle01/react/hooks';

function Huddle() {
 const search = useSearchParams();
 const roomId = search.get('roomid');


    const { joinRoom, leaveRoom } = useRoom({
        onJoin: () => {
          console.log('Joined the room');
        },
        onLeave: () => {
          console.log('Left the room');
        },
      });


  return (
    <div>
      {
      `${roomId}`
      }
      <div>
      <button onClick={() => joinRoom(roomId)}>
        Join Room
      </button>      
      <button onClick={() => leaveRoom(roomId)}>
        Leave Room
      </button> 
    </div>
    </div>
  )
}

export default Huddle


  