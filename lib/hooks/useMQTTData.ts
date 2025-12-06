import { useConsumerStore } from "@/store/consumerStore"
import { useEffect, useState } from "react"
import mqtt from "mqtt"
import { setUpClient } from "../services/MQTTConsumerService"

export const useMQTTData = () => {

    const {update} = useConsumerStore((state)=>state)
    const [isInited , setIsInited] = useState<boolean>(false)

    const clientId = "mqtt_frontend_" + Math.random().toString(16).slice(3)

    const [client,setClient] = useState<mqtt.MqttClient|null>(null)

    useEffect(()=>{
        if(!client) {
            setClient(setUpClient(clientId,update))
            setIsInited(true)
        }
    },[])

    return {isInited}

}