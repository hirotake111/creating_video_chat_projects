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
  name: string;
  id: string;
  myVideoOn: boolean;
  peerVideoOn: boolean;
}
