import { SignalData } from "simple-peer";

export interface CallUserPayload {
  from: string;
  name: string;
  signal: SignalData;
}

export interface Call {
  isReceivedCall: boolean;
  from: string;
  name: string;
  signal: SignalData;
}

export interface Config {
  myVideoOn: boolean;
  peerVideoOn: boolean;
}

export interface Roster {
  [key: string]: string;
}
