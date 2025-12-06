import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {z} from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const consumerDataSchema = z.object({
    gameState : z.string(),
    result : z.int(),
    bpm : z.float32(),
    micOn : z.int()
})

export const translateResult = (x : number) => {
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