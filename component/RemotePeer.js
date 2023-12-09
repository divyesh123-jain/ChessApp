import React, { useEffect, useRef } from 'react';
import { useRemoteAudio, useRemoteVideo } from '@huddle01/react/hooks';
const apiKey = "QDveI2ZEgqf62jy-r574OZ0UmrYruXS2" ;
const RemotePeer = ({ peerId }) => {
  const { stream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const vidRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (stream && vidRef.current && state === 'playable') {
      vidRef.current.srcObject = stream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error('Error occurred while playing video...');
      };
    }
  }, [stream, state]);

  useEffect(() => {
    if (audioStream && audioRef.current && audioState === 'playable') {
      audioRef.current.srcObject = audioStream;

      audioRef.current.onloadedmetadata = async () => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error('Error occurred while playing audio...');
      };
    }
  }, [audioStream, audioState]);

  return (
    <div>
      <video
        ref={vidRef}
        autoPlay
        muted
        className="border-2 rounded-xl border-white-400 aspect-video"
      />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default React.memo(RemotePeer);
