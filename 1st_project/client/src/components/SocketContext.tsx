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
import { validateCallUserMessage } from "../utils/validator";
import { Call, CallUserMessage, Config, Roster } from "../utils/types";
import { useLocalStorage } from "../utils/hooks";

interface ContextValues {
  stream: MediaStream | null;
  call: Call | null;
  name: string;
  setName: (name: string) => void;
  id: string;
  roster: Roster;
  callAccepted: boolean;
  callEnded: boolean;
  myVideo: RefObject<HTMLVideoElement>;
  peerVideo: RefObject<HTMLVideoElement>;
  connectionRef: RefObject<Peer.Instance>;
  callUser: (callee: { id: string; name: string }) => Promise<void>;
  answerCall: () => void;
  leaveCall: () => void;
  switchMediaDevice: (on: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
  calling: boolean;
}

const SocketContext = createContext<ContextValues | null>(null);
const socket = io(config.serverUrl, { autoConnect: true });
// debugging purpose
socket.onAny((data) => {
  console.log("onAny:", { data });
});

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
  const [calling, setCalling] = useState<boolean>(false);
  const { value: config, update: setConfig } = useLocalStorage<Config>(
    "config",
    { myVideoOn: false, peerVideoOn: false }
  );
  const [id, setId] = useState<string>("");
  const { value: name, update: setName } = useLocalStorage<string>("name", "");
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(true);
  const [roster, setRoster] = useState<Roster>({});
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

    // debug
    console.log("registering event listener");

    socket.on("rosterUpdate", (roster: Roster) => {
      console.log("roster updated:", { roster });
      setRoster(roster);
    });

    // When reconnected, send username again
    socket.io.on("reconnect", () => {
      socket.emit("newUser", name);
    });

    // me event handler
    socket.on("me", (newId: string) => {
      console.log("socket.io:me", newId);
      // store user ID
      if (typeof id !== "string") {
        console.log("received ID is not string:", id);
        return;
      }
      if (newId !== id) {
        console.log("set new ID:", newId);
        setId(newId);
      }
    });

    // calluser event handler
    socket.on("callUser", (payload) => {
      console.log("socket.on(callUser):", { payload });
      // validate name
      const { caller, callee, signal } = validateCallUserMessage(payload);
      // set call
      setCall({ isReceivedCall: true, caller, callee, signal });
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

    /**
     * create a new peer
     */
    const peer = new Peer({ initiator: false, trickle: false, stream });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      console.log("peer.on(signal) received");
      socket.emit("answerCall", { signal, caller: call.caller });
    });
    // once user receives media stream, then do the followings
    peer.on("stream", (mediaStream) => {
      console.log("peer on stream received");
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
  const callUser = async (callee: { id: string; name: string }) => {
    console.log(`calling user '${callee.id}'`);
    // update calling status
    setCalling(true);
    /**
     * create a new peer
     * this will initiate comminucation between ICE server
     * and create SDP offer
     * then peer.on("signal") event listener will be kicked
     */
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined,
    });
    console.log("peer created");
    // // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      // signal should be {type: "offer", sdp:"....."}
      socket.emit(
        "callUser",
        validateCallUserMessage({
          caller: { id, name },
          callee,
          signal,
        } as CallUserMessage)
      );
    });

    // // once user receives media stream, then do the followings
    // peer.on("stream", (mediaStream) => {
    //   console.log("peer on stream received");

    //   // check to see if peerRef is attached to vide element
    //   if (!peerVideo.current) {
    //     throw new Error("peerVideo is not set");
    //   }
    //   // set media stream
    //   peerVideo.current.srcObject = mediaStream;
    // });

    // peer.on("callAccepted", (signal) => {
    //   console.log("peer on callAccedpted received");

    //   setCallAccepted(true);
    //   // send a signal
    //   peer.signal(signal);
    //   // preserve peer connection
    //   connectionRef.current = peer;
    // });
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
        name,
        setName,
        roster,
        call,
        calling,
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
