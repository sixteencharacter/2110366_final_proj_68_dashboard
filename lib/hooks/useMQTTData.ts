import React, { useState } from "react";
import mqtt from "mqtt";
import {z} from "zod"

interface useMQTTProps {
    host : string;
}

interface useMQTTData {
    gameState : string;
    heartBeat : number;
    gameResult : GameResult;
    analysisProgress : number;
    isTalking : boolean
}

interface GameResult {
  result : string;
  confidence : number;
}

const dataSchema = z.object({
    gameState : z.string(),
    result : z.int(),
    bpm : z.float32(),
    micOn : z.int()
})

export const useMQTTData = ({host} : useMQTTProps) : useMQTTData => {

    const [gameState , setGameState] = useState<string>('idle');
    const [heartBeat,setHeartBeat] = useState<number>(72);
    const [gameResult , setgameResult] = useState<GameResult>({result : 'Inconclusive' , confidence : 95});
    const [analysisProgress,setAnalysisProgress] = useState<number>(0);
    const [isTalking , setIsTalking] = useState<boolean>(false);

    const [client,setClient] = useState<mqtt.MqttClient|null>(null);

    const clientId = "mqtt_frontend_" + Math.random().toString(16).slice(3)
    
    const translateResult = (x : number) => {
        switch(x) {
            case -1 :
                return 'Inconclusive'
            case 1 :
                return 'Truth'
            case 0 :
                return 'Lie'
            default : 
                return 'Inconclusive'
        }
    }

    React.useMemo(()=>{
        if(!client) {
            const localClient = mqtt.connect(host,{
                clientId,
                clean : true,
                connectTimeout : 4000,
                reconnectPeriod : 1000,
            })
            localClient.on('connect',()=>{
                console.log("Connection to mqtt established !")
            })

            localClient.subscribe('msg/data',(err,grant,packet)=>{})

            localClient.on('message',(topic,payload)=>{
                console.log(`Got Message from topic ${topic}`);
                try {
                    const dictData = dataSchema.parse(JSON.parse(payload.toString()));
                    setGameState(dictData.gameState)
                    setHeartBeat(dictData.bpm)
                    setIsTalking(dictData.micOn == 1)
                    setAnalysisProgress(50)
                    setgameResult({result : translateResult(dictData.result) , confidence : 95})
                }
                catch(e) {console.log("Ignore as it didn't matched with the pattern",e)}
            })
            setClient(localClient)
        }
    },[client])





    return {gameState,heartBeat,gameResult,analysisProgress,isTalking}
}