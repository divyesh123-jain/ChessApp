import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRoom } from '@huddle01/react/hooks';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ; // Replace with your actual API key

const RoomJoining = ({ roomId }) => {
  const [roomToken, setRoomToken] = useState('');
  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log('Joined the room');
    },
    onLeave: () => {
      console.log('Left the room');
    },
    onError: (error) => {
      console.error('Socket Connection Error:', error);
    },
  });

  useEffect(() => {
    const fetchRoomToken = async () => {
      try {
        const response = await axios.post(
          'https://api.huddle01.com/api/v1/join-room-token',
          {
            roomId: roomId,
            userType: 'host', // Assuming the userType is 'host', adjust as needed
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey, // Replace with your actual API key
            },
          }
        );
        console.log(response)
        setRoomToken(response.data.token); // Assuming the response contains the room token
      } catch (error) {
        console.error('Error fetching room token:', error);
      }
    };

    fetchRoomToken();
  }, [roomId]);

  console.log(roomToken)

  const handleJoinRoom = () => {
    console.log('Trying to join room:', roomId, roomToken); // Check the values here
    if (roomToken) {
        console.log('Room token available, attempting to join room...');
        try {
          joinRoom({
            roomId: roomId,
          
          });
        } catch (error) {
          console.error('Error joining room:', error);
        }
      } else {
        console.error('Room token is not available');
      }
    
  };

  return (
    <div>
      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={() => leaveRoom(roomId)}>Leave Room</button>
    </div>
  );
};

export default RoomJoining;
