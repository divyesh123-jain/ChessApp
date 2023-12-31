import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { CHESS_CONTRACT_ABI, CHESS_CONTRACT_ADDRESS } from '@/constants';
import Web3Modal from 'web3modal';
import { Contract, providers, utils } from "ethers";
import Modal from '../component/Modal'
import { useRoom ,  useLocalAudio,
  useLocalPeer,
  useLocalVideo,
  
  usePeerIds, } from '@huddle01/react/hooks';

import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import Router from 'next/router';
import RemotePeer from './RemotePeer';
const BaseUrl = "https://chess-app-beta.vercel.app/";
const apiKey = process.env.NEXT_PUBLIC_API_KEY ; // Replace with your actual API key


const RoomJoining = ({ roomId }) => {
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, isAudioOn, stream: audioStream } = useLocalAudio();
  const [TransactionSuccessfull , setTransactionSuccessfull] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [roomToken, setRoomToken] = useState('');
  const web3ModalRef = useRef(null); 
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

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };


  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 11155111) {
      window.alert('Change the network to sepolia');
      throw new Error('Change network to sepolia');
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'sepolia',
        providerOptions: {}, // You may add provider options here
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className="">
          Connect your wallet
        </button>
      );
    }

    if (loading) {
      return <button className="">Loading...</button>;
    }

    
  };



  const depositToContract = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);

      const contract = new Contract(CHESS_CONTRACT_ADDRESS, CHESS_CONTRACT_ABI, signer);
      const transaction = await contract.deposit({ value: utils.parseEther('0.001') });

      await transaction.wait();
      setLoading(false);
      {setTransactionSuccessfull(true)   }
   
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleJoinRoom  = async () => {
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
          setShowModal(true);
          console.log('Joined the room');
        } catch (error) {
          console.error('Error joining room:', error);
        }
      };

      const handleCloseModal = () => {
        // Function to close the modal
        setShowModal(false);
      };
  
      
    
//  const JoinAsGuest = () => {
//   Router.push(`test?roomid=${roomId}`)
//  }
 
  return (
    <>
    <Modal />
 
<div className=''>
Joining Info: {BaseUrl}test?roomid={roomId}
</div>



  <button onClick={handleJoinRoom} className="mx-2">
    Join Room
  </button>
  <div>
  {showModal && ( // Render the modal if showModal is true
  <Modal handleClose={handleCloseModal} /> // Assuming Modal component takes a handleClose prop
)}


      
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

  <button
  className="p-2 mx-2"
  onClick={async () => {
    await enableAudio();
  }}
>
  Enable Audio
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
