import React, { useState } from 'react';
import Modal from "@/component/Modal";
import CreateRoom from '@/component/CreateRoom';
const apiKey = 'process.env.NEXT_PUBLIC_API_KEY ';
export default function Home() {
  const [roomId, setRoomId] = useState(null);

  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId);
  };

  return (
   <>
   <CreateRoom apiKey={apiKey} onRoomCreated={handleRoomCreated} />
   </>
  );
}
