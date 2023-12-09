import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { useRoom ,  useLocalAudio,
  useLocalPeer,
  useLocalVideo,
  usePeerIds, } from '@huddle01/react/hooks';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { useSearchParams } from 'next/navigation'
import RemotePeer from '@/component/RemotePeer';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ; // Replace with your actual API key

const RoomJoining = () => {
    const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
    const { enableAudio, isAudioOn, stream: audioStream } = useLocalAudio();
    const search = useSearchParams();
    const roomId = search.get('roomid');
    
    
    
    
  const [roomToken, setRoomToken] = useState('');
  const { joinRoom, leaveRoom } = useRoom({
    onJoin: (room) => {
      console.log("onJoin", room);
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
    onLeave: () => {
      console.log('Left the room');
    },
    onError: (error) => {
      console.error('Socket Connection Error:', error);
    },
  });

  const { peerIds } = usePeerIds();

  const videoRef = useRef();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  console.log({ audioStream, isAudioOn });

  console.log({ peerIds });


    const fetchRoomToken = async () => {
      try {
        const response = await axios.post(
          'https://api.huddle01.com/api/v1/join-room-token',
          {
            roomId: roomId,
            userType: 'guest', // Assuming the userType is 'host', adjust as needed
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

    
  

  

  const handleJoinRoom  = async () => {
    fetchRoomToken();
    console.log("this is the api key" , apiKey);
    console.log("this is the room id" , roomId)
    
        try {
          const accessToken = new AccessToken({
            apiKey,
            roomId, // Use the roomId received as a prop
            role: Role.HOST,
            permissions: {
              admin: true,
              canConsume: true,
              canProduce: true,
              canProduceSources: {
                cam: true,
                mic: true,
                screen: true,
              },
              canRecvData: true,
              canSendData: true,
              canUpdateMetadata: true,
         
            },
            options: {
              metadata: {
                walletAddress: 'axit.eth', // Add any custom metadata here
              },
            },
          });
      
          // Use the accessToken to join the room
          console.log(await accessToken.toJwt())
          await joinRoom({
            roomId,
            token: await accessToken.toJwt(), // Get the JWT token from AccessToken
          });
     
          console.log('Joined the room');
        } catch (error) {
          console.error('Error joining room:', error);
        }
      };
  

      
    
      
    
    
 

  return (
    <>
    <div>
{
    `${roomId}`
}
      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={() => leaveRoom(roomId)}>Leave Room</button>

      <button
      className="bg-blue-500 p-2 mx-2"
      onClick={async () => {
        await enableVideo();
      }}
    >
      Enable Video
    </button>
    </div>

    <button
    className="p-2 mx-2"
    onClick={async () => {
      await disableVideo();
    }}
  >
    Disable Video
  </button>

    <div className="relative flex place-items-center  before:lg:h-[360px]">
    {isVideoOn && (
      <video
        ref={videoRef}
        className=""
        autoPlay
        muted
      />
    )}
  </div>

    <div className="mt-4 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
    {peerIds.map((peerId) =>
      peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
    )}
  </div>

      
  

    

   
</>

  );
};

export default RoomJoining;
