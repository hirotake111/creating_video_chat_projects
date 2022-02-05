import { SignalData } from "simple-peer";

export interface CallUserMessage {
  caller: {
    id: string;
    name: string;
  };
  callee: {
    id: string;
    name: string;
  };
  signal: SignalData;
}

export interface Call {
  isReceivedCall: boolean;
  caller: { id: string; name: string };
  callee: { id: string; name: string };
  signal: SignalData;
}

export interface Config {
  myVideoOn: boolean;
  peerVideoOn: boolean;
}

export interface Roster {
  [key: string]: string;
}
