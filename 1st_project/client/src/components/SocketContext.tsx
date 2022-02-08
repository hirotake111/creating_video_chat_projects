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
import Peer, { SignalData } from "simple-peer";

import { config } from "../config";
import {
  validateAnswerMessage,
  validateCallUserMessage,
} from "../utils/validator";
import { CallStatus, Candidate, Config, Roster } from "../utils/types";
import { useLocalStorage, useMediaStream } from "../utils/hooks";

interface ContextValues {
  stream: MediaStream | undefined;
  name: string;
  setName: (name: string) => void;
  id: string;
  roster: Roster;
  myVideo: RefObject<HTMLVideoElement>;
  peerVideo: RefObject<HTMLVideoElement>;
  // connectionRef: RefObject<Peer.Instance>;
  callUser: (callee: { id: string; name: string }) => Promise<void>;
  answerCall: (caller: {
    id: string;
    name: string;
    signal: SignalData;
  }) => Promise<void>;
  leaveCall: (peerId: string) => void;
  cancelCall: (callerId: string) => void;
  config: Config;
  callStatus: CallStatus;
  setCallStatus: (newStatus: CallStatus) => void;
  switchAudio: (enabled: boolean) => Promise<void>;
  switchVideo: (enabled: boolean) => Promise<void>;
  disableMedia: (mediaStream: MediaStream) => void;
}

const SocketContext = createContext<ContextValues | null>(null);

const socket =
  config.serverUrl.length > 4
    ? io(config.serverUrl, { autoConnect: true })
    : io({ autoConnect: true });

// debugging purpose
socket.onAny((event) => {
  console.log("onAny:", { event });
});

interface Props {
  children: ReactNode;
}

const ContextProvider = ({ children }: Props) => {
  // const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const {
    stream,
    ref: myVideo,
    config,
    getStream,
    switchAudio,
    switchVideo,
    disableMedia,
  } = useMediaStream();
  const [id, setId] = useState<string>("");
  const { value: name, update: setName } = useLocalStorage<string>("name", "");
  const [roster, setRoster] = useState<Roster>({});
  const peerVideo = useRef<HTMLVideoElement>(null);
  // const connectionRef = useRef<Peer.Instance | null>(null);
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
      const { caller, callee } = validateCallUserMessage(payload);
      // update call status
      setCallStatus({ type: "receivingCall", caller, callee });
    });
  }, [config]);

  useEffect(() => {
    // When reconnected, send username again
    socket.io.on("reconnect", () => {
      socket.emit("newUser", name);
    });
  }, [name]);

  /**
   * answer incoming call
   */
  const answerCall = async (caller: Candidate) => {
    let mediaStream: MediaStream;
    try {
      // get media stream
      mediaStream = await getStream();
    } catch (e) {
      throw e;
    }
    console.log("got media stream", { mediaStream });
    // create a new peer
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });
    // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      console.log("peer.on(signal) received", { signal });
      const answer = validateAnswerMessage({
        caller,
        callee: { id, name, signal },
      });
      console.log("sending answer;", { answer });
      // send answer message
      socket.emit("answerCall", answer);
      // change state
      console.log("oncall");
      setCallStatus({ type: "onCall", ...answer });
      // if call closed manually perform below
      socket.on("callManuallyEnded", () => {
        disableMedia(mediaStream);
        setCallStatus({ type: "available" });
      });
      // leave call if something happened
      socket.on("callended", () => {
        disableMedia(mediaStream);
        leaveCall(caller.id);
        setCallStatus({ type: "available" });
      });
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

    peer.on("connect", () => {
      console.log("on connect:");
    });

    // send a signal
    console.log("sending signal", { signal: caller.signal });
    // connectionRef.current = peer;
    peer.signal(caller.signal);
    // preserve peer connection
  };

  /**
   * initiates a call
   */
  const callUser = async (callee: { id: string; name: string }) => {
    console.log(`calling user '${callee.id}'`);
    // update calling status
    // setCalling(true);
    setCallStatus({ type: "beforeCalling" });
    let mediaStream: MediaStream;
    try {
      // get media stream
      mediaStream = await getStream();
    } catch (e) {
      throw e;
    }
    console.log("calluser():", { stream });
    /**
     * create a new peer
     * this will initiate comminucation between ICE server
     * and create SDP offer
     * then peer.on("signal") event listener will be kicked
     */
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: mediaStream,
    });
    console.log("peer created");
    // // once user receives a signal, then do the followings
    peer.on("signal", (signal) => {
      // signal should be {type: "offer", sdp:"....."}
      const callUserMessage = validateCallUserMessage({
        caller: { id, name, signal },
        callee,
      });
      socket.emit("callUser", callUserMessage);
      setCallStatus({ type: "calling", ...callUserMessage });
      // if call is refected, disable all media tracks
      socket.on("callRejected", () => {
        console.log("callRejected");
        disableMedia(mediaStream);
        setCallStatus({ type: "available" });
      });
      // if call closed manually perform below
      socket.on("callManuallyEnded", () => {
        disableMedia(mediaStream);
        setCallStatus({ type: "available" });
      });
      // leave call if something happened
      socket.on("callended", () => {
        disableMedia(mediaStream);
        leaveCall(callee.id);
        setCallStatus({ type: "available" });
      });
    });

    // once user receives media stream, then do the followings
    peer.on("stream", (peerStream) => {
      console.log("peer on stream received");

      // check to see if peerRef is attached to vide element
      if (!peerVideo.current) {
        throw new Error("peerVideo is not set");
      }
      // set media stream
      peerVideo.current.srcObject = peerStream;
    });

    socket.on("callAccepted", (data) => {
      console.log("peer on callAccedpted received", { data });
      const { caller, callee } = validateAnswerMessage(data);
      setCallStatus({ type: "onCall", caller, callee });
      // send a signal
      peer.signal(callee.signal);
      console.log("signal sent");
      // preserve peer connection
      // connectionRef.current = peer;
    });
  };

  const leaveCall = (peerId: string) => {
    // delete current connection
    // connectionRef.current?.destroy();
    setCallStatus({ type: "available" });
    // reload window
    // window.location.reload();
    socket.emit("callManuallyEnded", peerId);
    console.log("callended", { stream, peerId });
  };

  /**
   * cancel incoming call
   */
  const cancelCall = (callerId: string) => {
    setCallStatus({ type: "available" });
    socket.emit("callRejected", callerId);
  };

  return (
    <SocketContext.Provider
      value={{
        stream,
        id,
        name,
        setName,
        roster,
        myVideo,
        peerVideo,
        // connectionRef,
        callUser,
        answerCall,
        leaveCall,
        cancelCall,
        switchAudio,
        switchVideo,
        config,
        callStatus,
        setCallStatus,
        disableMedia,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);
export { ContextProvider, useSocketContext };
