import { SignalData } from "simple-peer";

interface Candidate {
  id: string;
  name: string;
  signal: SignalData;
}

interface;

export interface CallUserMessage {
  caller: Candidate;
  callee: {
    id: string;
    name: string;
  };
}

export interface AnswerMessage {
  caller: Candidate;
  callee: Candidate;
}

export interface Call {
  isReceivedCall: boolean;
  caller: Candidate;
  callee: { id: string; name: string };
}

export interface Config {
  video: boolean;
  audio: boolean;
}

export interface Roster {
  [key: string]: string;
}

export type CallStatus =
  | { type: "notSignedIn" }
  | { type: "available" }
  | { type: "beforeCalling" }
  | ({ type: "calling" } & CallUserMessage)
  | ({ type: "receivingCall" } & CallUserMessage)
  | ({ type: "onCall" } & AnswerMessage);
