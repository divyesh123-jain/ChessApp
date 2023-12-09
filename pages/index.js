import React, { useState } from 'react';
import Modal from "@/component/Modal";
import CreateRoom from '@/component/CreateRoom';
import RoomJoining from '@/component/RoomJoining';
const apiKey = 'process.env.NEXT_PUBLIC_API_KEY ';
export default function Home() {
  const [roomId, setRoomId] = useState(null);

  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId);
  };

  return (
   <>
   <div>
      <h1>Huddle01 Room Management</h1>
      <CreateRoom apiKey={apiKey} onRoomCreated={handleRoomCreated} />
      {roomId && <RoomJoining roomId={roomId} />}
    </div>
   </>
  );
}
