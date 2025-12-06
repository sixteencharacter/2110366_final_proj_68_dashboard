import mqtt from "mqtt";
import { consumerDataSchema } from "../utils";
import { MQTTConsumerData } from "@/types/consumerType";


export const setUpClient = (clientId : string ,callback : (dat : MQTTConsumerData) => void) => {

    const localClient = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_ENDPOINT,{
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
            const dictData = consumerDataSchema.parse(JSON.parse(payload.toString()));
            callback(dictData);
        }
        catch(e) {console.log("Ignore as it didn't matched with the pattern",e)}
    })

    return localClient
}