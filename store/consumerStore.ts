import { translateResult } from "@/lib/utils";
import { ConsumerStoreAction,  MQTTConsumerData, PresentationData} from "@/types/consumerType";
import {create} from "zustand";

export const useConsumerStore = create<PresentationData & ConsumerStoreAction>((set)=>({
    gameState : 'idle',
    gameResult : {result : 'Inconclusive' , confidence : 95},
    heartBeat : 0.0,
    isTalking : false,
    update : (dat : MQTTConsumerData) => set((state)=>{
        return {
            gameState : dat.gameState,
            heartBeat : dat.bpm,
            gameResult : {
                result : translateResult(dat.result),
                confidence : 95
            },
            isTalking : dat.micOn == 1
        }
    })
}))