import {React , useState} from 'react'
import axios from 'axios'
const apiKey = "QDveI2ZEgqf62jy-r574OZ0UmrYruXS2" ;
const CreateRoom = ({  onRoomCreated }) => {
    const [roomTitle, setRoomTitle] = useState('');

    const createRoom = async () => {
        try {
          const response = await axios.post(
            'https://api.huddle01.com/api/v1/create-room',
            {
              title: roomTitle || 'Huddle01-Test', // Use a default title if none provided
              hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key':apiKey,
              },
            }
          );
    
          const responseData = response.data;

          // Check if roomId exists in the response data and extract it
          const roomId = responseData.roomId || responseData.data.roomId || null;
          console.log('Room ID:', roomId);
          onRoomCreated(roomId);
        } catch (error) {
          console.error('Error creating room:', error);
        }
      };
  return (
   <>
   <div>
   <input
     type="text"
     placeholder="Enter Room Title"
     value={roomTitle}
     onChange={(e) => setRoomTitle(e.target.value)}
   />
   <button onClick={createRoom}>Create Room</button>
 </div>
   </>
  )
}

export default CreateRoom
