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
import { useLocalStorage } from "../utils/hooks";

interface ContextValues {
  stream: MediaStream | null;
  call: Call | null;
  name: string;
  setName: (name: string) => void;
  id: string;
  setId: (newId: string) => void;
  callAccepted: boolean;
  callEnded: boolean;
  myVideo: RefObject<HTMLVideoElement>;
  peerVideo: RefObject<HTMLVideoElement>;
  connectionRef: RefObject<Peer.Instance>;
  callUser: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  switchMediaDevice: (on: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
}

const SocketContext = createContext<ContextValues | null>(null);
const socket = io(config.serverUrl, { autoConnect: true });

const constraints: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 1024, //1280,
    height: 576, //720,
  },
};

interface Props {
  children: ReactNode;
}

const ContextProvider = ({ children }: Props) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const { value: config, update: setConfig } = useLocalStorage<Config>(
    "config",
    { myVideoOn: false, peerVideoOn: false }
  );
  const [id, setId] = useState<string>("");
  const { value: name, update: setName } = useLocalStorage<string>("name", "");
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(true);
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (name.length === 0) return;
    console.log("sending username:", name);
    socket.emit("newUser", name);
  }, [name]);

  useEffect(() => {
    console.log("useEffect()");
    console.log("id:", id);

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

    // // debug
    // console.log("registering event listener");
    // socket.onAny((data) => {
    //   console.log("onAny:", { data });
    // });

    socket.on("rosterUpdate", (roster) => {
      console.log("roster updated");
      console.log({ roster });
    });

    // When reconnected, send username again
    socket.io.on("reconnect", () => {
      socket.emit("newUser", name);
    });

    // me event handler
    socket.on("me", (newId: string) => {
      console.log("socket.io:me");
      // store user ID
      if (typeof id !== "string") {
        console.log("received ID is not string:", id);
        return;
      }
      if (newId !== id) setId(id);
    });

    // calluser event handler
    socket.on("calluser", (payload) => {
      // validate name
      const { from, name, signal } = validateCallUserPayload(payload);
      // set call
      setCall({ isReceivedCall: true, from, name, signal });
    });
  }, [config, setConfig]);

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
  const callUser = async (calleeId: string) => {
    console.log("calluser()");
    // check to see if user have media stream and call
    // if (!stream) {
    // throw new Error("Media stream is null.");
    // }
    if (!call) {
      throw new Error("Call is an empty object.");
    }
    // create a new peer
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
        ? stream
        : await navigator.mediaDevices.getUserMedia(constraints),
    });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      socket.emit("calluser", {
        callerId: id,
        callerName: name,
        signal,
        calleeId,
      });
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
        id,
        setId,
        name,
        setName,
        call,
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

const useSocketContext = () => useContext(SocketContext);
export { ContextProvider, useSocketContext };
