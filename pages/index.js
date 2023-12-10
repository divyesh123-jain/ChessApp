import React, { useState ,useEffect ,useRef} from 'react';
import Modal from "@/component/Modal";
import { Button } from '@nextui-org/react';
import CreateRoom from '@/component/CreateRoom';
import RoomJoining from '@/component/RoomJoining';
import Web3Modal from 'web3modal';
import { CHESS_CONTRACT_ABI, CHESS_CONTRACT_ADDRESS } from '@/constants';
import { Contract, providers, utils } from "ethers";


const apiKey = 'process.env.NEXT_PUBLIC_API_KEY ';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef(null); 
  const [showModal, setShowModal] = useState(false);

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

  const depositToContract = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);

      const contract = new Contract(CHESS_CONTRACT_ADDRESS, CHESS_CONTRACT_ABI, signer);
      const transaction = await contract.deposit({ value: utils.parseEther('0.001') });

      await transaction.wait();
      setLoading(false);
      window.alert("You're successfully!");
      setPaymentCompleted(true)
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
  }
  const [roomId, setRoomId] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId);
  };

  return (
   <>
   
   <div className=' bg-purple-600 '>
   
       
      
    
     
        {renderButton()}
     
        
        <CreateRoom apiKey={apiKey} onRoomCreated={handleRoomCreated} />
        <Button  onClick={depositToContract} className="bg-red-300 w-[80vh] px-5 mx-2 h-[5vh] rounded-3xl">
        Deposit to Contract
      </Button>
    
   
        {roomId && paymentCompleted && <RoomJoining roomId={roomId} />}
     
      </div>


    
   </>
  );
}
