import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRoom } from '@huddle01/react/hooks';
import Router from "next/router";
function Huddle() {
 
const [roomId, setRoomID]= useState();





    // const { joinRoom, leaveRoom } = useRoom({
    //     onJoin: (roomId) => {
    //       if(!roomId){
    //         alert('Please enter a valid Room ID');
    //         return;
    //       }
    //       console.log('Joined the room');
    //     },
    //     onLeave: () => {
    //       console.log('Left the room');
    //     },
    //   });

    function joinRoom(roomId){
      if(!roomId){
        alert('Please enter a valid room id');
        return
      }
      Router.push(`/joinnow?roomid=${roomId}`)
    }

      


  return (
    <>
    <div className="max-w-4xl shadow-lg mx-auto my-10 flex flex-col place-content-center place-items-center py-10 gap-y-4">
      
    <label
  for="Username"
  class="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1"
>
  <input
    type="text"
    id="Username"
    class="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-1"
    placeholder="Enter Room ID"
    onChange={(e)=>{
      setRoomID(e.target.value);
      console.log(roomId);
    }}
  />

  <span
    class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
  >
    Room ID
  </span>
</label>
    <a onClick={() => joinRoom(roomId)} 
    class="group relative inline-block focus:outline-none focus:ring" >
  <span
    class="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
  ></span>

  <span
    class="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
  >
    Join Room
  </span>
</a>
   
  {/* <span
    onClick={() => joinRoom(roomId)}
    class="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
  >
    Download
  </span> */}
      
      {/* <button onClick={() => leaveRoom(roomId)}>
        Leave Room
      </button>  */}
    </div>
    
    
    
    </>
      
  )
}

export default Huddle


  