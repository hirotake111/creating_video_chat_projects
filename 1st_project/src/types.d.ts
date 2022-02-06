import { SignalData } from "simple-peer";

interface Candidate {
  id: string;
  name: string;
  signal: SignalData;
}

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
