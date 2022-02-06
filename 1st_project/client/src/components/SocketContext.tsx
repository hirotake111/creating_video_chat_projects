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
import {
  Call,
  CallStatus,
  CallUserMessage,
  Config,
  Roster,
} from "../utils/types";
import { useLocalStorage, useMediaStream } from "../utils/hooks";

interface ContextValues {
  stream: MediaStream | undefined;
  call: Call | null;
  name: string;
  setName: (name: string) => void;
  id: string;
  roster: Roster;
  callEnded: boolean;
  myVideo: RefObject<HTMLVideoElement>;
  peerVideo: RefObject<HTMLVideoElement>;
  connectionRef: RefObject<Peer.Instance>;
  callUser: (callee: { id: string; name: string }) => Promise<void>;
  answerCall: (caller: { id: string; name: string }) => Promise<void>;
  leaveCall: () => void;
  config: Config;
  setConfig: (config: Config) => void;
  calling: boolean;
  callStatus: CallStatus;
  setCallStatus: (newStatus: CallStatus) => void;
  switchAudio: (enabled: boolean) => Promise<void>;
  switchVideo: (enabled: boolean) => Promise<void>;
}

const SocketContext = createContext<ContextValues | null>(null);
const socket = io(config.serverUrl, { autoConnect: true });
// debugging purpose
socket.onAny((event) => {
  console.log("onAny:", { event });
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
  // const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const {
    stream,
    ref: myVideo,
    getStream,
    switchAudio,
    switchVideo,
  } = useMediaStream();
  const [call, setCall] = useState<Call | null>(null);
  const [calling, setCalling] = useState<boolean>(false);
  const [config, setConfig] = useState<Config>({
    myVideoOn: false,
    peerVideoOn: false,
  });
  const [id, setId] = useState<string>("");
  const { value: name, update: setName } = useLocalStorage<string>("name", "");
  const [callEnded, setCallEnded] = useState<boolean>(true);
  const [roster, setRoster] = useState<Roster>({});
  // const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>({
    type: "notSignedIn",
  });

  useEffect(() => {
    if (name.length === 0) return;
    console.log("sending username:", name);
    socket.emit("newUser", name);
    setCallStatus({ type: "available" });
  }, [name]);

  useEffect(() => {
    // debug
    console.log("registering event listener");

    // // get and set media stream
    // navigator.mediaDevices
    //   .getUserMedia(constraints)
    //   .then((mediaStream) => {
    //     setStream(mediaStream);
    //   })
    //   .catch((reason) => {
    //     console.error("failed to get media stream. reason:", reason);
    //   });

    socket.on("rosterUpdate", (roster: Roster) => {
      console.log("roster updated:", { roster });
      setRoster(roster);
    });

    // me event handler
    socket.on("me", (newId: string) => {
      console.log("socket.io:me", newId);
      if (newId.length > 0) {
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
      // update call status
      setCallStatus({ type: "receivingCall", caller });
    });
  }, [config, setConfig]);

  useEffect(() => {
    // When reconnected, send username again
    socket.io.on("reconnect", () => {
      socket.emit("newUser", name);
    });
  }, [name]);

  /**
   * answer incoming call
   */
  const answerCall = async (caller: { id: string; name: string }) => {
    // if (!call) {
    //   throw new Error("Call is an empty object.");
    // }

    // get media stream
    let mediaStream: MediaStream | undefined;
    try {
      await getStream();
    } catch (e) {
      console.error("Failed to get media stream. Reason:", e);
    }

    /**
     * create a new peer
     */
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      console.log("peer.on(signal) received");
      socket.emit("answerCall", { signal, caller });
      // change state
      // setCallAccepted(true);
      setCallStatus({ type: "onCall" });
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
    console.log("sending signal");
    // peer.signal(call.signal);
    // preserve peer connection
    connectionRef.current = peer;
  };

  /**
   * initiates a call
   */
  const callUser = async (callee: { id: string; name: string }) => {
    console.log(`calling user '${callee.id}'`);
    // update calling status
    // setCalling(true);
    setCallStatus({ type: "beforeCalling" });

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
      setCallStatus({ type: "calling", callee });
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
        callEnded,
        myVideo,
        peerVideo,
        connectionRef,
        callUser,
        answerCall,
        leaveCall,
        switchAudio,
        switchVideo,
        config,
        setConfig,
        callStatus,
        setCallStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);
export { ContextProvider, useSocketContext };
