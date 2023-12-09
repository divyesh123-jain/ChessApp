import React from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";


function Huddle() {
 const search = useSearchParams();
 const roomId = search.get('roomid');

  return (
    <div>
      {
      `${roomId}`
      }
    </div>
  )
}

export default Huddle


  