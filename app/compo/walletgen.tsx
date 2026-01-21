"use client"
import {mn,seed} from "../utils/genmonic"
import { Button } from "@/components/ui/button"
import { generateMnemonic,mnemonicToSeedSync } from "bip39"
import { useState,useEffect } from "react"

export function Genwallet(){
    const [mn,setMn]=useState("")   
    return <div>
        <Button onClick={()=>setMn(generateMnemonic())}/>
        <Button onClick={()=>{mnemonicToSeedSync(mn)}}>Show seed</Button>
        {mn}
    </div>
}
