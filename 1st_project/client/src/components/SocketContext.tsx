/**
 * All the socket.io logic comes here
 */
import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { config } from "../config";
import { validateCallUserPayload } from "../utils/validator";
import { Call, Config } from "../utils/types";

interface ContextValues {
  stream: MediaStream | null;
  call: Call | null;
  name: string;
  setName: (name: string) => void;
  callAccepted: boolean;
  callEnded: boolean;
  myVideo: RefObject<HTMLVideoElement>;
  peerVideo: RefObject<HTMLVideoElement>;
  connectionRef: RefObject<Peer.Instance>;
  callUser: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  /**
   * This gets media stream and set it to myVideo ref object
   */
  switchMediaDevice: (on: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
}

const SocketContext = createContext<ContextValues | null>(null);
const socket = io(config.serverUrl);

interface Props {
  children: ReactNode;
}

const ContextProvider = ({ children }: Props) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [callerId, setCallerId] = useState<string>("");
  const [call, setCall] = useState<Call | null>(null);
  const [name, setName] = useState("anonymous");
  const [config, setConfig] = useState<Config>({
    myVideoOn: false,
    peerVideoOn: false,
  });
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(true);
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    // get and set media stream
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     // store current stream
    //     setStream(currentStream);
    //     if (myVideo.current) {
    //       myVideo.current.srcObject = currentStream;
    //     }
    //   })
    //   .catch((reason) => {
    //     console.error("Error while getting media stream:", reason);
    //   });

    // me event handler
    socket.on("me", (id: string) => {
      // store user ID
      if (typeof id !== "string") {
        console.log("received ID is not string:", id);
        return;
      }
      setCallerId(id);
    });

    // calluser event handler
    socket.on("calluser", (payload) => {
      // validate name
      const {
        from,
        name: callerName,
        signal,
      } = validateCallUserPayload(payload);
      // set call
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  /**
   * answer incoming call
   */
  const answerCall = () => {
    // change state
    setCallAccepted(true);
    // check to see if user have media stream and call
    if (!stream) {
      throw new Error(
        "Media stream is null. Probably you did not get media stream at useEffect?"
      );
    }
    if (!call) {
      throw new Error("Call is an empty object.");
    }
    // create a new peer
    const peer = new Peer({ initiator: false, trickle: false, stream });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      socket.emit("answercall", { signal, to: call.from });
    });
    // once user receives media stream, then do the followings
    peer.on("stream", (mediaStream) => {
      // check to see if peerRef is attached to vide element
      if (!peerVideo.current) {
        throw new Error("peerVideo is not set");
      }
      // set media stream
      peerVideo.current.srcObject = mediaStream;
    });
    // send a signal
    peer.signal(call.signal);
    // preserve peer connection
    connectionRef.current = peer;
  };

  /**
   * initiates a call
   */
  const callUser = (calleeId: string) => {
    // check to see if user have media stream and call
    if (!stream) {
      throw new Error("Media stream is null.");
    }
    if (!call) {
      throw new Error("Call is an empty object.");
    }
    // create a new peer
    const peer = new Peer({ initiator: true, trickle: false, stream });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      socket.emit("calluser", { callerId, callerName: name, signal, calleeId });
    });
    // once user receives media stream, then do the followings
    peer.on("stream", (mediaStream) => {
      // check to see if peerRef is attached to vide element
      if (!peerVideo.current) {
        throw new Error("peerVideo is not set");
      }
      // set media stream
      peerVideo.current.srcObject = mediaStream;
    });
    peer.on("callaccepted", (signal) => {
      setCallAccepted(true);
      // send a signal
      peer.signal(signal);
      // preserve peer connection
      connectionRef.current = peer;
    });
  };

  const leaveCall = () => {
    setCallEnded(true);
    // delete current connection
    connectionRef.current?.destroy();
    // reload window
    window.location.reload();
  };

  /**
   * This gets media stream and set it to myVideo ref object
   */
  const switchMediaDevice = (on: boolean) => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: {
        width: 1024, //1280,
        height: 576, //720,
      },
    };
    if (on) {
      // turn on camera
      navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
        setStream(mediaStream);
        if (myVideo.current) {
          // display video
          myVideo.current.srcObject = mediaStream;
        }
      });
    } else {
      // turn off
      if (myVideo.current) myVideo.current.srcObject = null;
      stream?.getVideoTracks().forEach((track) => {
        // console.log("track:", track);
        track.stop();
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        stream,
        call,
        name,
        setName,
        callAccepted,
        callEnded,
        myVideo,
        peerVideo,
        connectionRef,
        callUser,
        answerCall,
        leaveCall,
        switchMediaDevice,
        config,
        setConfig,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContecxt = () => useContext(SocketContext);
export { ContextProvider, useSocketContecxt };
