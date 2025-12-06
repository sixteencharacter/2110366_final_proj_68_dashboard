export interface useMQTTProps {
    host : string;
}

export interface useMQTTData {
    gameState : string;
    heartBeat : number;
    gameResult : GameResult;
    analysisProgress : number;
    isTalking : boolean
}

export interface GameResult {
  result : string;
  confidence : number;
}

export interface MQTTConsumerData {
    gameState : "idle" | "processing" | "recording" | "result" | string;
    result : 0 | 1 | -1 | number;
    bpm : number;
    micOn : 0 | 1 | number;
}

export interface ConsumerStoreAction {
    update : ({gameState , result , bpm , micOn} : MQTTConsumerData) => void
}

export interface PresentationData {
    gameState : "idle" | "processing" | "recording" | "result" | string;
    heartBeat : number;
    gameResult : {result : string , confidence : number};
    isTalking : boolean
}