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

export interface AnswerMessage {
  caller: { id: string; name: string };
  signal: any;
}
